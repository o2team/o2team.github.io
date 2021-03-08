import React, { useMemo } from 'react';
import { statFooter } from '@/services/stat';
import { Footer as TypeFooter } from '@/types';
import ListMobile from './ListMobile';
import { ReactComponent as Logo } from '@/static/logo.svg';
import styles from './index.module.scss';

interface Props {
  datas?: TypeFooter;
}

const Footer: React.FC<Props> = (props) => {
  const { datas } = props;

  const mobileDatasMap = useMemo(() => {
    const datasMap = new Map();
    if (datas?.product?.content && !datasMap.has('product')) {
      datasMap.set('product', datas.product.content);
    }
    if (datas?.link?.content && !datasMap.has('link')) {
      datasMap.set('link', datas.link.content);
    }
    if (datas?.contact?.content && !datasMap.has('contact')) {
      datasMap.set('contact', datas.contact.content);
    }
    return datasMap;
  }, [datas]);

  return (
    <footer className={styles.wrapper}>
      <div className={styles.content}>
        <ListMobile className={styles['list-mobile']} content={mobileDatasMap} />
        <div className={styles.info}>
          <Logo className={styles.logo} />
          <p>Copyright © 2021. All Rights Reserved.</p>
          <p>粤ICP备15077732号-2</p>
        </div>

        <div className={styles.list}>
          <h3>产品</h3>
          {datas?.product?.content?.map((item) => {
            return (
              <p key={item.name}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => statFooter(item.name)}
                >
                  {item.name}
                </a>
              </p>
            );
          })}
        </div>

        <div className={styles.list}>
          <h3>链接</h3>
          {datas?.link?.content?.map((item) => {
            return (
              <p key={item.name}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => statFooter(item.name)}
                >
                  {item.name}
                </a>
              </p>
            );
          })}
        </div>

        <div className={styles.list}>
          <h3>联系</h3>
          {datas?.contact?.content?.map((item) => {
            return (
              <p key={item.name}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => statFooter(item.name)}
                >
                  {item.name}
                </a>
              </p>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
