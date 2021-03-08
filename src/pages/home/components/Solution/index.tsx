import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { HomeSolution } from '@/types';
import Title, { Theme } from '@/components/Title';
import styles from './index.module.scss';

interface Props {
  datas?: HomeSolution;
}

const Solution: React.FC<Props> = (props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { datas } = props;

  return (
    <section className={styles.wrapper}>
      <Title
        className={classnames(styles.title, isPlaying ? styles.playing : null)}
        name="一体化方案"
        nameEn="Program"
        theme={Theme.light}
      />
      <div className={styles.content}>
        <video
          controls
          controlsList="nodownload"
          ref={ref}
          src={datas?.info?.video}
          poster={datas?.info?.image}
          onPlay={() => setIsPlaying(true)}
          onEnded={() => {
            setIsPlaying(false);

            // 重置为初始状态，显示 poster
            // 延迟时间避免太突兀
            setTimeout(() => {
              ref.current?.load();
            }, 2 * 1000);
          }}
        />
      </div>
    </section>
  );
};

export default Solution;
