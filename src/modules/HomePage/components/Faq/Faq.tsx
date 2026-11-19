import { ReactNode, useId, useState } from 'react';
import classNames from 'classnames';
import styles from './Faq.module.scss';

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is Orchard a real store?',
    answer:
      'No. Orchard is a portfolio project built with React and TypeScript. ' +
      'You can browse, add to cart and use promo codes, but no real orders ' +
      'or payments are made.',
  },
  {
    question: 'Where do the specs and photos come from?',
    answer:
      'Specs are checked against official Apple data. ' +
      'Product names and images belong to Apple Inc.',
  },
  {
    question: 'Are my cart and favorites saved?',
    answer:
      'Yes, they are stored in your browser, so they stay after you reload ' +
      'the page. Nothing is sent to a server.',
  },
  {
    question: 'Do you have promo codes?',
    answer: (
      <>
        Try <code className={styles.code}>ORCHARD10</code> in the cart for 10%
        off.
      </>
    ),
  },
  {
    question: 'Why are some options crossed out?',
    answer:
      'Crossed-out colors and storage options are out of stock, ' +
      'so they can’t be selected.',
  },
  {
    question: 'Is there a dark theme?',
    answer:
      'Yes. Use the moon icon in the header to switch between light and dark.',
  },
];

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const toggleItem = (index: number) => {
    setOpenIndex(current => (current === index ? null : index));
  };

  return (
    <section className={styles.faq} aria-labelledby={`${baseId}-title`}>
      <div className={styles.intro}>
        <h2 id={`${baseId}-title`} className={styles.title}>
          Questions &amp; answers
        </h2>

        <p className={styles.lead}>
          Everything you might want to know about Orchard and how it works.
        </p>
      </div>

      <ul className={styles.list}>
        {FAQ_ITEMS.map(({ question, answer }, index) => {
          const isOpen = index === openIndex;
          const buttonId = `${baseId}-question-${index}`;
          const answerId = `${baseId}-answer-${index}`;

          return (
            <li
              key={question}
              className={classNames(styles.item, { [styles.itemOpen]: isOpen })}
            >
              <h3 className={styles.heading}>
                <button
                  type="button"
                  id={buttonId}
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleItem(index)}
                >
                  {question}
                  <span className={styles.icon} aria-hidden="true" />
                </button>
              </h3>

              <div
                id={answerId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={styles.answer}
              >
                <div className={styles.answerInner}>
                  <p className={styles.answerText}>{answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
