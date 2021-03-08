import React from 'react';
import { HomeBanner as TypeBanner } from '@/types';
import Stage from './Stage';
import styles from './index.module.scss';

interface Props {
  datas?: TypeBanner;
}

const Header: React.FC<Props> = (props) => {
  const { datas } = props;

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <Stage className={styles.stage} />

        <div className={styles.dot}></div>

        <p className={styles['name-en']}>{datas?.info?.name_en}</p>

        <ul className={styles.social}>
          {datas?.content?.map((item) => {
            const icon = <img src={item.icon} alt={item.name} />;
            return (
              <li key={item.name}>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {icon}
                  </a>
                ) : (
                  icon
                )}
                {item.image ? (
                  <div className={styles.pop}>
                    <img src={item.image} alt="" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Header;
