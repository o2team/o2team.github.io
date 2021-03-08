import React, { Fragment, useEffect, useState } from 'react';
import { Home as TypeHome } from '@/types';
import { fetchHome, fetchHomeBanner } from '@/services';
import { statPage } from '@/services/stat';
import './index.scss';
import Banner from './components/Banner';
import Achievement from './components/Achievement';
import Products from './components/Products';
import Technology from './components/Technology';
import Solution from './components/Solution';
import User from './components/User';

interface Props {}

const Home: React.FC<Props> = () => {
  const [dataHome, setDataHome] = useState<TypeHome>();

  useEffect(() => {
    fetchHomeBanner().then((d) => setDataHome((datas) => ({ ...datas, ...d })));
    fetchHome().then((d) => setDataHome((datas) => ({ ...datas, ...d })));
  }, []);

  useEffect(() => {
    statPage('HomePage', '首页');
  }, []);

  return (
    <Fragment>
      <Banner datas={dataHome?.banner} />
      <Achievement datas={dataHome?.achievement} />
      <Products datas={dataHome?.product} />
      <Technology datas={dataHome?.technology} />
      <Solution datas={dataHome?.solution} />
      <User datas={dataHome?.user} />
    </Fragment>
  );
};

export default Home;
