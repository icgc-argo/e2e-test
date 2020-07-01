const fetch = require('isomorphic-fetch');
const FormData = require('form-data');
const urlJoin = require('url-join');
const get = require('lodash').get;

// const { urlJoin } = require('../helpers');

/**
 * EXTRACT THESE TODO!
 */
const QUERY_FAILED_MSG = 'query failed';
const QUERY_OK_MSG = 'query ok';

const API = urlJoin(process.env.GATEWAY_API_ROOT, 'graphql');

const mapGatewayErrors = errors =>
  errors.map(({ path = '', message = '' }) => `${path.join('/')}: ${message}`).join('\n');

const checkGatewayResp = res =>
  new Promise((resolve, reject) => {
    if (res.status !== 200) {
      console.error(QUERY_FAILED_MSG, res.status);
      reject();
    } else {
      console.log(QUERY_OK_MSG);
      res.json().then(data => {
        if (data.errors && data.errors.length > 0) {
          console.log('data', data.errors[0].extensions.exception);
          reject(mapGatewayErrors(data.errors));
        } else {
          resolve(data);
        }
      });
    }
  });

const checkRespStatus = res =>
  new Promise((resolve, reject) => {
    if (res.status !== 200) {
      reject('bad response');
    } else {
      res.json().then(d => resolve(d));
    }
  });

const checkErrors = (data, errorPath = '') =>
  new Promise((resolve, reject) => {
    console.log('data', data);
    const errors = get(data, errorPath, []);
    console.log('errors', errors);
    errors.length > 0 ? reject(errors) : resolve(data);
  });

const runGqlQuery = async ({ query, variables, jwt }) => {
  return fetch(API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(res => checkRespStatus(res));
};

const uploadFileFromString = (fileData, fileName) => {
  return { fileData, fileName };
};

/**
 *
 * @param options.files is an object of structure {fileData, fileName } - use stringToUploadFile() method to generate
 */
const runGqlUpload = async ({ query, variables, jwt, files, asArray = true }) => {
  const formData = new FormData();
  const updatedVariables = { ...variables, files: [] };
  const map = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const index = '' + (i + 1);
    if (asArray) {
      updatedVariables.files.push(null);
    } else {
      updatedVariables.files = null;
    }
    map[index] = asArray ? [`variables.files.${i}`] : [`variables.files`];
  }
  const operations = {
    query,
    variables: updatedVariables,
  };
  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify(map));

  // Files have to come last
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const index = '' + (i + 1);
    const buffer = Buffer.from(file.fileData);
    formData.append(index, buffer, {
      contentType: 'text/tab-separated-values',
      name: index,
      filename: file.fileName,
    });
  }
  console.log('files', files);

  return fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  })
    .then(res => checkRespStatus(res))
    .then(data => checkErrors(data, 'data.uploadClinicalRegistration.errors'));
};

module.exports = {
  runGqlQuery,
  runGqlUpload,
  uploadFileFromString,
};
