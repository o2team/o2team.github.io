import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { statHeader } from '@/services/stat';
import { ContentItem } from '@/types';
import { ReactComponent as Close } from '@/static/icon/close.svg';
import { ReactComponent as Logo } from '@/static/logo.svg';
import { ReactComponent as GotoIcon } from '@/static/icon/swap-right.svg';
import styles from './index.module.scss';

interface Props {
  hideMenu: boolean;
  onMenuClose: () => void;
  menuData: Map<string, ContentItem[]>;
  showingTab: number;
  onShowingTabChange: (index: number) => void;
}

const titleTab = new Map([
  ['product', '产品'],
  ['technology', '技术'],
  ['solution', '方案'],
]);

const MenuMobile: React.FC<Props> = (props: Props) => {
  const { hideMenu, onMenuClose, menuData, showingTab, onShowingTabChange } = props;

  const [tabTitle, setTabTitle] = useState<string[]>([]);
  const [tabInfo, setTabInfo] = useState<ContentItem[][]>([]);

  useEffect(() => {
    const titles = [];
    const infos = [];
    for (const [key, value] of menuData.entries()) {
      titles.push(key);
      infos.push(value);
    }
    setTabTitle(titles);
    setTabInfo(infos);
  }, [menuData]);

  const showInfoContent = useMemo(
    () =>
      tabInfo &&
      tabInfo.length > 0 &&
      tabInfo[showingTab].map((item) => (
        <a
          key={item.id}
          href={item.link || 'https://aotu.io'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => statHeader(item.name)}
        >
          <div className={styles['info-wrapper']}>
            <div className={styles.info}>
              {item.icon ? (
                <div className={styles['content-img']}>
                  <img className={styles['img-inner']} src={item.icon} alt={item.name} />
                </div>
              ) : null}
              <div className={styles['content-name']}>{item.name}</div>
            </div>
            <div className={styles.goto}>
              <GotoIcon className={styles['goto-icon']} />
            </div>
          </div>
        </a>
      )),
    [tabInfo, showingTab],
  );

  return (
    <div className={classnames(styles.wrapper, hideMenu ? null : styles['show-wrapper'])}>
      <div className={classnames(styles.circle, hideMenu ? null : styles['show-circle'])} />
      <div className={styles.content}>
        <div className={styles.opts}>
          <Close className={styles.close} onClick={onMenuClose} />
        </div>
        <div className={styles.main}>
          {tabTitle.map((item, index) => (
            <div key={index} onClick={() => onShowingTabChange(index)}>
              <span
                className={classnames(
                  styles['tab-title'],
                  showingTab == index && styles['chosen-tab'],
                )}
              >
                {titleTab.get(item)}
              </span>
              <div
                className={classnames(
                  styles.contents,
                  showingTab == index && styles['contents-show'],
                )}
              >
                {showInfoContent}
              </div>
            </div>
          ))}
          <Link onClick={onMenuClose} to={'/about'}>
            <div className={styles['tab-title']}>{'关于'}</div>
          </Link>
        </div>
      </div>

      <Logo className={styles.logo} />
    </div>
  );
};

export default MenuMobile;
