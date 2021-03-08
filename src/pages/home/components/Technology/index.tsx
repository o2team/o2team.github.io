import React, { useState, useEffect } from 'react';
import { HomeTechnology } from '@/types';
import { statTechnology } from '@/services/stat';
import { ReactComponent as SwapRight } from '@/static/icon/swap-right.svg';
import TechnologyColumn1 from './TechnologyColumn1';
import TechnologyColumn2 from './TechnologyColumn2';
import TechnologyColumn3 from './TechnologyColumn3';
import OopsImg from '@/static/icon/oops.svg';
import styles from './index.module.scss';

interface Props {
  datas?: HomeTechnology;
}

const Technology: React.FC<Props> = (props) => {
  const { datas } = props;

  const defaultItem = { name: '' };
  const [leftItem, setLeftItem] = useState(defaultItem);
  const [midItems, setMidItems] = useState([defaultItem, defaultItem]);
  const [rightItems, setRightItems] = useState([defaultItem, defaultItem]);

  useEffect(() => {
    if (datas && datas.content && datas.content.length > 0) {
      setLeftItem(datas.content[0]);
      setMidItems(datas.content.slice(1, 3));
      setRightItems(datas.content.slice(3, 5));
    }
  }, [datas]);

  return (
    <section className={styles.wrapper}>
      <div className={styles['content']}>
        <div className={styles.divider} />
        <div className={styles.header}>
          <div className={styles.names}>
            <span className={styles['name-en']}>{datas?.info?.name_en}</span>
            <span className={styles.name}>{datas?.info?.name}</span>
          </div>
          <a href={datas?.info?.url || 'https://aotu.io'} target="_blank" rel="noopener noreferrer">
            <div className={styles.more}>
              <span>更多</span>
              <SwapRight />
            </div>
          </a>
        </div>
        <div className={styles['main-pc']}>
          <TechnologyColumn1 content={leftItem} />
          <TechnologyColumn2 content={midItems} />
          <TechnologyColumn3 content={rightItems} />
        </div>
        <div className={styles['main-mobile']}>
          {datas?.content?.map((item) => (
            <a
              key={item.id}
              target="_blank"
              href={item.link || 'https://aotu.io'}
              rel="noopener noreferrer"
              onClick={() => statTechnology(item.name)}
            >
              <div className={styles['main-item']} key={item.id}>
                <img
                  className={styles['img-inner']}
                  src={item.image_mobile ?? item.image ?? OopsImg}
                  alt={item.name}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technology;
