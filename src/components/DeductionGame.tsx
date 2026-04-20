'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './DeductionGame.module.css';

interface DeductionGameProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
  digitsCount?: 3 | 4 | 5 | 6 | 7 | 8 | 9; // 3位、4位、5位、6位、7位、8位或9位密码
  onComplete?: (levelId: number, time: number, attempts: number) => void; // 完成回调
}

interface Hint {
  id: number;
  digits: string[];
  correctDigits: string[];
  correctPositions: number[];
  allPositionsCorrect: boolean;
  noPositionsCorrect: boolean;
}

function DeductionGame({ locale = 'en', onBack, digitsCount = 3, onComplete }: DeductionGameProps) {
  const [password, setPassword] = useState<string[]>([]);
  const [hints, setHints] = useState<Hint[]>([]);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = (en: string, zh: string) => locale === 'en' ? en : zh;

  // 数字转英文序数词
  const toOrdinal = (n: number): string => {
    const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    return ordinals[n - 1] || `${n}th`;
  };

  // 验证猜测
  const validateGuess = useCallback((guess: string[], answer: string[]) => {
    let exact = 0;
    let partial = 0;
    const exactPositions = new Set<number>();
    const usedAnswerPositions = new Set<number>();

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        exact++;
        exactPositions.add(i);
        usedAnswerPositions.add(i);
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (exactPositions.has(i)) continue;
      for (let j = 0; j < answer.length; j++) {
        if (usedAnswerPositions.has(j)) continue;
        if (guess[i] === answer[j]) {
          partial++;
          usedAnswerPositions.add(j);
          break;
        }
      }
    }

    return { exact, partial };
  }, []);

  // Get correct digits and their positions
  const getCorrectDigits = useCallback((guess: string[], answer: string[]) => {
    const correctDigits: string[] = [];
    const correctPositions: number[] = [];

    const exactPositions = new Set<number>();
    const usedPositions = new Set<number>();

    // First pass: exact matches (position same)
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        correctDigits.push(guess[i]);
        correctPositions.push(i);
        exactPositions.add(i);
        usedPositions.add(i);
      }
    }

    // Second pass: partial matches (digit exists but position different)
    for (let i = 0; i < guess.length; i++) {
      if (exactPositions.has(i)) continue;

      for (let j = 0; j < answer.length; j++) {
        if (usedPositions.has(j)) continue;
        if (guess[i] === answer[j]) {
          correctDigits.push(guess[i]);
          usedPositions.add(j);
          break;
        }
      }
    }

    return { correctDigits, correctPositions };
  }, []);

  // Generate password and hints
  const generateRound = useCallback(() => {
    // Generate password with Fisher-Yates shuffle
    const allDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = allDigits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDigits[i], allDigits[j]] = [allDigits[j], allDigits[i]];
    }
    const newPassword = allDigits.slice(0, digitsCount);

    // 获取不在密码中的数字用于填充
    const fillDigits = allDigits.filter(d => !newPassword.includes(d));

    // 将密码数字取出（支持最多9位）
    const [d1, d2, d3, d4, d5, d6, d7, d8, d9] = [...newPassword, ...Array(9).fill(null)].slice(0, 9);

    // 辅助函数：循环获取填充数字
    const getFill = (idx: number) => fillDigits[idx % fillDigits.length];

    if (digitsCount === 3) {
      setPassword(newPassword);
      // 生成不在密码中的数字用于填充
      const usedDigits = new Set(newPassword);
      const decoyDigits: string[] = [];
      for (let i = 0; i < 10; i++) {
        const d = String(i);
        if (!usedDigits.has(d)) {
          decoyDigits.push(d);
        }
      }
      // 打乱decoyDigits以确保随机性
      for (let i = decoyDigits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [decoyDigits[i], decoyDigits[j]] = [decoyDigits[j], decoyDigits[i]];
      }
      const [decoy1, decoy2, decoy3, decoy4, decoy5, decoy6] = decoyDigits.slice(0, 6);

      // 提示1: [d1, decoy1, decoy2] → 1个正确(d1)，位置正确（百位）
      // 提示2: [decoy1, decoy3, d2] → 1个正确(d2)，位置不正确（d2在个位，密码中d2在十位）
      //        decoy1与提示1相同，其他数字不同
      // 提示3: [decoy1, d3, d1] → 2个正确(d1+d3)，位置都不正确
      //        d1出现在提示3中（个位，不是百位），与提示1位置不同
      //        d3在十位（密码中d3在个位），位置错
      //        decoy1在提示2和提示3的百位
      setHints([
        { id: 1, digits: [d1, decoy1, decoy2], correctDigits: [d1], correctPositions: [0], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 2, digits: [decoy1, decoy3, d2], correctDigits: [d2], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: false },
        { id: 3, digits: [decoy1, d3, d1], correctDigits: [d1, d3], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: false },
      ]);
    } else if (digitsCount === 4) {
      setPassword(newPassword);
      setHints([
        { id: 1, digits: [getFill(0), getFill(1), getFill(2), getFill(3)], correctDigits: [], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 2, digits: [getFill(4), d1, d2, getFill(5)], correctDigits: [d1, d2], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: false },
        { id: 3, digits: [d2, d3, d1, getFill(6)], correctDigits: [d1, d2, d3], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: false },
        { id: 4, digits: [getFill(7), getFill(8), d3, d4], correctDigits: [d3, d4], correctPositions: [2, 3], allPositionsCorrect: false, noPositionsCorrect: false },
      ]);
    } else if (digitsCount === 5) {
      setPassword(newPassword);
      setHints([
        { id: 1, digits: [getFill(0), getFill(1), getFill(2), getFill(3), getFill(4)], correctDigits: [], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 2, digits: [d1, d2, getFill(5), getFill(6), getFill(7)], correctDigits: [d1, d2], correctPositions: [0, 1], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 3, digits: [getFill(8), getFill(9), d3, getFill(10), getFill(11)], correctDigits: [d3], correctPositions: [2], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 4, digits: [getFill(12), getFill(13), getFill(14), getFill(15), d4], correctDigits: [d4], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: false },
        { id: 5, digits: [getFill(16), getFill(17), getFill(18), d5, d4], correctDigits: [d4, d5], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: false },
      ]);
    } else if (digitsCount === 6) {
      setPassword(newPassword);
      setHints([
        { id: 1, digits: [d1, getFill(0), getFill(1), getFill(2), getFill(3), getFill(4)], correctDigits: [d1], correctPositions: [0], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 2, digits: [getFill(5), d2, getFill(6), getFill(7), getFill(8), d6], correctDigits: [d2, d6], correctPositions: [1, 5], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 3, digits: [getFill(9), getFill(10), d3, getFill(11), getFill(12), getFill(13)], correctDigits: [d3], correctPositions: [2], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 4, digits: [getFill(14), getFill(15), getFill(16), d4, getFill(17), getFill(18)], correctDigits: [d4], correctPositions: [3], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 5, digits: [getFill(19), getFill(20), getFill(21), d4, d5, getFill(22)], correctDigits: [d4, d5], correctPositions: [3, 4], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 6, digits: [d1, d2, d3, getFill(23), getFill(24), getFill(25)], correctDigits: [d1, d2, d3], correctPositions: [0, 1, 2], allPositionsCorrect: true, noPositionsCorrect: false },
      ]);
    } else if (digitsCount === 7) {
      setPassword(newPassword);
      // 7位密码推理逻辑：前半部分(0-3)提示单个数字，后半部分(4-7)验证组合
      // 使用密码数字但确保填充数字不在密码中
      const usedDigits = new Set(newPassword);
      const fillList: string[] = [];
      for (let i = 0; i < 10; i++) {
        const d = String(i);
        if (!usedDigits.has(d)) {
          fillList.push(d);
        }
      }
      const getF = (idx: number) => fillList[idx % fillList.length];

      setHints([
        { id: 1, digits: [d1, getF(0), getF(1), getF(2), getF(3), getF(4), getF(5)], correctDigits: [d1], correctPositions: [0], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 2, digits: [getF(0), getF(1), d2, d3, getF(2), getF(3), getF(4)], correctDigits: [d2, d3], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 3, digits: [getF(5), d4, getF(6), getF(7), getF(8), getF(9), getF(10)], correctDigits: [d4], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 4, digits: [getF(11), getF(12), getF(13), d5, getF(14), getF(15), getF(16)], correctDigits: [d5], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 5, digits: [d6, d7, getF(17), getF(18), getF(19), getF(20), getF(21)], correctDigits: [d6, d7], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 6, digits: [d1, d2, d3, getF(22), getF(23), getF(24), getF(25)], correctDigits: [d1, d2, d3], correctPositions: [0, 1, 2], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 7, digits: [getF(26), getF(27), getF(28), d4, d5, d6, d7], correctDigits: [d4, d5, d6, d7], correctPositions: [3, 4, 5, 6], allPositionsCorrect: true, noPositionsCorrect: false },
      ]);
    } else if (digitsCount === 8) {
      setPassword(newPassword);
      // 8位密码推理逻辑：提示1单个数字位置正确，后面的提示组合验证
      // 使用密码数字但确保填充数字不在密码中
      const usedDigits = new Set(newPassword);
      const fillList: string[] = [];
      for (let i = 0; i < 10; i++) {
        const d = String(i);
        if (!usedDigits.has(d)) {
          fillList.push(d);
        }
      }
      const getF = (idx: number) => fillList[idx % fillList.length];

      setHints([
        { id: 1, digits: [d1, getF(0), getF(1), getF(2), getF(3), getF(4), getF(5), getF(6)], correctDigits: [d1], correctPositions: [0], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 2, digits: [getF(7), getF(8), d2, d3, getF(9), getF(10), getF(11), getF(12)], correctDigits: [d2, d3], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 3, digits: [getF(13), d4, getF(14), getF(15), getF(16), getF(17), getF(18), getF(19)], correctDigits: [d4], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 4, digits: [getF(20), getF(21), getF(22), d5, getF(23), getF(24), getF(25), getF(26)], correctDigits: [d5], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 5, digits: [d6, d7, getF(27), getF(28), getF(29), getF(30), getF(31), getF(32)], correctDigits: [d6, d7], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 6, digits: [d1, d2, d3, getF(33), getF(34), getF(35), getF(36), getF(37)], correctDigits: [d1, d2, d3], correctPositions: [0, 1, 2], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 7, digits: [getF(38), getF(39), d4, d5, d6, d7, getF(40), getF(41)], correctDigits: [d4, d5, d6, d7], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 8, digits: [getF(42), getF(43), getF(44), getF(45), d5, d6, d7, d8], correctDigits: [d5, d6, d7, d8], correctPositions: [4, 5, 6, 7], allPositionsCorrect: true, noPositionsCorrect: false },
      ]);
    } else if (digitsCount === 9) {
      setPassword(newPassword);
      // 9位密码推理逻辑：9个提示
      const usedDigits = new Set(newPassword);
      const fillList: string[] = [];
      for (let i = 0; i < 10; i++) {
        const d = String(i);
        if (!usedDigits.has(d)) {
          fillList.push(d);
        }
      }
      const getF = (idx: number) => fillList[idx % fillList.length];

      setHints([
        { id: 1, digits: [d1, getF(0), getF(1), getF(2), getF(3), getF(4), getF(5), getF(6), getF(7)], correctDigits: [d1], correctPositions: [0], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 2, digits: [getF(8), getF(9), d2, d3, getF(10), getF(11), getF(12), getF(13), getF(14)], correctDigits: [d2, d3], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 3, digits: [getF(15), d4, getF(16), getF(17), getF(18), getF(19), getF(20), getF(21), getF(22)], correctDigits: [d4], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 4, digits: [getF(23), getF(24), getF(25), d5, getF(26), getF(27), getF(28), getF(29), getF(30)], correctDigits: [d5], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 5, digits: [d6, d7, getF(31), getF(32), getF(33), getF(34), getF(35), getF(36), getF(37)], correctDigits: [d6, d7], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 6, digits: [d1, d2, d3, getF(38), getF(39), getF(40), getF(41), getF(42), getF(43)], correctDigits: [d1, d2, d3], correctPositions: [0, 1, 2], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 7, digits: [getF(44), getF(45), d4, d5, d6, getF(46), getF(47), getF(48), getF(49)], correctDigits: [d4, d5, d6], correctPositions: [], allPositionsCorrect: false, noPositionsCorrect: true },
        { id: 8, digits: [getF(49), getF(50), getF(51), getF(52), d5, d6, d7, d8, getF(53)], correctDigits: [d5, d6, d7, d8], correctPositions: [4, 5, 6, 7], allPositionsCorrect: true, noPositionsCorrect: false },
        { id: 9, digits: [getF(54), getF(55), getF(56), getF(57), getF(58), d6, d7, d8, d9], correctDigits: [d6, d7, d8, d9], correctPositions: [5, 6, 7, 8], allPositionsCorrect: true, noPositionsCorrect: false },
      ]);
    }
  }, [digitsCount]);

  // Initialize
  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleSubmit = useCallback(() => {
    if (input.length !== digitsCount || isSuccess || isFailed) return;

    const guess = input.split('');
    const result = validateGuess(guess, password);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (result.exact === digitsCount) {
      setIsSuccess(true);
      setTotalScore(prev => prev + 1);
      setSubmitMessage({ type: 'success', text: locale === 'en' ? '🎉 Correct! Well done!' : '🎉 正确！太棒了！' });
      // 调用完成回调，解锁下一关
      if (onComplete) {
        const levelId = digitsCount === 3 ? 99 : (digitsCount === 4 ? 100 : (digitsCount === 5 ? 101 : (digitsCount === 6 ? 102 : (digitsCount === 7 ? 103 : (digitsCount === 8 ? 104 : 105)))));
        onComplete(levelId, 0, newAttempts); // time=0(无限制), attempts=推理次数
      }
    } else {
      const remaining = 3 - newAttempts;
      if (remaining > 0) {
        setSubmitMessage({
          type: 'error',
          text: locale === 'en'
            ? `❌ Wrong! ${remaining} attempt${remaining > 1 ? 's' : ''} left.`
            : `❌ 错误！还剩${remaining}次尝试。`
        });
      } else {
        setIsFailed(true);
        setShowPassword(true);
        setSubmitMessage({
          type: 'error',
          text: locale === 'en' ? '❌ Wrong! Game over!' : '❌ 错误！游戏结束！'
        });
      }
    }

    setInput('');

    // 3秒后清除消息
    setTimeout(() => setSubmitMessage(null), 3000);
  }, [input, isSuccess, isFailed, attempts, password, validateGuess, digitsCount, locale]);

  const handleNumberPress = useCallback((num: string) => {
    if (input.length < digitsCount && !isSuccess && !isFailed) {
      setInput(prev => prev + num);
    }
  }, [input.length, isSuccess, isFailed, digitsCount]);

  const handleDelete = useCallback(() => {
    if (!isSuccess && !isFailed) {
      setInput(prev => prev.slice(0, -1));
    }
  }, [isSuccess, isFailed]);

  const handleClear = useCallback(() => {
    if (!isSuccess && !isFailed) {
      setInput('');
    }
  }, [isSuccess, isFailed]);

  const handleNextRound = useCallback(() => {
    setInput('');
    setAttempts(0);
    setIsSuccess(false);
    setIsFailed(false);
    setShowPassword(false);
    generateRound();
  }, [generateRound]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess || isFailed) {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNextRound();
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleNumberPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSuccess, isFailed, handleNumberPress, handleDelete, handleClear, handleSubmit, handleNextRound]);

  // Show loading only if hints are still empty after initial render
  if (hints.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>{t('Loading...', '加载中...')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('Back', '返回')}
          </button>
        )}
        <h1 className={styles.title}>🔐 {t('Crack the Code', '破解密码')}</h1>
      </div>

      {/* Hints Section */}
      <div className={styles.hintsSection}>
        <div className={styles.hintsTitle}>
          📋 {t('Hints', '提示信息')}
        </div>
        <div className={styles.hintsGrid}>
          {hints.map((hint) => {
            return (
              <div key={hint.id} className={styles.hintCard}>
                <div className={styles.hintNumber}>{locale === 'en' ? `Hint ${toOrdinal(hint.id)}` : `提示${hint.id}`}</div>
                <div className={styles.hintDigits}>
                  {hint.digits.map((digit, i) => {
                    let isCorrect = false;
                    if (hint.correctDigits.includes(digit)) {
                      if (digitsCount === 3) {
                        // 3位: 提示1(d1=0对), 提示2(d1=1错), 提示3(d2=1对,d3=0对)
                        if (hint.id === 1) {
                          isCorrect = i === 0;
                        } else if (hint.id === 2) {
                          isCorrect = false; // d1位置错
                        } else if (hint.id === 3) {
                          isCorrect = i === 0 || i === 1; // d3位置0对, d2位置1对
                        }
                      } else if (digitsCount === 4) {
                        // 4位: 提示1(全错), 提示2(d1,d2错位), 提示3(d1,d2,d3错位), 提示4(d3,d4正确)
                        if (hint.id === 1) {
                          isCorrect = false;
                        } else if (hint.id === 2) {
                          isCorrect = false; // d1,d2位置都错
                        } else if (hint.id === 3) {
                          isCorrect = false; // d1,d2,d3位置都错
                        } else if (hint.id === 4) {
                          isCorrect = i === 2 || i === 3; // d3位置2, d4位置3
                        }
                      } else if (digitsCount === 5) {
                        // 5位: 提示2(d1=0,d2=1对), 提示3(d3=2对), 提示4(d4=4错), 提示5(d5=3,d4=4错)
                        if (hint.id === 2) {
                          isCorrect = i === 0 || i === 1;
                        } else if (hint.id === 3) {
                          isCorrect = i === 2;
                        } else if (hint.id === 4) {
                          isCorrect = false; // d4位置错
                        } else if (hint.id === 5) {
                          isCorrect = false; // d5,d4位置都错
                        }
                      } else if (digitsCount === 6) {
                        // 6位: 提示1(d1=0对), 提示2(d2=1,d3=2对), 提示3(d4=3对), 提示4(d5=4错), 提示5(d5=4,d6=5错), 提示6(d4=3,d5=4,d6=5错)
                        if (hint.id === 1) {
                          isCorrect = i === 0; // d1位置0正确
                        } else if (hint.id === 2) {
                          isCorrect = i === 1 || i === 2; // d2位置1, d3位置2
                        } else if (hint.id === 3) {
                          isCorrect = i === 3; // d4位置3
                        } else if (hint.id === 4) {
                          isCorrect = false; // d5位置错
                        } else if (hint.id === 5) {
                          isCorrect = false; // d5,d6位置都错
                        } else if (hint.id === 6) {
                          isCorrect = false; // d4,d5,d6位置都错
                        }
                      } else if (digitsCount === 7) {
                        // 7位: 提示1(全错), 提示2(d1=0,d2=1对), 提示3(d3=2对), 提示4(d4=6错), 提示5(d5=3,d6=4,d7=5错), 提示6(d6=4,d4=5,d5=6,d7=3错), 提示7(d7=3,d5=4,d6=5,d4=6错)
                        if (hint.id === 1) {
                          isCorrect = false;
                        } else if (hint.id === 2) {
                          isCorrect = i === 0 || i === 1; // d1位置0, d2位置1
                        } else if (hint.id === 3) {
                          isCorrect = i === 2; // d3位置2
                        } else if (hint.id === 4) {
                          isCorrect = false; // d4位置错
                        } else if (hint.id === 5) {
                          isCorrect = false; // d5,d6,d7位置都错
                        } else if (hint.id === 6) {
                          isCorrect = false; // d6,d4,d5,d7位置都错
                        } else if (hint.id === 7) {
                          isCorrect = false; // d7,d5,d6,d4位置都错
                        }
                      } else if (digitsCount === 8) {
                        // 8位: 提示1(d1=0对), 提示2(d2=1,d3=2错), 提示3(d4=3错), 提示4(d5=5错), 提示5(d6=3,d7=4错), 提示6(d7=3,d8=4,d9=5错), 提示7(d5=3,d6=4,d7=5,d8=6错), 提示8(d8=3,d9=4,d10=5,d11=6错)
                        if (hint.id === 1) {
                          isCorrect = i === 0; // d1位置0正确
                        } else if (hint.id === 2) {
                          isCorrect = false; // d2,d3位置都错
                        } else if (hint.id === 3) {
                          isCorrect = false; // d4位置错
                        } else if (hint.id === 4) {
                          isCorrect = false; // d5位置错
                        } else if (hint.id === 5) {
                          isCorrect = false; // d6,d7位置都错
                        } else if (hint.id === 6) {
                          isCorrect = i === 0 || i === 1 || i === 2; // d1位置0, d2位置1, d3位置2
                        } else if (hint.id === 7) {
                          isCorrect = false; // d4,d5,d6,d7位置都错
                        } else if (hint.id === 8) {
                          isCorrect = i === 4 || i === 5 || i === 6 || i === 7; // d5位置4, d6位置5, d7位置6, d8位置7
                        }
                      } else if (digitsCount === 9) {
                        // 9位: 提示1(d1=0对), 提示2(d2=1,d3=2错), 提示3(d4=3错), 提示4(d5=5错), 提示5(d6=3,d7=4错), 提示6(d1=0,d2=1,d3=2对), 提示7(d4=3,d5=5,d6=3,d7=4错), 提示8(d5=5,d6=3,d7=4,d8=6错), 提示9(d6=3,d7=4,d8=6,d9=7错)
                        if (hint.id === 1) {
                          isCorrect = i === 0; // d1位置0正确
                        } else if (hint.id === 2) {
                          isCorrect = false; // d2,d3位置都错
                        } else if (hint.id === 3) {
                          isCorrect = false; // d4位置错
                        } else if (hint.id === 4) {
                          isCorrect = false; // d5位置错
                        } else if (hint.id === 5) {
                          isCorrect = false; // d6,d7位置都错
                        } else if (hint.id === 6) {
                          isCorrect = i === 0 || i === 1 || i === 2; // d1位置0, d2位置1, d3位置2
                        } else if (hint.id === 7) {
                          isCorrect = false; // d4,d5,d6,d7位置都错
                        } else if (hint.id === 8) {
                          isCorrect = i === 4 || i === 5 || i === 6 || i === 7; // d5位置4, d6位置5, d7位置6, d8位置7
                        } else if (hint.id === 9) {
                          isCorrect = i === 5 || i === 6 || i === 7 || i === 8; // d6位置5, d7位置6, d8位置7, d9位置8
                        }
                      }
                    }
                    return (
                      <span
                        key={i}
                        className={`${styles.hintDigit} ${isCorrect ? styles.hintDigitCorrect : ''}`}
                      >
                        {digit}
                      </span>
                    );
                  })}
                </div>
                <div className={styles.hintText}>
                  {hint.correctDigits.length === 0 ? (
                    <span>{locale === 'en' ? 'No correct digits' : '没有正确数字'}</span>
                  ) : (
                    <span>
                      {hint.correctDigits.length}{locale === 'en' ? (hint.correctDigits.length === 1 ? ' digit correct' : ' digits correct') : '个数字正确'}
                      {hint.correctPositions.length === hint.correctDigits.length
                        ? (locale === 'en' ? ', all positions correct' : '，位置都正确')
                        : (locale === 'en' ? ', positions incorrect' : '，位置都不正确')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Input */}
      <div className={styles.inputSection}>
        <div className={styles.inputLabel}>
          💭 {t('Enter your guess:', '输入你的推理密码:')}
        </div>
        <div className={styles.inputGrid}>
          {input.split('').map((digit, i) => (
            <div key={i} className={styles.inputDigit}>
              {digit}
            </div>
          ))}
          {Array.from({ length: digitsCount - input.length }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.inputDigitEmpty}>
              _
            </div>
          ))}
        </div>
      </div>

      {/* Number Pad */}
      <div className={styles.numberPad}>
        <div className={styles.padGrid}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              className={styles.padButton}
              onClick={() => handleNumberPress(num)}
              disabled={input.length >= digitsCount || isSuccess || isFailed}
            >
              {num}
            </button>
          ))}
          <button
            className={styles.padButton}
            onClick={() => handleNumberPress('0')}
            disabled={input.length >= digitsCount || isSuccess || isFailed}
          >
            0
          </button>
          <button
            className={`${styles.padButton} ${styles.deleteBtn}`}
            onClick={handleDelete}
            disabled={input.length === 0 || isSuccess || isFailed}
          >
            ⌫
          </button>
          <button
            className={`${styles.padButton} ${styles.clearBtn}`}
            onClick={handleClear}
            disabled={input.length === 0 || isSuccess || isFailed}
          >
            {t('Clear', '清空')}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={input.length !== digitsCount || isSuccess || isFailed}
      >
        {t('Submit', '提交')}
      </button>

      {/* 提交提示信息 */}
      {submitMessage && (
        <div className={`${styles.submitMessage} ${styles[submitMessage.type]}`}>
          {submitMessage.text}
        </div>
      )}

      {/* Result Message */}
      {isSuccess && (
        <div className={styles.resultMessage}>
          🎉 {t('Correct!', '正确!')}
        </div>
      )}
      {isFailed && (
        <div className={styles.failResult}>
          <div className={styles.failText}>
            ❌ {t('Wrong! The answer is:', '错误! 正确答案是:')}
          </div>
          <div className={styles.revealAnswer}>
            {password.map((digit, i) => (
              <span key={i} className={styles.revealDigit}>{digit}</span>
            ))}
          </div>
        </div>
      )}

      {/* Next Round Button */}
      {(isSuccess || isFailed) && (
        <button className={styles.nextBtn} onClick={handleNextRound}>
          🔄 {t('Next Round', '下一回合')}
        </button>
      )}

      {/* Keyboard Hint */}
      <div className={styles.keyboardHint}>
        {t('Press 0-9 to input, Enter to submit', '按 0-9 输入, Enter 提交')}
      </div>
    </div>
  );
}

export default DeductionGame;
