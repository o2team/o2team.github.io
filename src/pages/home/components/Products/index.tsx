import React, { useState, useEffect } from 'react';
import { HomeProduct, ContentItem } from '@/types';
import ProductColumn from './ProductColumn';
import ProductItemMobile from './ProductItemMobile';
import styles from './index.module.scss';

interface Props {
  datas?: HomeProduct;
}

const Products: React.FC<Props> = (props) => {
  const { datas } = props;

  const [contentCouple, setContentCouple] = useState<ContentItem[][]>([]);
  const [hoverIndex, setHoverIndex] = useState(-1);

  useEffect(() => {
    if (datas && datas.content) {
      let i = 0;
      const tempArr: ContentItem[][] = [];
      while (i < datas.content.length) {
        tempArr.push(datas.content.slice(i, Math.min(i + 2, datas.content.length)));
        i = i + 2;
      }
      setContentCouple(tempArr);
    }
  }, [datas]);

  const handleHoverCloumn = (key: number) => {
    setHoverIndex(key);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles['content-pc']}>
        <div className={styles.info}>
          <div className={styles.divider} />
          <div className={styles['name-en']}>{datas?.info?.name_en}</div>
          <div className={styles.name}>{datas?.info?.name}</div>
          <div className={styles.desc}>{datas?.info?.desc}</div>
        </div>
        <div className={styles.main}>
          {contentCouple.length > 0
            ? contentCouple.map((item, index) => (
                <ProductColumn
                  key={index}
                  content={item}
                  columnIndex={index}
                  hoverIndex={hoverIndex}
                  onColumnHover={handleHoverCloumn}
                />
              ))
            : null}
        </div>
      </div>
      <div className={styles['content-mobile']}>
        <div className={styles.divider} />
        <div className={styles.header}>
          <div className={styles.names}>
            <span className={styles['name-en']}>{datas?.info?.name_en}</span>
            <span className={styles.name}>{datas?.info?.name}</span>
          </div>
        </div>
        <div className={styles['main-mobile']}>
          {datas?.content?.map((item, index) => (
            <ProductItemMobile key={index} content={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
