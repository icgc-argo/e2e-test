import { TEST_USERS } from '../helpers';
import { Program } from '../types';
import { runGqlQuery, runGqlUpload, uploadFileFromString } from './gatewayUtils';
import fs from 'fs';
import urljoin from 'url-join';
import path from 'path';

const regions: string[] = ['Canada'];

const generateProgram = (program: Partial<Program> = {}): Program => {
  const createTime = new Date();
  const shortName = `Z${Math.floor(createTime.getTime() / 1000) % 10000000}-CA`;

  return {
    ...{
      name: `Auto Generated Program ${shortName} - ${createTime.toISOString()}`,
      shortName,
      description: `This program was automatically generated for test purposes at ${createTime}`,
      commitmentDonors: 1234,
      website: 'https://example.com',
      institutions: ['OICR'],
      countries: ['Canada'],
      regions,
      cancerTypes: ['Brain cancer', 'Bladder cancer'],
      primarySites: ['Brain', 'Bladder'],
      membershipType: 'FULL',
      admins: [
        {
          firstName: 'Oicr',
          lastName: 'Testuser',
          email: TEST_USERS.DCC_ADMIN.email || '',
          role: 'ADMIN',
        },
      ],
    },
    ...program,
  };
};

const createProgram = ({ jwt, program }: { jwt: string; program: Program }) => {
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> update utils to TS
const submitClinicalData = async ({
  jwt,
  shortName,
  good,
}: {
  jwt: string;
  shortName: string;
  good: boolean;
}) => {
  const fileTypes = [
    'donor',
    'follow_up',
    'hormone_therapy',
    'primary_diagnosis',
    'chemotherapy',
    'treatment',
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

  const dataFiles = fileTypes.map(fileType => {
    const folderPath = path.resolve(__dirname, good ? '../goodtestdata/' : '../badtestdata/');
    const filePath = urljoin(folderPath, `${fileType}.tsv`);
    const file = fs
      .readFileSync(filePath, 'utf8')
      .split('TEST-CA')
      .join(shortName);

    return uploadFileFromString(file, fileType.concat('.tsv'));
  });

  return runGqlUpload({
    jwt,
    query,
    variables: { shortName },
    files: dataFiles,
  });
};

const registerSamples = async ({ jwt, shortName }: { jwt: string; shortName: string }) => {
  const file = fs
    .readFileSync(path.resolve(__dirname, '../goodtestdata/sample_registration.tsv'), 'utf8')
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
    files: [uploadFileFromString(file, 'sample_registration.tsv')],
    asArray: false,
  });
};

export { generateProgram, createProgram, registerSamples, submitClinicalData };
<<<<<<< HEAD
=======
export { generateProgram, createProgram };
>>>>>>> update and type helper functions
=======
>>>>>>> update utils to TS
