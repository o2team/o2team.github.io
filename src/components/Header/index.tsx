import React, { useState, useMemo } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { statHeader } from '@/services/stat';
import { Header as TypeHeader } from '@/types';
import { ReactComponent as Logo } from '@/static/logo.svg';
import { ReactComponent as LogoBlue } from '@/static/logo-blue.svg';
import MenuMobile from '@/components/MenuMobile';
import styles from './index.module.scss';

interface Props {
  datas?: TypeHeader;
  hideMenuMobile: boolean;
  onMenuShow: () => void;
  onMenuHide: () => void;
}

const Header: React.FC<Props & RouteComponentProps> = (props) => {
  const { history, datas, hideMenuMobile, onMenuShow, onMenuHide } = props;

  const [menuShowingTab, setMenuShowingTab] = useState(0);

  const origin = useMemo(() => history.createHref({ pathname: '/' }), [history]);

  const mobileDatasMap = useMemo(() => {
    const datasMap = new Map();
    if (datas?.product?.content && !datasMap.has('product')) {
      datasMap.set('product', datas.product.content);
    }
    if (datas?.technology && !datasMap.has('technology')) {
      const techArr = (datas?.technology?.column?.content || []).concat(
        datas?.technology?.periodical?.content || [],
        datas?.technology?.special?.content || [],
      );
      datasMap.set('technology', techArr);
    }
    if (datas?.solution?.content && !datasMap.has('solution')) {
      datasMap.set('solution', datas.solution.content);
    }
    return datasMap;
  }, [datas]);

  const handleMenuClick = (index: number) => {
    setMenuShowingTab(index);
    onMenuShow();
  };

  const handleTabClick = (index: number) => {
    setMenuShowingTab(index);
  };

  return (
    <header className={styles.wrapper}>
      <div className={styles.content}>
        <a className={styles.logos} href={origin}>
          <LogoBlue />
          <Logo />
        </a>

        <nav className={styles['nav-pc']}>
          <span className={styles.item}>
            产品
            <div className={classnames(styles.subnav, styles['animate-fade'])}>
              <ul>
                {datas?.product?.content?.map((item) => {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => statHeader(item.name)}
                      >
                        <img src={item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.desc}</p>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </span>
          <span className={styles.item}>
            技术
            <div className={classnames(styles.subnav, styles['animate-fade'])}>
              <p className={styles.title}>专栏</p>
              <ul>
                {datas?.technology?.column?.content?.map((item) => {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => statHeader(item.name)}
                      >
                        <img src={item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.desc}</p>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className={styles.title}>期刊</p>
              <ul>
                {datas?.technology?.periodical?.content?.map((item) => {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => statHeader(item.name)}
                      >
                        <img src={item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.desc}</p>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className={styles.title}>专题</p>
              <ul>
                {datas?.technology?.special?.content?.map((item) => {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => statHeader(item.name)}
                      >
                        <img src={item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.desc}</p>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </span>

          {datas?.solution?.content?.length ? (
            <span className={styles.item}>
              方案
              <div className={classnames(styles.subnav, styles['animate-fade'])}>
                <ul>
                  {datas?.solution?.content?.map((item) => {
                    return (
                      <li key={item.name}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => statHeader(item.name)}
                        >
                          <img src={item.image} alt="" />
                          <p>{item.name}</p>
                          <p>{item.desc}</p>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </span>
          ) : null}

          <Link to={'/about'}>
            <span className={styles.item}>关于</span>
          </Link>
        </nav>

        <nav className={styles['nav-mobile']}>
          <span className={styles.item} onClick={() => handleMenuClick(0)}>
            产品
          </span>
          <span className={styles.item} onClick={() => handleMenuClick(1)}>
            技术
          </span>
          <span className={styles.item} onClick={() => handleMenuClick(2)}>
            方案
          </span>
          <Link to={'/about'}>
            <span className={styles.item}>关于</span>
          </Link>
        </nav>
        <MenuMobile
          hideMenu={hideMenuMobile}
          onMenuClose={onMenuHide}
          menuData={mobileDatasMap}
          showingTab={menuShowingTab}
          onShowingTabChange={handleTabClick}
        />
      </div>
    </header>
  );
};

export default withRouter(Header);
