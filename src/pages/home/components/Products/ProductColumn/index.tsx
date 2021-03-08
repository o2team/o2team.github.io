import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { ContentItem } from '@/types';
import ProductItem from '../ProductItem';
import styles from './index.module.scss';

interface Props {
  content: ContentItem[];
  columnIndex: number;
  hoverIndex: number;
  onColumnHover: (key: number) => void;
}

const ProductColumn: React.FC<Props> = (props: Props) => {
  const { content, columnIndex, hoverIndex, onColumnHover } = props;

  const [wrapperClass, setWrapperClass] = useState<string>(styles.wrapper);

  useEffect(() => {
    if (columnIndex == 0) {
      setWrapperClass((prevClass) => prevClass + ` ${styles['wrapper-first']}`);
    }
  }, [columnIndex]);

  const handleHoverItem = (key: number) => {
    onColumnHover(key);
  };

  const handleMouseOut = () => {
    onColumnHover(-1);
  };

  return (
    <div className={classnames(wrapperClass)} onMouseLeave={handleMouseOut}>
      {content.map((item, index) => (
        <ProductItem
          key={index}
          content={item}
          columnIndex={columnIndex}
          index={index}
          hoverIndex={hoverIndex}
          onItemHover={handleHoverItem}
        />
      ))}
    </div>
  );
};

export default ProductColumn;
