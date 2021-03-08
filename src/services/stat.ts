interface HMT {
  id: string;
  // _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
  push: (
    args: [event: string, category: string, action: string, opt_label?: string, opt_value?: string],
  ) => void;
}

declare global {
  interface Window {
    _hmt: HMT;
  }
}

const _hmtPromise = new Promise<HMT>((res) => {
  window._hmt = window._hmt || [];

  const hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?dc8c227a4b13efb524467e55c26a1740';
  hm.onload = () => res(window._hmt);

  const body = document.querySelector('body');
  body?.append(hm);
});

export default async function stat(
  category: string,
  action: string,
  opt_label?: string,
  opt_value?: string,
): Promise<void> {
  const _hmt = await _hmtPromise;
  return _hmt?.push(['_trackEvent', category, action, opt_label, opt_value]);
}

export function statPage(category: string, action: string): Promise<void> {
  return stat(category, action);
}

export function statHeader(action: string): Promise<void> {
  return stat('Header_Click', action);
}

export function statAchievement(action: string): Promise<void> {
  return stat('Product_Banner_Click', action);
}

export function statProduct(action: string): Promise<void> {
  return stat('Product_Click', action);
}

export function statTechnology(action: string): Promise<void> {
  return stat('Article_Click', action);
}

export function statUser(action: string): Promise<void> {
  return stat('Partner_Click', action);
}

export function statFooter(action: string): Promise<void> {
  return stat('Bottom_Click', action);
}

export function statEasterEggs(action: string): Promise<void> {
  return stat('Easter_Eggs_Trigger', action);
}
