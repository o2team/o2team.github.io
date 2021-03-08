import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

export enum Theme {
  light,
  blue,
}

interface Props {
  className?: string;
  name?: string;
  nameEn?: string;
  theme?: Theme;
}

const Solution: React.FC<Props> = (props) => {
  const { className, name, nameEn, theme = Theme.blue } = props;

  return (
    <div
      className={classnames(
        styles.title,
        theme === Theme.light ? styles.light : styles.blue,
        className,
      )}
    >
      <p className={styles['name-en']}>{nameEn}</p>
      <h2 className={styles['name']}>{name}</h2>
    </div>
  );
};

export default Solution;
