import React from 'react';
import classnames from 'classnames';
import { statAchievement } from '@/services/stat';
import { ContentItem } from '@/types';
import styles from './index.module.scss';

interface Props {
  content: ContentItem;
  index: number;
}

const AchievementItem: React.FC<Props> = (props: Props) => {
  const { content, index } = props;

  let wrapperClass = styles.wrapper;
  if (index == 4) wrapperClass += ` ${styles['wrapper-last']}`;
  if (index % 2 != 0) wrapperClass += ` ${styles['wrapper-odd']}`;

  return (
    <div className={classnames(wrapperClass)}>
      <a
        key={content.id}
        href={content.link || 'https://aotu.io'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => statAchievement(content.name)}
      >
        <div className={styles['content-img']}>
          <img className={styles['img-inner']} src={content.image} alt={content.name} />
        </div>
        <div className={styles['content-underline']} />
        <div className={styles['content-name']}>{content.name}</div>
        <div className={styles['content-desc']}>{content.desc}</div>
      </a>
    </div>
  );
};

export default AchievementItem;
