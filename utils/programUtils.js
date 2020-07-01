const { TEST_USERS } = require('../helpers');
const { runGqlQuery, runGqlUpload, uploadFileFromString } = require('./gatewayUtils');
const fs = require('fs');
const urljoin = require('url-join');
const { generateRegistrationFile } = require('./clinicalData');

//const REGIONS =

const generateProgram = () => {
  const createTime = new Date();
  const shortName = `Z${Math.floor(createTime.getTime() / 1000) % 10000000}-CA`;
  return {
    name: `Auto Generated Program ${shortName} - ${createTime.toISOString()}`,
    shortName,
    description: `This program was automatically generated for test purposes at ${createTime}`,
    commitmentDonors: 1234,
    website: 'https://example.com',
    institutions: ['OICR'],
    countries: ['Canada', 'United States'],
    //regions: ['North America', 'South America'],
    regions: ['Canada'],
    cancerTypes: ['Brain cancer', 'Bladder cancer'],
    primarySites: ['Brain', 'Bladder'],
    membershipType: 'FULL',
    admins: [
      {
        firstName: 'Oicr',
        lastName: 'Testuser',
        email: TEST_USERS.DCC_ADMIN.email,
        role: 'ADMIN',
      },
    ],
  };
};

// Edited input data
const generateProgram2 = () => {
  const createTime = new Date();
  const shortName = `Z${Math.floor(createTime.getTime() / 1000) % 10000000}-CA`;
  return {
    name: `Auto Generated Program ${shortName} - ${createTime.toISOString()}`,
    shortName,
    description: `This program was automatically generated for test purposes at ${createTime}`,
    commitmentDonors: '4321',
    website: 'https://exampletwo.com',
    institutions: ['Toronto General Hospital'],
    countries: ['Antarctica'],
    regions: ['Canada'],
    cancerTypes: ['Multiple'],
    primarySites: ['Stomach', 'Kidney'],
    membershipType: 'ASSOCIATE',
    admins: [
      {
        firstName: 'Oicr',
        lastName: 'Testuser',
        email: TEST_USERS.DCC_ADMIN.email,
        role: 'ADMIN',
      },
    ],
  };
};

const createProgram = ({ jwt, program }) => {
  const query = `mutation CREATE_PROGRAM($program:ProgramInput!) {
    createProgram(program:$program)
    {
      shortName
      description
      name
      commitmentDonors
      submittedDonors
      genomicDonors
      website
      institutions
      countries
      regions
      cancerTypes
      membershipType
      primarySites
      users {
        email
        firstName
        lastName
        role
      }
    }
  }`;

  return runGqlQuery({ jwt, query, variables: { program } });
};

const submitClinicalData = async ({ jwt, shortName, good }) => {
  const fileTypes = [
    'treatment',
    'donor',
    'follow_up',
    'hormone_therapy',
    'primary_diagnosis',
    'radiation',
  ];

  const query = `mutation ($shortName: String!, $files: [Upload!])
  {uploadClinicalSubmissions (programShortName:$shortName, clinicalFiles:$files){
    id
    fileErrors {
        message
        fileNames
        code
      }
  }}`;

  dataFiles = fileTypes.map(fileType => {
    const folderPath = good ? './goodtestdata/' : './badtestdata/';
    const filePath = urljoin(folderPath, `${fileType}.tsv`);
    file = fs
      .readFileSync(filePath, 'utf8')
      .split('TEST-CA')
      .join(shortName);

    return uploadFileFromString(file, fileType.concat('.tsv'), 'file');
  });

  return runGqlUpload({
    jwt,
    query,
    variables: { shortName },
    files: dataFiles,
  });
};

const registerSamples = async ({ jwt, shortName }) => {
  const file = fs
    .readFileSync('./goodtestdata/sample_registration.tsv', 'utf8')
    .split('TEST-CA')
    .join(shortName);

  const query = `mutation ($files:Upload!, $shortName:String!) {
    uploadClinicalRegistration(shortName:$shortName, registrationFile:$files) {
      id
      programShortName
      creator
      fileName
      createdAt
      records {
        row
        fields {
          name
          value
        }
      }
      errors {
        type
        message
        row
        field
        value
        sampleId
        donorId
        specimenId
      }
      fileErrors {
        message
        fileNames
        code
      }
      newDonors {
        count
        rows
        names
        values {
          name
          rows
        }
      }
      newSpecimens {
        count
        rows
        names
        values {
          name
          rows
        }
      }
      newSamples {
        count
        rows
        names
        values {
          name
          rows
        }
      }
      alreadyRegistered {
        count
        rows
        names
        values {
          name
          rows
        }
      }
    }
  }`;

  return runGqlUpload({
    jwt,
    query,
    variables: { shortName },
    // files: [],
    files: [uploadFileFromString(file, 'sample_registration.tsv', 'file')],
    asArray: false,
  });
};

module.exports = {
  generateProgram,
  generateProgram2,
  createProgram,
  registerSamples,
  submitClinicalData,
};
