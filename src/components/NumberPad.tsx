'use client';

import { memo, useCallback } from 'react';
import styles from './NumberPad.module.css';

interface NumberPadProps {
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
  disabled?: boolean;
}

function NumberPad({ onNumberPress, onDelete, onClear, disabled }: NumberPadProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const handleNumberClick = useCallback((num: string) => {
    if (!disabled) {
      onNumberPress(num);
    }
  }, [disabled, onNumberPress]);

  const handleDelete = useCallback(() => {
    if (!disabled) {
      onDelete();
    }
  }, [disabled, onDelete]);

  const handleClear = useCallback(() => {
    if (!disabled) {
      onClear();
    }
  }, [disabled, onClear]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {numbers.map((num, index) => (
          <button
            key={num}
            className={styles.button}
            onClick={() => handleNumberClick(num)}
            disabled={disabled}
            style={{ animationDelay: `${index * 30}ms` }}
            aria-label={`Number ${num}`}
          >
            <span className={styles.number}>{num}</span>
            <div className={styles.glow} />
          </button>
        ))}
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.actionButton} ${styles.deleteButton}`}
          onClick={handleDelete}
          disabled={disabled}
          aria-label="Delete"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
        <button
          className={`${styles.button} ${styles.actionButton} ${styles.clearButton}`}
          onClick={handleClear}
          disabled={disabled}
          aria-label="Clear"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(NumberPad);
