import React from 'react';
import classnames from 'classnames';
import { statTechnology } from '@/services/stat';
import { ContentItem } from '@/types';
import OopsImg from '@/static/icon/oops.svg';
import styles from './index.module.scss';

interface Props {
  content: ContentItem[];
}

const TechnologyColumn3: React.FC<Props> = (props: Props) => {
  const { content } = props;
  const [content0 = {} as ContentItem, content1 = {} as ContentItem] = content;

  return (
    <div className={styles.wrapper}>
      <div className={styles.item}>
        <a
          href={content0.link || 'https://aotu.io'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => statTechnology(content0.name)}
        >
          <img
            className={styles['img-inner']}
            src={content0.image || OopsImg}
            alt={content0.name || ''}
          />
        </a>
      </div>
      <div className={classnames(styles.item, styles.last)}>
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

export default TechnologyColumn3;
