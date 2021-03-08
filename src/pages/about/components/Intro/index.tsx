import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import breaks from 'remark-breaks';
import { AboutIntro as TypeIntro } from '@/types';
import PopVideo from './PopVideo';
import styles from './index.module.scss';

interface Props {
  datas?: TypeIntro;
}

const plugins = [gfm, breaks];

const group = [2, 2, 1, 2];
const groupIndex = group.reduce<Array<number>>((acc, item, index, array) => {
  acc.push((acc[index - 1] ?? 0) + (array[index - 1] ?? 0));
  return acc;
}, []);

const Intro: React.FC<Props> = (props) => {
  const { datas: { info, content } = {} } = props;
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={styles.intro}>
      <div className={styles.info}>
        <div className={styles.name}>{info?.name}</div>
        <div className={styles.name_en}>{info?.name_en}</div>
        <div className={styles.detail}>
          <ReactMarkdown plugins={plugins}>{info?.detail ?? ''}</ReactMarkdown>
        </div>
        {info?.video && (
          <button className={styles.btn} onClick={() => setVisible(true)}>
            观看视频
          </button>
        )}
      </div>

      <ul className={styles.content}>
        {group.map((item, index) => {
          const children = content?.slice(groupIndex[index], groupIndex[index] + group[index]);
          return (
            <li key={index}>
              {children?.map((item, index) => (
                <img key={index} src={item.image} alt={item.name} />
              ))}
            </li>
          );
        })}
      </ul>

      <PopVideo visible={visible} onCancel={() => setVisible(false)} urlVideo={info?.video} />
    </div>
  );
};

export default Intro;
