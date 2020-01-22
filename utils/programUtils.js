const { TEST_USERS } = require('../helpers');
const { runGqlQuery, runGqlUpload, uploadFileFromString } = require('./gatewayUtils');
const { generateRegistrationFile } = require('./clinicalData');

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
    regions: ['North America', 'South America'],
    cancerTypes: ['Brain cancer', 'Bladder cancer'],
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

const registerSamples = async ({ jwt, shortName, count }) => {
  const file = generateRegistrationFile({ shortName, count });
  const query = `mutation ($file:Upload!, $shortName:String!){
    uploadClinicalRegistration(shortName:$shortName, registrationFile:$file) {
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
  const response = await runGqlUpload({
    jwt,
    query,
    variables: { shortName },
    // files: [],
    files: [uploadFileFromString(file, 'sample_registration.tsv', 'file')],
  });
};

module.exports = {
  generateProgram,
  createProgram,
  registerSamples,
};
