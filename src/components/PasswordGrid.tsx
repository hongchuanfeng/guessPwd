'use client';

import { memo, useEffect, useState, useCallback } from 'react';
import styles from './PasswordGrid.module.css';

interface PasswordGridProps {
  length: number;
  input: string;
  validationResult?: ('correct' | 'wrong' | 'none')[];
  isValidating?: boolean;
  isSuccess?: boolean;
  isFailed?: boolean;
}

function PasswordGrid({ length, input, validationResult, isValidating, isSuccess, isFailed }: PasswordGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.grid}>
        {Array.from({ length }).map((_, i) => (
          <div key={i} className={styles.cell}>
            <div className={styles.cellInner} />
          </div>
        ))}
      </div>
    );
  }

  const getCellClass = (index: number) => {
    const classes = [styles.cell];
    
    if (input.length > index) {
      classes.push(styles.filled);
    }

    if (validationResult && validationResult[index]) {
      if (validationResult[index] === 'correct') {
        classes.push(styles.correct);
      } else if (validationResult[index] === 'wrong') {
        classes.push(styles.wrong);
      } else {
        classes.push(styles.none);
      }
    }

    if (isValidating) {
      classes.push(styles.validating);
    }

    if (isSuccess) {
      classes.push(styles.success);
    }

    if (isFailed) {
      classes.push(styles.failed);
    }

    return classes.join(' ');
  };

  const getCellContent = (index: number) => {
    if (index < input.length) {
      return input[index];
    }
    return '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={getCellClass(i)}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={styles.cellInner}>
              <span className={styles.digit}>
                {getCellContent(i)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(PasswordGrid);
