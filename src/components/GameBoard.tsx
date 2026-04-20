'use client';

import { memo, useState, useEffect, useCallback, useRef } from 'react';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  level: number;
  digits: number;
  timeLimit: number;
  onComplete: (attempts: number, time: number) => void;
  onGiveUp: (password: string) => void;
}

interface AttemptDetail {
  guess: string;
  result: ('correct' | 'wrong' | 'none')[];
  hints: AttemptHint[];
}

interface AttemptHint {
  type: 'correct' | 'wrong' | 'none' | 'range' | 'parity';
  text: string;
  digit?: string;
  position?: number;
}

function GameBoard({ level, digits, timeLimit, onComplete, onGiveUp }: GameBoardProps) {
  const [password, setPassword] = useState('');
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [locale, setLocale] = useState<'en' | 'zh'>('en');
  const [attemptHistory, setAttemptHistory] = useState<AttemptDetail[]>([]);
  const [liveFeedback, setLiveFeedback] = useState<('correct' | 'wrong' | 'none')[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale === 'en' || savedLocale === 'zh') {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    const newPassword = generatePassword();
    console.log('Generated password:', newPassword); // For debugging
    setPassword(newPassword);
    setIsStarted(true);
    hasCompletedRef.current = false;
  }, [level]);

  useEffect(() => {
    if (isStarted && !isSuccess && !isFailed && timeLimit > 0) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= timeLimit) {
            handleTimeUp();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isSuccess, isFailed, timeLimit]);

  const generatePassword = (): string => {
    // 使用 Fisher-Yates 洗牌算法生成不重复数字的密码
    const allDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = allDigits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDigits[i], allDigits[j]] = [allDigits[j], allDigits[i]];
    }
    return allDigits.slice(0, digits).join('');
  };

  const handleTimeUp = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsFailed(true);
    setIsSuccess(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onGiveUp(password);
  }, [password, onGiveUp]);

  const handleNumberPress = useCallback((num: string) => {
    if (input.length < digits && !isValidating && !isSuccess && !isFailed) {
      const newInput = input + num;
      setInput(newInput);
      // Generate live feedback preview
      if (newInput.length === digits) {
        const result = validateGuess(password, newInput, level);
        setLiveFeedback(result.positions);
      } else {
        setLiveFeedback([]);
      }
    }
  }, [input.length, digits, isValidating, isSuccess, isFailed, password, level]);

  const handleDelete = useCallback(() => {
    if (!isValidating && !isSuccess && !isFailed) {
      setInput(prev => prev.slice(0, -1));
      setLiveFeedback([]);
    }
  }, [isValidating, isSuccess, isFailed]);

  const handleClear = useCallback(() => {
    if (!isValidating && !isSuccess && !isFailed) {
      setInput('');
      setLiveFeedback([]);
    }
  }, [isValidating, isSuccess, isFailed]);

  const handleVerify = useCallback(() => {
    if (input.length !== digits || isValidating || isSuccess || isFailed) return;

    setIsValidating(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const result = validateGuess(password, input, level);
    const hints = generateDetailedHints(password, input, result.positions, level);
    
    const attemptDetail: AttemptDetail = {
      guess: input,
      result: result.positions,
      hints: hints
    };
    
    setAttemptHistory(prev => [...prev, attemptDetail]);
    setLiveFeedback(result.positions);

    setTimeout(() => {
      setIsValidating(false);

      if (input === password) {
        setIsSuccess(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete(newAttempts, elapsedTime);
        }
      } else if (timeLimit > 0 && elapsedTime >= timeLimit) {
        handleTimeUp();
      }
    }, 1000);
  }, [input, digits, isValidating, isSuccess, isFailed, attempts, password, level, elapsedTime, timeLimit, onComplete, handleTimeUp]);

  const handleGiveUpClick = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onGiveUp(password);
    }
  }, [password, onGiveUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = timeLimit > 0 ? timeLimit - elapsedTime : null;

  const getCellClass = (index: number, hasResult: boolean = false) => {
    const classes = [styles.cell];
    if (input.length > index) classes.push(styles.filled);
    
    if (hasResult && liveFeedback[index]) {
      if (liveFeedback[index] === 'correct') classes.push(styles.correct);
      else if (liveFeedback[index] === 'wrong') classes.push(styles.wrong);
      else if (liveFeedback[index] === 'none') classes.push(styles.none);
    }
    
    if (isValidating) classes.push(styles.validating);
    if (isSuccess) classes.push(styles.success);
    if (isFailed) classes.push(styles.failed);
    return classes.join(' ');
  };

  return (
    <div className={styles.container}>
      <div className={styles.levelInfo}>
        <span className={styles.levelBadge}>
          {locale === 'en' ? `Level ${level}` : `第 ${level} 关`}
        </span>
        <span className={styles.digitInfo}>
          {locale === 'en' ? `${digits} digits` : `${digits} 位数字`}
        </span>
        {timeLimit > 0 && (
          <span className={`${styles.timer} ${remainingTime !== null && remainingTime <= 10 ? styles.warning : ''}`}>
            ⏱ {formatTime(remainingTime !== null ? remainingTime : elapsedTime)}
          </span>
        )}
      </div>

      <div className={styles.passwordGrid}>
        {Array.from({ length: digits }).map((_, i) => (
          <div key={i} className={getCellClass(i, true)} style={{ animationDelay: `${i * 50}ms` }}>
            <div className={styles.cellInner}>
              {input[i] ? (
                <span className={styles.digit}>{input[i]}</span>
              ) : (
                <span className={styles.placeholder}>?</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.legendCorrect}`}></span>
          <span>{locale === 'en' ? 'Correct' : '位置正确'}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.legendWrong}`}></span>
          <span>{locale === 'en' ? 'Exists' : '存在'}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.legendNone}`}></span>
          <span>{locale === 'en' ? 'Not exists' : '不存在'}</span>
        </div>
      </div>

      {attemptHistory.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>
            📋 {locale === 'en' ? 'History & Hints' : '历史记录与提示'}
          </div>
          <div className={styles.historyList}>
            {attemptHistory.map((attempt, attemptIndex) => (
              <div key={attemptIndex} className={styles.attemptCard}>
                <div className={styles.attemptHeader}>
                  <span className={styles.attemptNumber}>#{attemptIndex + 1}</span>
                  <div className={styles.attemptDigits}>
                    {attempt.guess.split('').map((digit, i) => (
                      <span 
                        key={i} 
                        className={`${styles.attemptDigit} ${getDigitClass(attempt.result[i])}`}
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.attemptHints}>
                  {attempt.hints.map((hint, hintIndex) => (
                    <div key={hintIndex} className={`${styles.hintTag} ${getHintTagClass(hint.type)}`}>
                      {hint.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.numberPad}>
        <div className={styles.padGrid}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num, i) => (
            <button
              key={num}
              className={styles.padButton}
              onClick={() => handleNumberPress(num)}
              disabled={input.length >= digits || isValidating || isSuccess || isFailed}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {num}
            </button>
          ))}
          <button
            className={styles.padButton}
            onClick={() => handleNumberPress('0')}
            disabled={input.length >= digits || isValidating || isSuccess || isFailed}
          >
            0
          </button>
          <button
            className={`${styles.padButton} ${styles.deleteBtn}`}
            onClick={handleDelete}
            disabled={input.length === 0 || isValidating || isSuccess || isFailed}
          >
            ⌫
          </button>
          <button
            className={`${styles.padButton} ${styles.clearBtn}`}
            onClick={handleClear}
            disabled={input.length === 0 || isValidating || isSuccess || isFailed}
          >
            {locale === 'en' ? 'Clear' : '清空'}
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.verifyBtn}`}
          onClick={handleVerify}
          disabled={input.length !== digits || isValidating || isSuccess || isFailed}
        >
          {isValidating ? '...' : (locale === 'en' ? 'Verify' : '验证')}
        </button>
        <button
          className={`${styles.actionBtn} ${styles.giveUpBtn}`}
          onClick={handleGiveUpClick}
          disabled={isSuccess || isFailed}
        >
          {locale === 'en' ? 'Give Up' : '放弃'}
        </button>
      </div>
    </div>
  );
}

function validateGuess(password: string, guess: string, level: number): { positions: ('correct' | 'wrong' | 'none')[] } {
  const positions: ('correct' | 'wrong' | 'none')[] = [];
  const passwordArr = password.split('');
  const guessArr = guess.split('');
  const usedPasswordIndices = new Set<number>();

  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === passwordArr[i]) {
      positions[i] = 'correct';
      usedPasswordIndices.add(i);
    }
  }

  for (let i = 0; i < guessArr.length; i++) {
    if (positions[i]) continue;

    let found = false;
    for (let j = 0; j < passwordArr.length; j++) {
      if (usedPasswordIndices.has(j)) continue;
      if (guessArr[i] === passwordArr[j]) {
        positions[i] = 'wrong';
        usedPasswordIndices.add(j);
        found = true;
        break;
      }
    }
    if (!found) {
      positions[i] = 'none';
    }
  }

  return { positions };
}

