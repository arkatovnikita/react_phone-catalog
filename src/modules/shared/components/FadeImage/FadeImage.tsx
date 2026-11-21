import { ImgHTMLAttributes, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './FadeImage.module.scss';
import { Skeleton } from '../Skeleton';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

export const FadeImage = ({ src, className, onLoad, ...props }: Props) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = imageRef.current;

    setIsLoaded(Boolean(image?.complete && image.naturalWidth));
  }, [src]);

  return (
    <>
      {!isLoaded && <Skeleton className={styles.placeholder} />}

      <img
        {...props}
        ref={imageRef}
        src={src}
        className={classNames(className, styles.image, {
          [styles.imageLoaded]: isLoaded,
        })}
        onLoad={event => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
};
