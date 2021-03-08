import React from 'react';
import { statUser } from '@/services/stat';
import { HomeUser } from '@/types';
import Title, { Theme } from '@/components/Title';
import styles from './index.module.scss';

interface Props {
  datas?: HomeUser;
}

const Technology: React.FC<Props> = (props) => {
  const { datas } = props;

  return (
    <section className={styles.wrapper}>
      <Title name="竭诚服务" nameEn="Service" className={styles.title} theme={Theme.light} />

      <div className={styles.content}>
        <ul className={styles.list}>
          {datas?.content?.map((item) => {
            return (
              <li key={item.name} onClick={() => statUser(item.name)}>
                <img src={item.image} alt={item.name} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Technology;
