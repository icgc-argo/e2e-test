import { TEST_USERS } from '../helpers';
import { Program } from '../types';
import { runGqlQuery } from './gatewayUtils';

const generateProgram = (): Program => {
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

module.exports = {
  generateProgram,
  createProgram,
};
