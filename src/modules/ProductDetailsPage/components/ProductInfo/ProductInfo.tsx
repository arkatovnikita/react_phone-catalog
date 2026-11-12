import styles from './ProductInfo.module.scss';
import { ProductDetails } from '../../../shared/types/ProductDetails';

type Props = {
  details: ProductDetails;
};

export const ProductInfo = ({ details }: Props) => {
  const techSpecs = [
    { label: 'Screen', value: details.screen },
    { label: 'Resolution', value: details.resolution },
    { label: 'Processor', value: details.processor },
    { label: 'RAM', value: details.ram },
    { label: 'Built in memory', value: details.capacity },
    { label: 'Camera', value: details.camera },
    { label: 'Zoom', value: details.zoom },
    { label: 'Cell', value: details.cell.join(', ') },
  ].filter(spec => spec.value);

  return (
    <div className={styles.info}>
      <section>
        <h2 className={styles.title}>About</h2>

        {details.description.map(({ title, text }) => (
          <article key={title} className={styles.block}>
            <h3 className={styles.blockTitle}>{title}</h3>

            {text.map(paragraph => (
              <p key={paragraph} className={styles.text}>
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </section>

      <section>
        <h2 className={styles.title}>Tech specs</h2>

        <dl className={styles.specs}>
          {techSpecs.map(({ label, value }) => (
            <div key={label} className={styles.spec}>
              <dt className={styles.specLabel}>{label}</dt>
              <dd className={styles.specValue}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};
