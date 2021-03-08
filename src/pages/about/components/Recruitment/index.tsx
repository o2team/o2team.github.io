import React from 'react';
import { AboutRecruitment as TypeRecruitment } from '@/types';
import Content from './Content';
import styles from './index.module.scss';

interface Props {
  datas?: TypeRecruitment;
}

const Recruitment: React.FC<Props> = (props) => {
  const { datas: { info, content } = {} } = props;

  return (
    <div className={styles.recruitment}>
      <div className={styles.info}>
        <div className={styles.name}>{info?.name}</div>
        <div className={styles.desc}>{info?.desc}</div>
      </div>

      <ul className={styles.content}>
        {content?.map((item, index) => {
          return (
            <li key={index}>
              <Content datas={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Recruitment;
