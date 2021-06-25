import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import classnames from 'classnames';
import { fetchFooter, fetchHeader } from '@/services';
import { Header as TypeHeader, Footer as TypeFooter } from '@/types';
import { contextBrowser, contextEasterEgg, EasterEgg } from '@/context';
import { consoleAotu, consoleStopHint, consoleAfterStop } from '@/utils/console';
import { statEasterEggs } from '@/services/stat';
import styles from './App.module.scss';
import './App.scss';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/home';
import About from '@/pages/about';

interface Props {}

const env = process.env.REACT_APP_RELEASE_ENV;
const appName = 'o2-website';
const prefix = env === 'uat' ? `/${appName}` : '';

const App: React.FC<Props> = () => {
  const infoBrowser = useContext(contextBrowser);
  const [valueEasterEgg, setValueEasterEgg] = useState<EasterEgg>({ play: false });
  const [dataHeader, setDataHeader] = useState<TypeHeader>();
  const [dataFooter, setDataFooter] = useState<TypeFooter>();

  const [hideMenuMobile, setHideMenuMobile] = useState(true);

  const handleShowMenuMobile = () => setHideMenuMobile(false);
  const handleHideMenuMobile = () => setHideMenuMobile(true);

  useEffect(() => {
    fetchHeader().then((d) => setDataHeader((datas) => ({ ...datas, ...d })));
    fetchFooter().then((d) => setDataFooter((datas) => ({ ...datas, ...d })));
  }, []);

  // 控制台彩蛋
  useEffect(() => {
    setTimeout(() => {
      consoleAotu();
    }, 1000);
  }, []);

  // 控制台输入 play = true/false 触发彩蛋
  useEffect(() => {
    Reflect.defineProperty(window, 'play', {
      configurable: true,
      get() {
        setValueEasterEgg((datas) => ({ ...datas, play: true }));
        setTimeout(() => {
          consoleStopHint();
        }, 1000);
        statEasterEggs('play');
      },
    });
    Reflect.defineProperty(window, 'stop', {
      configurable: true,
      get() {
        setValueEasterEgg((datas) => ({ ...datas, play: false }));
        setTimeout(() => {
          consoleAfterStop();
        }, 1000);
        statEasterEggs('stop');
      },
    });

    return () => {
      Reflect.deleteProperty(window, 'play');
      Reflect.deleteProperty(window, 'stop');
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(infoBrowser?.classNames))
      document.body.classList?.add(...infoBrowser.classNames);
  }, [infoBrowser]);

  return (
    <contextEasterEgg.Provider value={valueEasterEgg}>
      <div
        className={hideMenuMobile ? styles.base : classnames(styles.base, styles['fixed-height'])}
      >
        <Router basename={prefix}>
          <Header
            datas={dataHeader}
            hideMenuMobile={hideMenuMobile}
            onMenuShow={handleShowMenuMobile}
            onMenuHide={handleHideMenuMobile}
          />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Redirect to={'/'} />
          </Switch>
          <Footer datas={dataFooter} />
        </Router>
      </div>
    </contextEasterEgg.Provider>
  );
};

export default App;
