import React from 'react';
import dayjs from 'dayjs';
import { statTechnology } from '@/services/stat';
import { ContentItem } from '@/types';
import OopsImg from '@/static/icon/oops.svg';
import styles from './index.module.scss';

interface Props {
  content: ContentItem;
}

const TechnologyColumn1: React.FC<Props> = (props: Props) => {
  const { content } = props;

  return (
    <div className={styles.wrapper}>
      <a
        href={content.link || 'https://aotu.io'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => statTechnology(content.name)}
      >
        <div className={styles['wrapper-inner']}>
          <div className={styles['content-img']}>
            <img
              className={styles['img-inner']}
              src={content.image || OopsImg}
              alt={content.name || ''}
            />
          </div>
          <div className={styles['content-intro']}>
            <div className={styles.title}>
              <div className={styles.name}>{content.name || ''}</div>
              <div className={styles.desc}>{content.desc || ''}</div>
            </div>
            <time className={styles.date}>{content.date || dayjs().format('YYYY-MM-DD')}</time>
          </div>
        </div>
      </a>
    </div>
  );
};

export default TechnologyColumn1;
