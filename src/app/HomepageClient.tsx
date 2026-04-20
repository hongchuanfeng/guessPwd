'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styles from './HomepageClient.module.css';
import GameBoard from '@/components/GameBoard';
import DeductionGame from '@/components/DeductionGame';
import About from '@/components/About';
import Contact from '@/components/Contact';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsOfService from '@/components/TermsOfService';
import Disclaimer from '@/components/Disclaimer';
import Copyright from '@/components/Copyright';
import Modal from '@/components/Modal';
import { useGame } from '@/context/GameContext';

type GameState = 'menu' | 'playing' | 'victory' | 'defeat' | 'deduction' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'copyright';
type TabType = 'basic' | 'deduction';

// 基础版关卡配置
const BASIC_LEVELS = [
  { id: 1, digits: 4, time: 0, name: '入门', nameEn: 'Beginner' },
  { id: 2, digits: 4, time: 120, name: '数字迷宫', nameEn: 'Number Maze' },
  { id: 3, digits: 5, time: 90, name: '镜像挑战', nameEn: 'Mirror Challenge' },
  { id: 4, digits: 6, time: 60, name: '位置战争', nameEn: 'Position War' },
  { id: 5, digits: 6, time: 45, name: '邻居之争', nameEn: 'Neighborhood War' },
  { id: 6, digits: 7, time: 40, name: '质数迷局', nameEn: 'Prime Mystery' },
  { id: 7, digits: 8, time: 35, name: '数学家', nameEn: 'Mathematician' },
  { id: 8, digits: 8, time: 30, name: '数列密码', nameEn: 'Sequence Cipher' },
  { id: 9, digits: 9, time: 25, name: '大师推理', nameEn: 'Master Deduction' },
  { id: 10, digits: 10, time: 20, name: '终极挑战', nameEn: 'Ultimate Challenge' },
];

// 推理版关卡配置
const DEDUCTION_LEVELS = [
  { id: 99, digits: 3, time: 0, name: '3位密码', nameEn: '3 Digit', isDeduction: true, isMain: true, unlockLevel: 0 },
  { id: 100, digits: 4, time: 0, name: '4位密码', nameEn: '4 Digit', isDeduction: true, unlockLevel: 99 },
  { id: 101, digits: 5, time: 0, name: '5位密码', nameEn: '5 Digit', isDeduction: true, unlockLevel: 100 },
  { id: 102, digits: 6, time: 0, name: '6位密码', nameEn: '6 Digit', isDeduction: true, unlockLevel: 101 },
  { id: 103, digits: 7, time: 0, name: '7位密码', nameEn: '7 Digit', isDeduction: true, unlockLevel: 102 },
  { id: 104, digits: 8, time: 0, name: '8位密码', nameEn: '8 Digit', isDeduction: true, unlockLevel: 103 },
  { id: 105, digits: 9, time: 0, name: '9位密码', nameEn: '9 Digit', isDeduction: true, unlockLevel: 104 },
];

const LEVEL_CONFIGS = [
  { id: 1, digits: 4, time: 0, name: '入门', nameEn: 'Beginner' },
  { id: 2, digits: 4, time: 120, name: '数字迷宫', nameEn: 'Number Maze' },
  { id: 3, digits: 5, time: 90, name: '镜像挑战', nameEn: 'Mirror Challenge' },
  { id: 4, digits: 6, time: 60, name: '位置战争', nameEn: 'Position War' },
  { id: 5, digits: 6, time: 45, name: '邻居之争', nameEn: 'Neighborhood War' },
  { id: 6, digits: 7, time: 40, name: '质数迷局', nameEn: 'Prime Mystery' },
  { id: 7, digits: 8, time: 35, name: '数学家', nameEn: 'Mathematician' },
  { id: 8, digits: 8, time: 30, name: '数列密码', nameEn: 'Sequence Cipher' },
  { id: 9, digits: 9, time: 25, name: '大师推理', nameEn: 'Master Deduction' },
  { id: 10, digits: 10, time: 20, name: '终极挑战', nameEn: 'Ultimate Challenge' },
  { id: 99, digits: 3, time: 0, name: '推理模式', nameEn: 'Deduction', isDeduction: true },
];

