/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./types/index.d.ts" />
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import { contextBrowser, infoBrowser } from '@/context';

import '@/services/stat';

import App from './App';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <contextBrowser.Provider value={infoBrowser}>
      <App />
    </contextBrowser.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
