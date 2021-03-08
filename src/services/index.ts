import request from '@/utils/request';
import queryString from 'query-string';
import { InfoItem, ContentItem, Header, Footer, Home, About } from '@/types';

type Queries = Array<string | [key: string, rename?: string]>;

export async function fetchResource<T>(
  method: string,
  queryArg: Record<string, unknown>,
): Promise<T | undefined> {
  const env = process.env.REACT_APP_RELEASE_ENV;
  const query = queryString.stringify({
    ...queryArg,
    env: env === 'prod' ? undefined : 'uat',
  });
  let r;

  try {
    const d = await request<T>(`https://services.jd.com/neos/${method}?${query}`);
    r = d.data;
  } catch (error) {
    console.error(error);
  }

  return r;
}

function getQueryAndMapRename(queries: Queries): [Array<string>, Map<string, string | undefined>] {
  return (
    queries?.reduce<[Array<string>, Map<string, string | undefined>]>(
      (acc, item) => {
        if (typeof item === 'string') {
          acc[0].push(item);
          acc[1].set(item, undefined);
        }
        if (Array.isArray(item)) {
          acc[0].push(item[0]);
          acc[1].set(item[0], item[1]);
        }
        return acc;
      },
      [[], new Map()],
    ) ?? []
  );
}

export async function fetchItems(queries: Queries): Promise<Record<string, InfoItem>> {
  const [query, mapRename] = getQueryAndMapRename(queries);
  const r =
    (await fetchResource<Record<string, InfoItem>>('datas', { ids: query.join(',') })) ?? {};
  return Object.fromEntries(
    Object.entries(r).map(([item, value]) => [mapRename?.get(item) ?? item, value ?? {}]),
  );
}

export async function fetchLists(queries: Queries): Promise<Record<string, Array<ContentItem>>> {
  const [query, mapRename] = getQueryAndMapRename(queries);
  const d = await Promise.all(
    query.map((i) => fetchResource<Array<ContentItem>>('form', { id: i })),
  );
  const r = Object.fromEntries(
    query.map((item, index) => [mapRename?.get(item) ?? item, d[index] ?? []]),
  );
  return r;
}

export async function fetchHomeBanner(): Promise<Home> {
  const d0 = await fetchItems([['o2-website-index-config-banner', 'banner']]);
  const d1 = await fetchLists([['o2-website-index-banner-social', 'banner']]);

  const r = {
    banner: {
      info: d0['banner'],
      content: d1['banner'],
    },
  };

  return r;
}

export async function fetchHeader(): Promise<Header> {
  const d1 = await fetchLists([
    ['o2-website-header-product', 'product'],
    ['o2-website-header-technology-column', 'technology-column'],
    ['o2-website-header-technology-periodical', 'technology-periodical'],
    ['o2-website-header-technology-special', 'technology-special'],
    ['o2-website-header-solution', 'solution'],
  ]);

  const r = {
    product: {
      content: d1['product'],
    },
    solution: {
      content: d1['solution'],
    },
    technology: {
      column: {
        content: d1['technology-column'],
      },
      periodical: {
        content: d1['technology-periodical'],
      },
      special: {
        content: d1['technology-special'],
      },
    },
  };

  return r;
}

export async function fetchFooter(): Promise<Footer> {
  const d1 = await fetchLists([
    ['o2-website-footer-product', 'product'],
    ['o2-website-footer-link', 'link'],
    ['o2-website-footer-contact', 'contact'],
  ]);

  const r = {
    product: {
      content: d1['product'],
    },
    link: {
      content: d1['link'],
    },
    contact: {
      content: d1['contact'],
    },
  };

  return r;
}

export async function fetchHome(): Promise<Home> {
  const d0 = await fetchItems([
    ['o2-website-index-config-special', 'special'],
    ['o2-website-index-config-product', 'product'],
    ['o2-website-index-config-technology', 'technology'],
    ['o2-website-index-config-solution', 'solution'],
    ['o2-website-index-config-user', 'user'],
  ]);

  const d1 = await fetchLists([
    ['o2-website-index-user', 'user'],
    ['o2-website-index-technology', 'technology'],
    ['o2-website-index-product', 'product'],
    ['o2-website-index-special', 'special'],
  ]);

  const r = {
    achievement: {
      info: d0['special'],
      content: d1['special'],
    },
    product: {
      info: d0['product'],
      content: d1['product'],
    },
    technology: {
      info: d0['technology'],
      content: d1['technology'],
    },
    solution: {
      info: d0['solution'],
      content: d1['solution'],
    },
    user: {
      info: d0['user'],
      content: d1['user'],
    },
  };

  return r;
}

export async function fetchAbout(): Promise<About> {
  const d0 = await fetchItems([
    ['o2-website-about-config-intro', 'intro'],
    ['o2-website-about-config-channel', 'channel'],
    ['o2-website-about-config-recruitment', 'recruitment'],
  ]);

  const d1 = await fetchLists([
    ['o2-website-about-images', 'intro'],
    ['o2-website-about-channel', 'channel'],
    ['o2-website-about-recruitment', 'recruitment'],
  ]);

  const r = {
    intro: {
      info: d0['intro'],
      content: d1['intro'],
    },
    channel: {
      info: d0['channel'],
      content: d1['channel'],
    },
    recruitment: {
      info: d0['recruitment'],
      content: d1['recruitment'],
    },
  };

  return r;
}
