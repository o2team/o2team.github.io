import React from 'react';
import { AboutChannel as TypeChannel } from '@/types';
import styles from './index.module.scss';

interface Props {
  datas?: TypeChannel;
}

const Channel: React.FC<Props> = (props) => {
  const { datas: { info, content } = {} } = props;

  return (
    <div className={styles.channel}>
      <div className={styles.info}>
        <div className={styles.name}>{info?.name}</div>
        <div className={styles.desc}>{info?.desc}</div>
      </div>

      <ul className={styles.content}>
        {content?.map((item, index) => {
          return (
            <li key={index}>
              <img className={styles.icon} src={item.icon} alt="" />
              <p className={styles.name}>{item.name}</p>
              <p className={styles.desc}>{item.desc}</p>
              <img className={styles.image} src={item.image} alt={item.name} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Channel;