function LoadingScreen() {
  return (
    <div className={styles.main}>
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function HomepageClient() {
  const { gameData, completeLevel, resetProgress, isMounted } = useGame();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [deductionDigits, setDeductionDigits] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
  const [locale, setLocale] = useState<'en' | 'zh'>('en');
  const [showSettings, setShowSettings] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [lastResult, setLastResult] = useState<{ attempts: number; time: number; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const hasUnlockedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [deductionUnlockedLevel, setDeductionUnlockedLevel] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale === 'en' || savedLocale === 'zh') {
      setLocale(savedLocale);
    }
  }, []);

  const handleLanguageToggle = useCallback(() => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  }, [locale]);

  const handleStartLevel = useCallback((level: number) => {
    // 推理模式特殊处理
    if (level >= 99 && level <= 105) {
      setSelectedLevel(level);
      if (level === 99) {
        setDeductionDigits(3);
      } else if (level === 100) {
        setDeductionDigits(4);
      } else if (level === 101) {
        setDeductionDigits(5);
      } else if (level === 102) {
        setDeductionDigits(6);
      } else if (level === 103) {
        setDeductionDigits(7);
      } else if (level === 104) {
        setDeductionDigits(8);
      } else if (level === 105) {
        setDeductionDigits(9);
      }
      setGameState('deduction');
      setLastResult(null);
      return;
    }
    
    if (gameData.unlockedLevels.includes(level)) {
      setSelectedLevel(level);
      setGameState('playing');
      setLastResult(null);
      setShowPassword(false);
    }
  }, [gameData.unlockedLevels, locale]);

  const handleComplete = useCallback((attempts: number, time: number) => {
    completeLevel(selectedLevel, time, attempts);
    setLastResult({ attempts, time, password: '' });
    setGameState('victory');
    hasUnlockedRef.current = selectedLevel < 10 && !gameData.completedLevels.includes(selectedLevel + 1);
  }, [selectedLevel, completeLevel, gameData.completedLevels]);

  // 推理模式完成处理
  const handleDeductionComplete = useCallback((levelId: number, time: number, attempts: number) => {
    completeLevel(levelId, time, attempts);
    const nextLevelId = levelId + 1;
    const isDeductionLevel = levelId >= 99 && levelId <= 105;
    const nextIsValid = isDeductionLevel && nextLevelId <= 105;
    setSelectedLevel(levelId);
    setDeductionUnlockedLevel(nextIsValid ? nextLevelId : null);
    setLastResult({ attempts, time, password: '' });
    setGameState('victory');
  }, [completeLevel]);

  const handleGiveUp = useCallback((password: string) => {
    setLastResult({ attempts: 0, time: 0, password });
    setShowPassword(true);
    setGameState('defeat');
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGameState('menu');
    setLastResult(null);
    setShowPassword(false);
    setSelectedLevel(1);
    setDeductionUnlockedLevel(null);
  }, []);

  const handleNextLevel = useCallback(() => {
    if (selectedLevel < 10) {
      setSelectedLevel(selectedLevel + 1);
      setGameState('playing');
      setLastResult(null);
      setShowPassword(false);
    }
  }, [selectedLevel]);

  // 推理模式下一关
  const handleNextDeductionLevel = useCallback(() => {
    const nextLevel = selectedLevel + 1;
    if (selectedLevel >= 99 && selectedLevel < 105) {
      setSelectedLevel(nextLevel);
      if (nextLevel === 100) {
        setDeductionDigits(4);
      } else if (nextLevel === 101) {
        setDeductionDigits(5);
      } else if (nextLevel === 102) {
        setDeductionDigits(6);
      } else if (nextLevel === 103) {
        setDeductionDigits(7);
      } else if (nextLevel === 104) {
        setDeductionDigits(8);
      } else if (nextLevel === 105) {
        setDeductionDigits(9);
      }
      setGameState('deduction');
      setLastResult(null);
      setDeductionUnlockedLevel(null);
    }
  }, [selectedLevel]);

  const handlePlayAgain = useCallback(() => {
    setGameState('playing');
    setLastResult(null);
    setShowPassword(false);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  if (!mounted || !isMounted) {
    return <LoadingScreen />;
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔐</span>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>
                {locale === 'en' ? 'Password Cracker' : '密码破解'}
              </span>
              <span className={styles.logoSubtitle}>
                {locale === 'en' ? 'Crack the Code' : '破解密码'}
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={handleLanguageToggle}>
              {locale === 'en' ? '中文' : 'EN'}
            </button>
            <button className={styles.iconBtn} onClick={() => setShowRecords(true)}>
              📊
            </button>
            <button className={styles.iconBtn} onClick={() => setShowSettings(true)}>
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {gameState === 'menu' && (
          <div className={styles.menu}>
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>
                {locale === 'en' 
                  ? 'Choose Your Challenge' 
                  : '选择你的挑战'}
              </h1>
              <p className={styles.heroSubtitle}>
                {activeTab === 'basic'
                  ? (locale === 'en' ? '10 levels of increasing difficulty await you' : '10个难度递增的关卡等待着你')
                  : (locale === 'en' ? 'Pure deduction challenges' : '纯推理挑战')}
              </p>
            </div>

            {/* 选项卡 */}
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${activeTab === 'basic' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                {locale === 'en' ? '🎮 Basic Mode' : '🎮 基础版'}
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'deduction' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('deduction')}
              >
                {locale === 'en' ? '🧩 Deduction Mode' : '🧩 推理版'}
              </button>
            </div>

            {/* 关卡网格 */}
            <div className={styles.levelGrid}>
              {activeTab === 'basic' && BASIC_LEVELS.map((level) => {
                const isUnlocked = gameData.unlockedLevels.includes(level.id);
                const isCompleted = gameData.completedLevels.includes(level.id);
                const bestTime = gameData.bestTimes[level.id];
                const bestAttempts = gameData.bestAttempts[level.id];

                return (
                  <button
                    key={level.id}
                    className={`${styles.levelCard} ${!isUnlocked ? styles.locked : ''} ${isCompleted ? styles.completed : ''}`}
                    onClick={() => handleStartLevel(level.id)}
                    disabled={!isUnlocked}
                    style={{ animationDelay: `${level.id * 50}ms` }}
                  >
                    <div className={styles.levelNumber}>
                      {isUnlocked ? level.id : '🔒'}
                    </div>
                    <div className={styles.levelInfo}>
                      <span className={styles.levelName}>
                        {locale === 'en' ? level.nameEn : level.name}
                      </span>
                      <span className={styles.levelDigits}>
                        {level.digits} {locale === 'en' ? 'digits' : '位数'}
                        {level.time > 0 && ` • ${level.time}s`}
                      </span>
                      {isCompleted && (
                        <span className={styles.levelBadge}>
                          ✓ {locale === 'en' ? 'Complete' : '已完成'}
                        </span>
                      )}
                      {bestTime && (
                        <span className={styles.levelBest}>
                          ⏱ {formatTime(bestTime)}
                        </span>
                      )}
                      {bestAttempts && (
                        <span className={styles.levelBest}>
                          🎯 {bestAttempts} {locale === 'en' ? 'tries' : '次'}
                        </span>
                      )}
                    </div>
                    {isCompleted && (
                      <div className={styles.levelGlow} />
                    )}
                  </button>
                );
              })}

              {activeTab === 'deduction' && DEDUCTION_LEVELS.map((level) => {
                const isUnlocked = level.unlockLevel === 0 || gameData.completedLevels.includes(level.unlockLevel);
                const isCompleted = gameData.completedLevels.includes(level.id);
                const bestTime = gameData.bestTimes[level.id];
                const bestAttempts = gameData.bestAttempts[level.id];

                return (
                  <button
                    key={level.id}
                    className={`${styles.levelCard} ${!isUnlocked ? styles.locked : ''} ${isCompleted ? styles.completed : ''}`}
                    onClick={() => {
                      if (isUnlocked) {
                        handleStartLevel(level.id);
                      }
                    }}
                    disabled={!isUnlocked}
                    style={{ animationDelay: `${(level.id - 99) * 50}ms` }}
                  >
                    <div className={styles.levelNumber}>
                      {isUnlocked ? level.digits : '🔒'}
                    </div>
                    <div className={styles.levelInfo}>
                      <span className={styles.levelName}>
                        {locale === 'en' ? level.nameEn : level.name}
                      </span>
                      <span className={styles.levelDigits}>
                        {level.digits} {locale === 'en' ? 'digits' : '位数'}
                      </span>
                      {isCompleted && (
                        <span className={styles.levelBadge}>
                          ✓ {locale === 'en' ? 'Complete' : '已完成'}
                        </span>
                      )}
                      {bestTime && (
                        <span className={styles.levelBest}>
                          ⏱ {formatTime(bestTime)}
                        </span>
                      )}
                      {bestAttempts && (
                        <span className={styles.levelBest}>
                          🎯 {bestAttempts} {locale === 'en' ? 'tries' : '次'}
                        </span>
                      )}
                    </div>
                    {isCompleted && (
                      <div className={styles.levelGlow} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <GameBoard
              key={`level-${selectedLevel}`}
              level={selectedLevel}
              digits={LEVEL_CONFIGS[selectedLevel - 1].digits}
              timeLimit={LEVEL_CONFIGS[selectedLevel - 1].time}
              onComplete={handleComplete}
              onGiveUp={handleGiveUp}
            />
          </div>
        )}

        {gameState === 'deduction' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <DeductionGame
              key={`deduction-${deductionDigits}`}
              locale={locale}
              onBack={handleBackToMenu}
              digitsCount={deductionDigits}
              onComplete={handleDeductionComplete}
            />
          </div>
        )}

        {gameState === 'about' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <About locale={locale} onBack={handleBackToMenu} />
          </div>
        )}

        {gameState === 'contact' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <Contact locale={locale} onBack={handleBackToMenu} />
          </div>
        )}

        {gameState === 'privacy' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <PrivacyPolicy locale={locale} onBack={handleBackToMenu} />
          </div>
        )}

        {gameState === 'terms' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <TermsOfService locale={locale} onBack={handleBackToMenu} />
          </div>
        )}

        {gameState === 'disclaimer' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <Disclaimer locale={locale} onBack={handleBackToMenu} />
          </div>
        )}

        {gameState === 'copyright' && (
          <div className={styles.gameContainer}>
            <button className={styles.backBtn} onClick={handleBackToMenu}>
              ← {locale === 'en' ? 'Back' : '返回'}
            </button>
            <Copyright locale={locale} onBack={handleBackToMenu} />
          </div>
        )}

        {gameState === 'victory' && lastResult && (
          <div className={styles.resultOverlay}>
            <div className={styles.victoryCard}>
              <div className={styles.confetti}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.confettiPiece}
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      background: ['#ff006e', '#ffd700', '#00d4ff', '#9b59b6', '#2ed573'][i % 5],
                    }}
                  />
                ))}
              </div>
              
              <div className={styles.resultIcon}>🎉</div>
              <h2 className={styles.resultTitle}>
                {locale === 'en' ? 'Victory!' : '胜利!'}
              </h2>
              <p className={styles.resultMessage}>
                {locale === 'en' 
                  ? `You cracked Level ${selectedLevel}!` 
                  : `你破解了第 ${selectedLevel} 关!`}
              </p>

              {(hasUnlockedRef.current || deductionUnlockedLevel) && (
                <div className={styles.unlockNotice}>
                  🎊 {locale === 'en' 
                    ? `Level ${hasUnlockedRef.current ? selectedLevel + 1 : deductionUnlockedLevel} Unlocked!` 
                    : `第 ${hasUnlockedRef.current ? selectedLevel + 1 : deductionUnlockedLevel} 关已解锁!`}
                </div>
              )}

              <div className={styles.resultStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>
                    {locale === 'en' ? 'Time' : '用时'}
                  </span>
                  <span className={styles.statValue}>
                    {formatTime(lastResult.time)}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>
                    {locale === 'en' ? 'Attempts' : '尝试'}
                  </span>
                  <span className={styles.statValue}>
                    {lastResult.attempts}
                  </span>
                </div>
              </div>

              <div className={styles.resultActions}>
                {selectedLevel < 10 && (
                  <button className={styles.nextBtn} onClick={handleNextLevel}>
                    {locale === 'en' ? 'Next Level' : '下一关'} →
                  </button>
                )}
                {selectedLevel >= 99 && selectedLevel < 105 && (
                  <button className={styles.nextBtn} onClick={handleNextDeductionLevel}>
                    {locale === 'en' ? 'Next Level' : '下一关'} →
                  </button>
                )}
                <button className={styles.playAgainBtn} onClick={handlePlayAgain}>
                  {locale === 'en' ? 'Play Again' : '再玩一次'}
                </button>
                <button className={styles.menuBtn} onClick={handleBackToMenu}>
                  {locale === 'en' ? 'Menu' : '菜单'}
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'defeat' && lastResult && (
          <div className={styles.resultOverlay}>
            <div className={styles.defeatCard}>
              <div className={styles.resultIcon}>😢</div>
              <h2 className={styles.resultTitle}>
                {locale === 'en' ? 'Game Over' : '游戏结束'}
              </h2>
              <p className={styles.resultMessage}>
                {locale === 'en' 
                  ? (showPassword ? 'The password was:' : 'Time is up!')
                  : (showPassword ? '正确密码是:' : '时间到!')}
              </p>

              {showPassword && (
                <div className={styles.passwordReveal}>
                  {lastResult.password.split('').map((digit, i) => (
                    <span key={i} className={styles.passwordDigit}>
                      {digit}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.resultActions}>
                <button className={styles.playAgainBtn} onClick={handlePlayAgain}>
                  {locale === 'en' ? 'Try Again' : '再试一次'}
                </button>
                <button className={styles.menuBtn} onClick={handleBackToMenu}>
                  {locale === 'en' ? 'Menu' : '菜单'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={locale === 'en' ? 'Settings' : '设置'}
      >
        <div className={styles.settingsContent}>
          <div className={styles.settingsItem}>
            <span>{locale === 'en' ? 'Language' : '语言'}</span>
            <button className={styles.settingsBtn} onClick={handleLanguageToggle}>
              {locale === 'en' ? '中文' : 'English'}
            </button>
          </div>
          <div className={styles.settingsItem}>
            <span>{locale === 'en' ? 'Reset Progress' : '重置进度'}</span>
            <button className={styles.settingsBtnDanger} onClick={() => {
              if (confirm(locale === 'en' ? 'Are you sure?' : '确定吗?')) {
                resetProgress();
                setShowSettings(false);
              }
            }}>
              {locale === 'en' ? 'Reset' : '重置'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRecords}
        onClose={() => setShowRecords(false)}
        title={locale === 'en' ? 'Records' : '记录'}
      >
        <div className={styles.recordsContent}>
          <div className={styles.recordsSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>
                {locale === 'en' ? 'Total Wins' : '总胜利'}
              </span>
              <span className={styles.summaryValue}>{gameData.totalWins}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>
                {locale === 'en' ? 'Games Played' : '游戏场次'}
              </span>
              <span className={styles.summaryValue}>{gameData.totalGames}</span>
            </div>
          </div>

          <div className={styles.recordsList}>
            <h3 className={styles.recordsTitle}>
              {locale === 'en' ? 'Level Records' : '关卡记录'}
            </h3>
            {gameData.completedLevels.length === 0 ? (
              <p className={styles.noRecords}>
                {locale === 'en' 
                  ? 'No completed levels yet' 
                  : '暂无完成的关卡'}
              </p>
            ) : (
              gameData.completedLevels.map((level) => {
                const config = LEVEL_CONFIGS.find(c => c.id === level);
                if (!config) return null;
                return (
                  <div key={level} className={styles.recordItem}>
                    <div className={styles.recordLevel}>
                      {locale === 'en' ? config.nameEn : config.name}
                    </div>
                    <div className={styles.recordStats}>
                      {gameData.bestTimes[level] && (
                        <span>⏱ {formatTime(gameData.bestTimes[level])}</span>
                      )}
                      {gameData.bestAttempts[level] && (
                        <span>🎯 {gameData.bestAttempts[level]}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" onClick={(e) => { e.preventDefault(); setGameState('about'); }}>{locale === 'en' ? 'About' : '关于我们'}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setGameState('contact'); }}>{locale === 'en' ? 'Contact' : '联系我们'}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setGameState('privacy'); }}>{locale === 'en' ? 'Privacy' : '隐私政策'}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setGameState('terms'); }}>{locale === 'en' ? 'Terms' : '服务条款'}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setGameState('disclaimer'); }}>{locale === 'en' ? 'Disclaimer' : '免责声明'}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setGameState('copyright'); }}>{locale === 'en' ? 'Copyright' : '版权声明'}</a>
        </div>

        {/* 友情链接 */}
        <div className={styles.friendlyLinks}>
          <span className={styles.friendlyLinksTitle}>
            {locale === 'en' ? 'Friendly Links:' : '友情链接:'}
          </span>
          <div className={styles.friendlyLinksGrid}>
            <a href="https://mosaic.chdaoai.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'Free Image Processing' : '免费图片处理'}
            </a>
            <a href="https://www.icebreakgame.com/" target="_blank" rel="noopener noreferrer">IceBreakGame</a>
            <a href="https://www.removewatermarker.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'Video Watermark Remover' : '视频去水印'}
            </a>
            <a href="https://pdf.chdaoai.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'PDF Converter' : 'PDF转换工具'}
            </a>
            <a href="https://qrcode.chdaoai.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'QR Code Generator' : '在线生成二维码'}
            </a>
            <a href="https://www.zorezoro.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'NBA Fun Stories' : 'NBA趣事'}
            </a>
            <a href="https://video2txt.zorezoro.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'Video to Text' : '视频转文字'}
            </a>
            <a href="https://www.chdaoai.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'Image Watermark Remover' : '图片去水印'}
            </a>
            <a href="https://barcode.zorezoro.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'Barcode Generator' : '在线生成条码'}
            </a>
            <a href="https://www.openai2025.com/" target="_blank" rel="noopener noreferrer">
              {locale === 'en' ? 'AI Tools Hub' : '传道AI工具'}
            </a>
          </div>
        </div>

        <p className={styles.copyright}>© 2026 CrackCode. {locale === 'en' ? 'All rights reserved.' : '保留所有权利。'}</p>
      </footer>
    </main>
  );
}
