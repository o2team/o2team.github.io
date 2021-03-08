import React, { Fragment, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { throttle } from 'lodash-es';
import { About as TypeAbout } from '@/types';
import { fetchAbout } from '@/services';
import { statPage } from '@/services/stat';
import styles from './index.module.scss';

import Intro from './components/Intro';
import Channel from './components/Channel';
import Recruitment from './components/Recruitment';

interface Props {}

const scrollRange = [850, 1000];

const About: React.FC<Props> = () => {
  const [dataAbout, setDataAbout] = useState<TypeAbout>();
  const [scrollHeight, setScrollHeight] = useState<number>(scrollRange[0]);
  const [shouldListenScroll, setShouldListenScroll] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAbout().then((d) => setDataAbout((datas) => ({ ...datas, ...d })));
  }, []);

  useEffect(() => {
    statPage('AboutUs', '关于');
  }, []);

  // 监听是否为移动端
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const measurement = ref.current?.getBoundingClientRect();
      if (measurement && measurement.width <= 480) {
        setShouldListenScroll(false);
      } else {
        setShouldListenScroll(true);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => resizeObserver.disconnect();
  }, [ref]);

  // 处理视差滚动
  const handleScroll = useCallback(() => {
    throttle(() => {
      let y = document.body.scrollTop + document.documentElement.scrollTop;
      y = Math.min(y, scrollRange[1]);
      setScrollHeight(scrollRange[0] + y / 2);
    }, 1)();
  }, []);

  useEffect(() => {
    if (shouldListenScroll) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [shouldListenScroll, handleScroll]);

  const styleTrans = useMemo(() => {
    return {
      transform: `translate(0, ${scrollHeight}px)`,
    };
  }, [scrollHeight]);

  return (
    <Fragment>
      <Intro datas={dataAbout?.intro} />
      <Channel datas={dataAbout?.channel} />
      <Recruitment datas={dataAbout?.recruitment} />
      <div className={styles.blue} style={styleTrans}>
        <div className={styles['blue-one']} />
        <div className={styles['blue-two']} />
        <div className={styles['blue-three']} />
      </div>
      <div className={styles.measurement} ref={ref} />
    </Fragment>
  );
};

export default About;
