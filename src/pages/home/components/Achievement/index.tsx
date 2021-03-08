import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { HomeAchievement } from '@/types';
import AchievementItem from './AchievementItem';
import styles from './index.module.scss';
import { ReactComponent as SwapLeft } from '@/static/icon/swap-left.svg';
import { ReactComponent as SwapRight } from '@/static/icon/swap-right.svg';

interface Props {
  datas?: HomeAchievement;
}

const Achievement: React.FC<Props> = (props: Props) => {
  const { datas } = props;

  const [pageTotal, setPageTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (datas && datas.content) {
      // page 从 0 开始计数
      setPageTotal(Math.ceil(datas.content.length / 5) - 1);
    }
  }, [datas, pageTotal]);

  const handlePageBack = useCallback(() => {
    if (page > 0) {
      setPage(page - 1);
    }
  }, [page]);

  const handlePageForward = useCallback(() => {
    if (page < pageTotal) {
      setPage(page + 1);
    }
  }, [page, pageTotal]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.divider} />
        <div className={styles.header}>
          <div className={styles.names}>
            <span className={styles['name-en']}>{datas?.info?.name_en}</span>
            <span className={styles.name}>{datas?.info?.name}</span>
          </div>
          <div className={styles.paging}>
            <div
              className={classnames(styles.backward, page != 0 ? styles['can-turning'] : '')}
              onClick={handlePageBack}
            >
              <SwapLeft />
            </div>
            <div className={styles['vertical-divider']} />
            <div
              className={classnames(styles.forward, page != pageTotal ? styles['can-turning'] : '')}
              onClick={handlePageForward}
            >
              <SwapRight />
            </div>
          </div>
        </div>
        <div className={styles['main-pc']}>
          {datas?.content?.slice(page * 5, page * 5 + 5).map((item, index) => (
            <AchievementItem key={item.id} content={item} index={index} />
          ))}
        </div>
        <div className={styles['main-mobile']}>
          {datas?.content?.map((item, index) => (
            <AchievementItem key={item.id} content={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievement;
