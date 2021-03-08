import React, { useEffect, useState, useCallback } from 'react';
import classnames from 'classnames';
import { statFooter } from '@/services/stat';
import { ContentItem } from '@/types';
import styles from './index.module.scss';

interface Props {
  className: string;
  content: Map<string, ContentItem[]>;
}

const titleTab = new Map([
  ['product', '产品'],
  ['link', '链接'],
  ['contact', '联系'],
]);

const ListMobile: React.FC<Props> = (props: Props) => {
  const { className, content } = props;

  const [showTab, setShowTab] = useState(0);
  const [tabTitle, setTabTitle] = useState<string[]>([]);
  const [tabInfo, setTabInfo] = useState<ContentItem[][]>([]);

  useEffect(() => {
    const titles = [];
    const infos = [];
    for (const [key, value] of content.entries()) {
      titles.push(key);
      infos.push(value);
    }
    setTabTitle(titles);
    setTabInfo(infos);
  }, [content]);

  const handleTitleClick = useCallback((index) => {
    setShowTab(index);
  }, []);

  return (
    <div className={classnames(styles.wrapper, className)}>
      <div className={styles.title}>
        {tabTitle.map((item, index) => (
          <div key={index} onClick={() => handleTitleClick(index)}>
            <span className={classnames(showTab == index && styles['chosen-tab'])}>
              {titleTab.get(item)}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.info}>
        {tabInfo &&
          tabInfo.length > 0 &&
          tabInfo[showTab].map((item) => (
            <a
              key={item.id}
              href={item.link || 'https://aotu.io'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => statFooter(item.name)}
            >
              <div>{item.name}</div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default ListMobile;
