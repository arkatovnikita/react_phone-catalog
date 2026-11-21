import { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './Skeleton.module.scss';

type Props = {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  radius?: CSSProperties['borderRadius'];
  className?: string;
};

export const Skeleton = ({ width, height, radius, className }: Props) => (
  <span
    className={classNames(styles.skeleton, className)}
    style={{ width, height, borderRadius: radius }}
    aria-hidden="true"
  />
);

type StatusProps = {
  label: string;
};

export const LoadingStatus = ({ label }: StatusProps) => (
  <span className="visually-hidden" role="status">
    {label}
  </span>
);
