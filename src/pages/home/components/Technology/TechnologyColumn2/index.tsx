import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { statTechnology } from '@/services/stat';
import { ContentItem } from '@/types';
import OopsImg from '@/static/icon/oops.svg';
import styles from './index.module.scss';

interface Props {
  content: ContentItem[];
}

const TechnologyColumn2: React.FC<Props> = (props: Props) => {
  const { content } = props;
  const [content0 = {} as ContentItem, content1 = {} as ContentItem] = content;

  const backgroundStyle = {
    backgroundImage: content0.image ? `url(${content0.image}) ` : null,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  const [BGImg, setBGImg] = useState({});

  useEffect(() => {
    setBGImg(backgroundStyle);
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.wrapper}>
      <div className={styles.item} style={BGImg}>
        <a
          href={content0.link || 'https://aotu.io'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => statTechnology(content0.name)}
        >
          <div className={styles['item-inner']}>
            <div className={styles.title}>
              <div className={styles.name}>{content0.name || ''}</div>
              <div className={styles.desc}>{content0.desc || ''}</div>
            </div>
            <time className={styles.date}>{content0.date || dayjs().format('YYYY-MM-DD')}</time>
          </div>
        </a>
      </div>
      <div className={styles['item-img']}>
        <a
          href={content1.link || 'https://aotu.io'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => statTechnology(content1.name)}
        >
          <img
            className={styles['img-inner']}
            src={content1.image || OopsImg}
            alt={content1.name || ''}
          />
        </a>
      </div>
    </div>
  );
};

export default TechnologyColumn2;
