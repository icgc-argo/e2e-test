import fetch from 'isomorphic-fetch';
import urlJoin from 'url-join';
import FormData from 'form-data';
import retry from 'async-retry';

const GATEWAY_API_ROOT: string = process.env.GATEWAY_API_ROOT || '';
const defaultUrl = urlJoin(GATEWAY_API_ROOT, 'graphql');

const fetchWithRetries: typeof fetch = (
  url: RequestInfo,
  options?: RequestInit,
): Promise<Response> => {
  const request = async (bail: any) => {
    const res = await fetch(url, options);

    if (403 === res.status) {
      // don't retry upon 403
      bail(new Error('Unauthorized'));
    }

    return res;
  };

  return retry(request, { retries: 5 });
};

const runGqlQuery = async ({
  query,
  variables,
  jwt,
}: {
  query: string;
  variables: { [key: string]: {} };
  jwt: string;
}): Promise<any> => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const res = await fetchWithRetries(defaultUrl, options);
  return res.status === 200 && res.json();
};

const uploadFileFromString = (fileData: string, fileName: string) => {
  return { fileData, fileName };
};

/**
 *
 * @param options.files is an object of structure {fileData, fileName }
 * - use stringToUploadFile() method to generate
 */
const runGqlUpload = async ({
  query,
  variables,
  jwt,
  files,
  asArray = true,
}: {
  query: string;
  variables: { shortName: string };
  jwt: string;
  files: Array<{ fileData: string; fileName: string }>;
  asArray?: boolean;
}) => {
  const formData: FormData = new FormData();

  const updatedVariables: { shortName: string; files: null | Array<string | null> } = {
    ...variables,
    files: [],
  };

  const map: { [key: string]: Array<string> } = {};

  for (let i = 0; i < files.length; i++) {
    const index = `${i + 1}`;
    if (asArray && Array.isArray(updatedVariables.files)) {
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
    const index = `${i + 1}`;
    const buffer = Buffer.from(file.fileData);
    formData.append(index, buffer, {
      contentType: 'text/tab-separated-values',
      //  name: index,
      filename: file.fileName,
    });
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    // form-data type is clashing with node form-data, some methods aren't defined
    body: (formData as unknown) as BodyInit,
  };

  const resp = await fetchWithRetries(defaultUrl, options);
  return resp.status === 200 && resp.json();
};

export { runGqlQuery, runGqlUpload, uploadFileFromString };
