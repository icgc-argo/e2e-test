import fetch from 'isomorphic-fetch';
import urlJoin from 'url-join';

const GATEWAY_API_ROOT: string = process.env.GATEWAY_API_ROOT || '';

const runGqlQuery = async ({
  query,
  variables,
  jwt,
}: {
  query: string;
  variables: { [key: string]: {} };
  jwt: string;
}): Promise<Response> => {
  return fetch(urlJoin(GATEWAY_API_ROOT, 'graphql'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(res => res.json());
};

export { runGqlQuery };
