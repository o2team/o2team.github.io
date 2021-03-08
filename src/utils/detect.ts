import { detect, BrowserInfo as BrowserInfoOrigin } from 'detect-browser';

interface BrowserInfo {
  name: string;
  os: string;
  type: string;
  version: number;
  classNames: Array<string>;
}

function formatDetect(info: BrowserInfoOrigin): BrowserInfo {
  const r = {
    name: info.name?.toLocaleLowerCase() ?? '',
    os: info.os?.split(' ').join('-').toLocaleLowerCase() ?? '',
    type: info.type?.toLocaleLowerCase() ?? '',
    version: +info.version?.split('.')?.[0] || 0,
  };

  return {
    ...r,
    classNames: [r.os, r.name, [r.name, r.version].join('-')],
  };
}

const browser = formatDetect(detect() as BrowserInfoOrigin);

export { browser };
