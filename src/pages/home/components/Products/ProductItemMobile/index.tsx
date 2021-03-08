import React from 'react';
import { statProduct } from '@/services/stat';
import { ContentItem } from '@/types';
import { ReactComponent as Oops } from '@/static/icon/oops.svg';
import { ReactComponent as GotoIcon } from '@/static/icon/swap-right.svg';
import styles from './index.module.scss';

interface Props {
  content: ContentItem;
}

const ProductItemMobile: React.FC<Props> = (props: Props) => {
  const { content } = props;

  return (
    <a
      key={content.id}
      href={content.link || 'https://aotu.io'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => statProduct(content.name)}
    >
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles['content-img']}>
            {content.icon ? (
              <img className={styles['img-inner']} src={content.icon} alt={content.name} />
            ) : (
              <Oops />
            )}
          </div>
          <div className={styles['content-name']}>{content.name}</div>
        </div>
        <div className={styles.goto}>
          <GotoIcon className={styles['goto-icon']} />
        </div>
      </div>
    </a>
  );
};

export default ProductItemMobile;
