import NodeRSA from 'node-rsa';
import jwt from 'jsonwebtoken';
import config from '../config';
import { cloneDeep } from 'lodash';

interface JWT {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  aud: Array<any>;
  jti: string;
  context: {
    scope: Array<string>;
    user: {
      name: string;
      email: string;
      status: string;
      firstName: string;
      lastName: string;
      createdAt: number;
      lastLogin: number;
      preferredLanguage: string | null;
      type: string;
      permissions: Array<string>;
    };
  };
  scope: Array<string>;
}

const token: JWT = {
  iat: 1565713461,
  exp: 1985730834,
  sub: '70941c5a-7edc-4a89-b85d-18e5d5a90e5d',
  iss: 'ego',
  aud: [],
  jti: 'a2036692-c1d7-4562-b16f-2313b62a0add',
  context: {
    scope: ['PROGRAMDATA-PACA-AU.WRITE', 'PROGRAM-PACA-AU.WRITE'],
    user: {
      name: 'argo.programad@gmail.com',
      email: 'argo.programad@gmail.com',
      status: 'APPROVED',
      firstName: 'Test',
      lastName: 'Program Admin',
      createdAt: 1562625628838,
      lastLogin: 1565713461700,
      preferredLanguage: null,
      type: 'USER',
      permissions: ['PROGRAM-PACA-AU.WRITE', 'PROGRAMDATA-PACA-AU.WRITE'],
    },
  },
  scope: ['PROGRAMDATA-PACA-AU.WRITE', 'PROGRAM-PACA-AU.WRITE'],
};

/**
 * Only set permissions for current program, we don't want a large cookie to be rejected
 * @param userToken
 * @param permissions
 *
 */
export const addProgramPermissions = (userToken: string, permissions: Array<string>) => {
  const decodedToken = jwt.decode(userToken) as JWT;
  if (decodedToken) {
    const modifiedToken = cloneDeep(decodedToken);
    modifiedToken.context.scope = permissions;
    modifiedToken.context.user.permissions = permissions;
    modifiedToken.scope = permissions;
    console.log('modeifled', modifiedToken);
    const signedToken = generateToken(modifiedToken);

    return signedToken;
  } else {
    throw Error('util :: addProgramPermissions :: Cannot decode user token');
  }
};

const generateToken = (token: JWT) => {
  const key = new NodeRSA();
  key.importKey(new Buffer(config.EGO_PRIVATE_KEY, 'base64'), 'pkcs8-private-der');
  const pk = key.exportKey();
  const output = jwt.sign(token, pk, { algorithm: 'RS256' });
  console.log(output);
  return output;
};
