import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { statProduct } from '@/services/stat';
import { ContentItem } from '@/types';
import { ReactComponent as Oops } from '@/static/icon/oops.svg';
import { ReactComponent as GotoIcon } from '@/static/icon/swap-right.svg';
import styles from './index.module.scss';

interface Props {
  content: ContentItem;
  columnIndex: number;
  index: number;
  hoverIndex: number;
  onItemHover: (key: number) => void;
}

// 各状态样式定义
const topItemClass = styles.wrapper + ` ${styles['wrapper-top']}`;
const topItemFixHeightClass =
  styles.wrapper + ` ${styles['wrapper-top']} ${styles['wrapper-default-hover-height']}`;
const bottomItemClass = styles.wrapper;
const gotoItemClass = styles.goto;
const gotoItemVisibleClass = gotoItemClass + ` ${styles['goto-visible']}`;

const ProductItem: React.FC<Props> = (props: Props) => {
  const { content, columnIndex, index, hoverIndex, onItemHover } = props;

  const backgroundStyle = {
    backgroundImage: content.image ? `url(${content.image})` : null,
  };

  const [topClass, setTopClass] = useState(topItemClass);
  const [flexClass, setFlexClass] = useState({});
  const [gotoClass, setGotoClass] = useState(gotoItemClass);
  const [showBGImg, setShowBGImg] = useState({});
  const [showState, setShowState] = useState(0);

  /**
   * @description: 判断该 item 的展示状态
   * @return {number} -1: 缩短 0: 默认状态 1: 展开
   */
  const checkState = useMemo((): number => {
    if (columnIndex == 0) {
      // 第一列
      if (index == 0) {
        // 第一个
        // 默认状态下，第一块的高度和跳转框需单独处理
        if (hoverIndex != -1) setTopClass(topItemClass);
        else setTopClass(topItemFixHeightClass);

        if (hoverIndex == -1 || hoverIndex == 0) return 1;
        if (hoverIndex == 1) return -1;
        return 0;
      } else {
        // 第二个
        if (hoverIndex == -1 || hoverIndex == 0) return -1;
        else if (hoverIndex == 1) return 1;
        else return 0;
      }
    } else {
      // 第二列
      if (index == 0) {
        // 第一个
        if (hoverIndex == 2) return 1;
        if (hoverIndex == 3) return -1;
        return 0;
      } else {
        // 第二个
        if (hoverIndex == 2) return -1;
        if (hoverIndex == 3) return 1;
        return 0;
      }
    }
  }, [columnIndex, index, hoverIndex]);

  useEffect(() => {
    setShowState(checkState);
  }, [checkState, columnIndex, index, hoverIndex]);

  useEffect(() => {
    if (showState == 0) {
      setFlexClass({});
      setGotoClass(gotoItemClass);
      setShowBGImg({});
    }
    if (showState == -1) {
      setFlexClass(styles['wrapper-flex']);
      setGotoClass(gotoItemClass);
      setShowBGImg({});
    }
    if (showState == 1) {
      setFlexClass({});
      setGotoClass(gotoItemVisibleClass);
      setShowBGImg(backgroundStyle);
    }
  }, [showState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = () => {
    let hoverItem = -1;
    if (columnIndex == 0) {
      if (index == 0) hoverItem = 0;
      else hoverItem = 1;
    } else if (columnIndex == 1) {
      if (index == 0) hoverItem = 2;
      else hoverItem = 3;
    }
    onItemHover(hoverItem);
  };

  return (
    <div
      className={classnames(index == 0 ? topClass : bottomItemClass)}
      onMouseEnter={handleMouseEnter}
    >
      <div className={classnames([flexClass, styles.content])}>
        <div className={styles['content-img']}>
          {content.icon ? (
            <img className={styles['img-inner']} src={content.icon} alt={content.name} />
          ) : (
            <Oops />
          )}
        </div>
        <div className={styles['content-words']}>
          <div className={styles['content-name']}>{content.name}</div>
          <div className={styles['content-desc']}>{content.desc}</div>
        </div>
      </div>
      <a
        key={content.id}
        className={styles.link}
        href={content.link || 'https://aotu.io'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => statProduct(content.name)}
      >
        <div className={classnames(gotoClass)}>
          <div className={styles['goto-word']}>浏览网站</div>
          <GotoIcon />
        </div>
      </a>
      <div className={styles.bg} style={showBGImg}></div>
    </div>
  );
};

export default ProductItem;
