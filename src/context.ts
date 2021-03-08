import React from 'react';
import { browser } from '@/utils/detect';

export interface EasterEgg {
  play?: boolean;
}

const infoBrowser = browser;

const contextBrowser = React.createContext(infoBrowser);

const contextEasterEgg = React.createContext<EasterEgg>({
  play: false,
});

export { contextBrowser, infoBrowser, contextEasterEgg };
