'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  currentLevel: number;
  totalAttempts: number;
  elapsedTime: number;
  timeLimit?: number;
  onSettingsClick: () => void;
  onRecordsClick: () => void;
}

function Header({ 
  currentLevel, 
  totalAttempts, 
  elapsedTime, 
  timeLimit,
  onSettingsClick,
  onRecordsClick 
}: HeaderProps) {
  const [locale, setLocale] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale === 'en' || savedLocale === 'zh') {
      setLocale(savedLocale);
    }
  }, []);

  const handleLanguageToggle = useCallback(() => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    window.location.reload();
  }, [locale]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = timeLimit ? timeLimit - elapsedTime : null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔐</span>
          <span className={styles.logoText}>
            {locale === 'en' ? 'Password Cracker' : '密码破解'}
          </span>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>
              {locale === 'en' ? 'Level' : '关卡'}
            </span>
            <span className={styles.statValue}>{currentLevel}</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>
              {locale === 'en' ? 'Attempts' : '尝试'}
            </span>
            <span className={styles.statValue}>{totalAttempts}</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>
              {remainingTime !== null 
                ? (locale === 'en' ? 'Remaining' : '剩余') 
                : (locale === 'en' ? 'Time' : '时间')}
            </span>
            <span className={`${styles.statValue} ${remainingTime !== null && remainingTime <= 10 ? styles.warning : ''}`}>
              {formatTime(remainingTime !== null ? remainingTime : elapsedTime)}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.iconButton}
            onClick={handleLanguageToggle}
            aria-label="Toggle language"
          >
            {locale === 'en' ? '中' : 'EN'}
          </button>
          <button 
            className={styles.iconButton}
            onClick={onRecordsClick}
            aria-label="Records"
          >
            📊
          </button>
          <button 
            className={styles.iconButton}
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
