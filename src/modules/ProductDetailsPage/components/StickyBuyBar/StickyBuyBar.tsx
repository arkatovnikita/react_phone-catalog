import classNames from 'classnames';
import styles from './StickyBuyBar.module.scss';

type Props = {
  isVisible: boolean;
  image: string;
  title: string;
  price: number;
  fullPrice: number;
  buttonText: string;
  isAdded: boolean;
  isDisabled: boolean;
  onAdd: () => void;
};

export const StickyBuyBar = ({
  isVisible,
  image,
  title,
  price,
  fullPrice,
  buttonText,
  isAdded,
  isDisabled,
  onAdd,
}: Props) => (
  <div
    className={classNames(styles.bar, { [styles.visible]: isVisible })}
    data-sticky-bar={isVisible ? 'visible' : 'hidden'}
    aria-hidden={!isVisible}
  >
    <img
      src={`${import.meta.env.BASE_URL}${image}`}
      alt=""
      className={styles.image}
    />

    <div className={styles.info}>
      <p className={styles.title}>{title}</p>

      <p className={styles.prices}>
        <span className={styles.price}>${price}</span>

        {fullPrice > price && (
          <span className={styles.fullPrice}>${fullPrice}</span>
        )}
      </p>
    </div>

    <button
      type="button"
      className={classNames(styles.button, {
        [styles.buttonAdded]: isAdded,
      })}
      disabled={isDisabled}
      tabIndex={isVisible ? 0 : -1}
      onClick={onAdd}
    >
      {buttonText}
    </button>
  </div>
);
