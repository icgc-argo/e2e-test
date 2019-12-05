const fetch = require('isomorphic-fetch');
const FormData = require('form-data');
const urlJoin = require('url-join');

// const { urlJoin } = require('../helpers');

const runGqlQuery = async ({ query, variables, jwt }) => {
  return new Promise((resolve, reject) => {
    fetch(urlJoin(process.env.GATEWAY_API_ROOT, 'graphql'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then(res => resolve(res.json()));
  });
};

const uploadFileFromString = (fileData, fileName, gqlVariableName) => {
  return { fileData, fileName, gqlVariableName };
};

/**
 *
 * @param options.files is an object of structure {fileData, fileName, gqlVariableName} - use stringToUploadFile() method to generate
 */
const runGqlUpload = async ({ query, variables, jwt, files }) => {
  const formData = new FormData();
  const updatedVariables = { ...variables };
  const map = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const index = '' + (i + 1);
    updatedVariables[file.gqlVariableName] = null;
    map[index] = [`variables.${file.gqlVariableName}`];
  }
  const operations = {
    query,
    variables: updatedVariables,
  };
  console.log(JSON.stringify(operations));
  console.log(JSON.stringify(map));
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

  return new Promise((resolve, reject) => {
    fetch(urlJoin(process.env.GATEWAY_API_ROOT, 'graphql'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    }).then(res => resolve(res.json()));
  });
};

module.exports = {
  runGqlQuery,
  runGqlUpload,
  uploadFileFromString,
};
