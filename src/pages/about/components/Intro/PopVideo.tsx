import React, { useCallback, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import 'antd/es/modal/style/css';

import styles from './PopVideo.module.scss';

interface Props {
  visible: boolean;
  onCancel?: () => void;
  urlVideo?: string;
}

const Index: React.FC<Props> = (props: Props) => {
  const { visible, onCancel: onCancelProp, urlVideo } = props;
  const ref = useRef<HTMLVideoElement>(null);

  const onCancel = useCallback(() => {
    onCancelProp?.();
  }, [onCancelProp]);

  useEffect(() => {
    if (ref?.current) {
      if (visible) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [ref, visible]);

  return (
    <>
      {/* fix body.ant-scrolling-effect */}
      {/* <div className={styles.container} /> */}

      <Modal
        className={styles.modal}
        // getContainer={`.${styles.container}`}
        width={1200}
        title={null}
        footer={null}
        closable={false}
        centered={true}
        visible={visible}
        onCancel={onCancel}
      >
        <video controls ref={ref} src={urlVideo}></video>
      </Modal>
    </>
  );
};

export default Index;