function generateDetailedHints(password: string, guess: string, results: ('correct' | 'wrong' | 'none')[], level: number): AttemptHint[] {
  const hints: AttemptHint[] = [];
  const passwordArr = password.split('');
  const guessArr = guess.split('');
  const locale = localStorage.getItem('locale') || 'en';

  // Position-based hints
  for (let i = 0; i < results.length; i++) {
    if (results[i] === 'correct') {
      hints.push({
        type: 'correct',
        text: locale === 'en' ? `Position ${i + 1}: ✓ Correct` : `第 ${i + 1} 位: ✓ 正确`,
        digit: guessArr[i],
        position: i + 1
      });
    } else if (results[i] === 'wrong') {
      hints.push({
        type: 'wrong',
        text: locale === 'en' ? `Position ${i + 1}: ↻ Exists but wrong position` : `第 ${i + 1} 位: ↻ 存在但位置错误`,
        digit: guessArr[i],
        position: i + 1
      });
    } else {
      hints.push({
        type: 'none',
        text: locale === 'en' ? `Position ${i + 1}: ✗ ${guessArr[i]} does not exist` : `第 ${i + 1} 位: ✗ ${guessArr[i]} 不存在`,
        digit: guessArr[i],
        position: i + 1
      });
    }
  }

  // Range hints (Level 2+)
  if (level >= 2) {
    for (let i = 0; i < passwordArr.length; i++) {
      if (results[i] !== 'none') {
        const digit = parseInt(passwordArr[i]);
        const ranges = [
          [0, 2],
          [3, 5],
          [6, 8],
          [0, 4],
          [5, 9]
        ];
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        // Make sure range contains the digit
        if (digit >= range[0] && digit <= range[1]) {
          hints.push({
            type: 'range',
            text: locale === 'en' 
              ? `Position ${i + 1}: Range ${range[0]}-${range[1]}` 
              : `第 ${i + 1} 位: 范围 ${range[0]}-${range[1]}`,
            position: i + 1
          });
        }
      }
    }
  }

  // Parity hints (Level 3+)
  if (level >= 3) {
    for (let i = 0; i < passwordArr.length; i++) {
      if (results[i] !== 'none') {
        const digit = parseInt(passwordArr[i]);
        if (digit % 2 === 0) {
          hints.push({
            type: 'parity',
            text: locale === 'en' ? `Position ${i + 1}: Even number` : `第 ${i + 1} 位: 偶数`,
            position: i + 1
          });
        } else {
          hints.push({
            type: 'parity',
            text: locale === 'en' ? `Position ${i + 1}: Odd number` : `第 ${i + 1} 位: 奇数`,
            position: i + 1
          });
        }
      }
    }
  }

  return hints;
}

function getDigitClass(result: 'correct' | 'wrong' | 'none'): string {
  if (result === 'correct') return styles.digitCorrect;
  if (result === 'wrong') return styles.digitWrong;
  return styles.digitNone;
}

function getHintTagClass(type: string): string {
  if (type === 'correct') return styles.hintCorrect;
  if (type === 'wrong') return styles.hintWrong;
  if (type === 'none') return styles.hintNone;
  if (type === 'range') return styles.hintRange;
  if (type === 'parity') return styles.hintParity;
  return '';
}

export default memo(GameBoard);
