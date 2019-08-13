const { TEST_USERS } = require('../helpers');

const generateProgram = () => {
  const createTime = new Date();
  const shortName = `Z${Math.floor(createTime.getTime() / 1000) % 10000000}-CA`.replace(/0/, '1');
  return {
    name: `Auto Generated Program ${shortName} - ${createTime.toISOString()}`,
    shortName,
    countries: ['Canada', 'United States'],
    cancerTypes: ['Brain cancer', 'Bladder cancer'],
    primarySites: ['Brain', 'Bladder'],
    commitment: 1234,
    membershipType: 'FULL',
    website: 'https://example.com',
    description: `This program was automatically generated for test purposes at ${createTime}`,
    insitutions: ['OICR'],
    regions: ['North America', 'South America'],
    piFirstName: 'Oicr',
    piLastName: 'Testuser',
    piEmail: TEST_USERS.DCC_ADMIN.email,
  };
};

module.exports = {
  generateProgram,
};
