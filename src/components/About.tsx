'use client';

import { useState } from 'react';
import styles from './About.module.css';

interface AboutProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
}

export default function About({ locale = 'zh', onBack }: AboutProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            ← {t('返回', 'Back')}
          </button>
        )}
        <h1 className={styles.title}>{t('关于我们', 'About Us')}</h1>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔐</span>
            <span className={styles.logoText}>CrackCode</span>
          </div>
          <p className={styles.version}>v1.0.0</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('项目介绍', 'Project Introduction')}</h2>
          <p className={styles.desc}>
            {t(
              'CrackCode 是一款创新的密码推理游戏，灵感来源于经典的撞码游戏（Bulls and Cows）。玩家需要根据有限的提示信息，通过逻辑推理找出隐藏的3位数字密码。',
              'CrackCode is an innovative password deduction game inspired by the classic Bulls and Cows game. Players need to use logical reasoning to find the hidden 3-digit password based on limited hints.'
            )}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('游戏特色', 'Features')}</h2>
          <ul className={styles.featureList}>
            <li>{t('🎮 独特的推理玩法，锻炼逻辑思维', '🎮 Unique deduction gameplay to sharpen logical thinking')}</li>
            <li>{t('🎨 赛博朋克风格视觉设计', '🎨 Cyberpunk-inspired visual design')}</li>
            <li>{t('🌐 支持中英文双语界面', '🌐 Bilingual support (Chinese & English)')}</li>
            <li>{t('📱 响应式设计，完美适配各种设备', '📱 Responsive design for all devices')}</li>
            <li>{t('⚡ 流畅的动画和交互体验', '⚡ Smooth animations and interactions')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('开发团队', 'Development Team')}</h2>
          <p className={styles.desc}>
            {t(
              '本项目由独立开发者创建，使用现代前端技术栈开发。我们致力于打造有趣且富有挑战性的益智游戏。',
              'This project was created by an independent developer using modern frontend technologies. We are committed to creating fun and challenging puzzle games.'
            )}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('技术栈', 'Tech Stack')}</h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <span className={styles.techIcon}>⚛️</span>
              <span>Next.js</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techIcon}>🔷</span>
              <span>TypeScript</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techIcon}>🎨</span>
              <span>CSS Modules</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techIcon}>🚀</span>
              <span>Vercel</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('加入我们', 'Join Us')}</h2>
          <p className={styles.desc}>
            {t(
              '如果您对项目有任何建议或想要参与开发，欢迎通过以下方式联系我们。',
              'If you have any suggestions or want to contribute, feel free to contact us.'
            )}
          </p>
        </section>
      </div>
    </div>
  );
}