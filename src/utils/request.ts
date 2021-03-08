import fetch from 'isomorphic-fetch';

export interface RequestResult<T> {
  code?: string;
  msg?: string;
  data?: T;
}

async function parseRes(response: Response) {
  const contentType = response.headers.get('Content-type');

  if (contentType?.startsWith('application/json')) {
    const data = await response.json();
    return data;
  }
  if (contentType?.startsWith('text/html')) {
    const data = await response.text();
    return data;
  }

  throw new Error('unknown content type');
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);

  throw error;
}

export default function request<T, U = RequestResult<T>>(
  url: string,
  options?: Record<string, unknown>,
): Promise<U> {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseRes)
    .catch((err) => ({ err }));
}
