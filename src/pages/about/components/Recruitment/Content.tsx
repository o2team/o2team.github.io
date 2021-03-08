import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import breaks from 'remark-breaks';
import { Modal } from 'antd';
import 'antd/es/modal/style/css';

import { ContentItemAboutRecruitment as ContentItem } from '@/types';
import styles from './Content.module.scss';

interface Props {
  datas?: ContentItem;
}

const plugins = [gfm, breaks];

const Recruitment: React.FC<Props> = (props) => {
  const { datas } = props;
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <div className={styles.content}>
        <div className={styles.overview} onClick={() => setVisible(true)}>
          <p className={styles.name}>{datas?.name}</p>
          <p className={styles.address}>{datas?.address}</p>
          <div className={styles.desc}>
            <ReactMarkdown plugins={plugins}>{datas?.desc ?? ''}</ReactMarkdown>
          </div>
          <div className={styles.more}>
            <span className={styles.date}>{datas?.date}</span>
            <button>查看详情</button>
          </div>
        </div>
      </div>

      {/* fix body.ant-scrolling-effect */}
      {/* <div className={styles.container} /> */}

      <Modal
        className={styles.modal}
        // getContainer={`.${styles.container}`}
        width={900}
        title={datas?.name}
        footer={null}
        // closable={false}
        centered={true}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <div className={styles.markdown}>
          <ReactMarkdown className={'typo'} plugins={plugins}>
            {datas?.detail ?? ''}
          </ReactMarkdown>
        </div>

        <div className={styles.mailto}>
          <a href={datas?.link}>申请职位</a>
        </div>
      </Modal>
    </>
  );
};

export default Recruitment;
