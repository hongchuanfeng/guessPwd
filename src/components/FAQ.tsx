'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
  embedded?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqData: Record<string, FAQItem[]> = {
  en: [
    {
      category: 'Game Basics',
      question: 'What is CrackCode?',
      answer: 'CrackCode is an innovative password deduction game inspired by the classic Bulls and Cows game. Your goal is to crack a hidden numeric password by making educated guesses and analyzing the feedback (Bulls and Cows) provided after each attempt.',
    },
    {
      category: 'Game Basics',
      question: 'What do Bulls and Cows mean?',
      answer: 'Bulls indicate digits that are correct AND in the correct position. Cows indicate digits that exist in the password but are in the wrong position. For example, if the password is 1234 and you guess 1432, you get 2 Bulls (1 and 2 are correct and in position) and 2 Cows (3 and 4 exist but are swapped).',
    },
    {
      category: 'Game Basics',
      question: 'How do I win the game?',
      answer: 'You win when all digits are Bulls - meaning every digit is correct AND in the correct position. For a 4-digit password, you need 4 Bulls. The fewer attempts you use, the better your score!',
    },
    {
      category: 'Game Modes',
      question: "What's the difference between Basic Mode and Deduction Mode?",
      answer: 'Basic Mode has 10 levels with increasing difficulty and time limits. You must complete each level to unlock the next. Deduction Mode focuses on pure logical reasoning with no time pressure, allowing you to practice and develop your deduction skills. Deduction Mode supports passwords from 3 to 9 digits.',
    },
    {
      category: 'Game Modes',
      question: 'How do I unlock levels in Basic Mode?',
      answer: 'Complete the current level to automatically unlock the next one. Your progress is saved automatically in your browser.',
    },
    {
      category: 'Game Modes',
      question: 'How do I unlock levels in Deduction Mode?',
      answer: 'Complete the 3-digit level to unlock 4-digit, complete 4-digit to unlock 5-digit, and so on. Each level must be completed to unlock the next.',
    },
    {
      category: 'Gameplay',
      question: 'Can I use the same digit multiple times in a password?',
      answer: 'No, all digits in the password are unique and non-repeating. This makes the game more challenging and strategic, as you need to consider which digits have been eliminated with each guess.',
    },
    {
      category: 'Gameplay',
      question: 'Can I go back to previous levels?',
      answer: 'Yes! All unlocked levels are accessible from the main menu. You can replay any level you have unlocked to improve your score.',
    },
    {
      category: 'Gameplay',
      question: 'What happens if I run out of time?',
      answer: 'In timed levels, if the countdown reaches zero, the game ends and you will see the correct password. You can then choose to try again or return to the menu.',
    },
    {
      category: 'Gameplay',
      question: 'What are Hint Cards?',
      answer: 'In Deduction Mode, Hint Cards randomly appear during gameplay. These provide helpful hints such as "this digit is greater than 5" or "these two positions contain consecutive numbers." They can be clicked to activate and assist your deduction.',
    },
    {
      category: 'Gameplay',
      question: 'What is the best strategy for guessing?',
      answer: 'A good starting strategy is to guess numbers that give you the most information. For a 4-digit password, guessing 0123 first reveals which digits from 0-3 are present. Then, based on the feedback, you can make increasingly targeted guesses to narrow down the possibilities.',
    },
    {
      category: 'Gameplay',
      question: 'Is there a way to reset my progress?',
      answer: 'Yes! Click the settings icon (⚙️) in the top right corner, then click "Reset Progress" to clear all your game data and start fresh.',
    },
    {
      category: 'Technical',
      question: 'What devices can I play on?',
      answer: 'CrackCode is a web-based game that works on any device with a browser - desktop computers, laptops, tablets, and smartphones. The interface automatically adapts to your screen size.',
    },
    {
      category: 'Technical',
      question: 'Do I need to create an account?',
      answer: 'No account is required. Your game progress is automatically saved in your browser using localStorage. Your data remains on your device unless you reset it.',
    },
    {
      category: 'Technical',
      question: 'Will my progress be saved?',
      answer: 'Yes! Your progress is automatically saved to your browser after each level completion. However, clearing browser data may erase your saved progress. If you switch browsers or devices, your progress will not carry over.',
    },
    {
      category: 'Technical',
      question: 'Why is the game not loading?',
      answer: 'Try refreshing the page or clearing your browser cache. Make sure you have a stable internet connection. If the problem persists, try using a different browser.',
    },
    {
      category: 'Technical',
      question: 'Is there a sound effect option?',
      answer: 'Currently, the game does not have sound effects to ensure a distraction-free experience. This may be added in future updates.',
    },
    {
      category: 'Tips & Tricks',
      question: 'How can I improve my deduction skills?',
      answer: 'Practice in Deduction Mode first - there is no time pressure so you can think carefully. Pay attention to patterns in Bulls and Cows changes between guesses. Start with systematic guesses that cover the most possibilities, then narrow down based on feedback.',
    },
    {
      category: 'Tips & Tricks',
      question: 'Is there a mathematical way to solve this game?',
      answer: 'Yes! This game is essentially a constraint satisfaction problem. You can use techniques like constraint propagation and backtracking to systematically eliminate impossible combinations. However, with practice, most people develop intuitive shortcuts.',
    },
    {
      category: 'Tips & Tricks',
      question: 'What is the minimum number of guesses needed?',
      answer: 'For a 4-digit password (using 0-9), you can theoretically crack it in 7 guesses using an optimal strategy. However, the actual number varies based on luck and deduction efficiency. With experience, most people can consistently solve 4-digit passwords in 5-8 guesses.',
    },
  ],
  zh: [
    {
      category: '游戏基础',
      question: '什么是 CrackCode？',
      answer: 'CrackCode 是一款基于经典撞码游戏（Bulls and Cows）改编的密码推理游戏。玩家需要通过猜测和分析每次尝试后系统给出的反馈（Bulls 和 Cows）来破解隐藏的数字密码。',
    },
    {
      category: '游戏基础',
      question: 'Bulls 和 Cows 是什么意思？',
      answer: 'Bulls 表示数字正确且位置也正确。Cows 表示数字存在但位置不正确。例如，密码是 1234，你猜 1432，得到 2 个 Bulls（1 和 2 位置正确）和 2 个 Cows（3 和 4 存在但位置互换）。',
    },
    {
      category: '游戏基础',
      question: '怎样才能赢得游戏？',
      answer: '当所有数字都是 Bulls 时（即每个数字都正确且位置也正确）你就赢了。对于4位密码，你需要获得4个 Bulls。使用的尝试次数越少，成绩越好！',
    },
    {
      category: '游戏模式',
      question: '基础版和推理版有什么区别？',
      answer: '基础版有10个难度递增且有时间限制的关卡，必须完成当前关卡才能解锁下一个。推理版专注于纯粹的逻辑推理，没有时间压力，非常适合练习和提升推理能力。推理版支持3-9位数字密码。',
    },
    {
      category: '游戏模式',
      question: '如何解锁基础版的关卡？',
      answer: '完成当前关卡后，下一个关卡会自动解锁。游戏进度会自动保存在浏览器中。',
    },
    {
      category: '游戏模式',
      question: '如何解锁推理版的关卡？',
      answer: '完成3位关卡解锁4位，完成4位解锁5位，以此类推。每个关卡必须完成后才能解锁下一个。',
    },
    {
      category: '游戏玩法',
      question: '密码中可以使用重复的数字吗？',
      answer: '不可以，密码中的所有数字都是唯一的且不重复。这使得游戏更具挑战性和策略性，因为你需要在每次猜测后考虑哪些数字已被排除。',
    },
    {
      category: '游戏玩法',
      question: '可以回到之前的关卡吗？',
      answer: '可以！所有已解锁的关卡都可以从主菜单访问。你可以重玩任何已解锁的关卡来提高成绩。',
    },
    {
      category: '游戏玩法',
      question: '时间耗尽会怎样？',
      answer: '在有时间限制的关卡中，如果倒计时归零，游戏结束，你会看到正确答案。然后可以选择重试或返回菜单。',
    },
    {
      category: '游戏玩法',
      question: '什么是提示卡？',
      answer: '在推理模式中，提示卡会在游戏过程中随机出现。这些提示提供有用的信息，如"这个数字大于5"或"这两个位置包含连续的数字"。点击即可激活来辅助你的推理。',
    },
    {
      category: '游戏玩法',
      question: '最佳猜测策略是什么？',
      answer: '一个好的起始策略是猜测能提供最多信息的数字。对于4位密码，先猜 0123 可以揭示 0-3 中哪些数字存在。然后根据反馈，你可以进行更有针对性的猜测来缩小范围。',
    },
    {
      category: '游戏玩法',
      question: '如何重置游戏进度？',
      answer: '可以！点击右上角的设置图标（⚙️），然后点击"重置进度"来清除所有游戏数据并重新开始。',
    },
    {
      category: '技术问题',
      question: '可以在哪些设备上玩游戏？',
      answer: 'CrackCode 是一款基于网页的游戏，可以在任何有浏览器的设备上运行——台式电脑、笔记本电脑、平板电脑和智能手机。界面会自动适应你的屏幕尺寸。',
    },
    {
      category: '技术问题',
      question: '需要注册账户吗？',
      answer: '不需要注册。游戏进度会自动使用 localStorage 保存在你的浏览器中。你的数据保留在你的设备上，除非你主动重置。',
    },
    {
      category: '技术问题',
      question: '我的进度会被保存吗？',
      answer: '是的！每次完成关卡后，你的进度都会自动保存到浏览器中。但是，清除浏览器数据可能会擦除你保存的进度。如果你切换浏览器或设备，进度不会转移。',
    },
    {
      category: '技术问题',
      question: '为什么游戏无法加载？',
      answer: '尝试刷新页面或清除浏览器缓存。确保你有稳定的网络连接。如果问题持续存在，尝试使用不同的浏览器。',
    },
    {
      category: '技术问题',
      question: '有音效选项吗？',
      answer: '目前游戏没有音效，以确保专注的游戏体验。这可能在未来的更新中添加。',
    },
    {
      category: '技巧与窍门',
      question: '如何提高推理能力？',
      answer: '先在推理版中练习——这里没有时间压力，你可以仔细思考。注意观察每次猜测之间 Bulls 和 Cows 的变化模式。从能覆盖最多可能性的系统性猜测开始，然后根据反馈逐步缩小范围。',
    },
    {
      category: '技巧与窍门',
      question: '有没有数学方法可以解这个游戏？',
      answer: '有的！这个游戏本质上是一个约束满足问题。你可以使用约束传播和回溯等技术来系统地排除不可能的组合。然而，通过练习，大多数人会发展出直观的快捷方法。',
    },
    {
      category: '技巧与窍门',
      question: '最少需要多少次猜测？',
      answer: '对于4位密码（使用0-9），使用最优策略理论上可以在7次猜测内破解。然而，实际次数因运气和推理效率而异。有了经验，大多数人可以稳定地在5-8次猜测内解决4位密码。',
    },
  ],
};

export default function FAQ({ locale = 'en', onBack, embedded = false }: FAQProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;
  const faqs = faqData[locale] || faqData.en;
  
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category || 'General')))];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  const toggleFaq = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {!embedded && (
        <div className={styles.header}>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← {t('返回', 'Back')}
            </button>
          )}
          <h1 className={styles.title}>{t('❓ 常见问题', '❓ FAQ')}</h1>
          <p className={styles.subtitle}>
            {t('常见问题解答，帮助你更好地游戏', 'Common questions to help you play better')}
          </p>
        </div>
      )}

      <div className={styles.content}>
        {/* 搜索栏 */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder={t('搜索问题...', 'Search questions...')}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? t('全部', 'All') : category}
            </button>
          ))}
        </div>

        {/* FAQ 列表 */}
        <div className={styles.faqList}>
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${expandedId === index ? styles.expanded : ''}`}
            >
              <button 
                className={styles.faqQuestion}
                onClick={() => toggleFaq(index)}
              >
                <span className={styles.questionText}>{faq.question}</span>
                <span className={styles.expandIcon}>
                  {expandedId === index ? '−' : '+'}
                </span>
              </button>
              {expandedId === index && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 联系支持 */}
        <div className={styles.contactSection}>
          <div className={styles.contactCard}>
            <h3>{t('还有其他问题？', 'Still have questions?')}</h3>
            <p>
              {t(
                '如果这里没有找到你想要的答案，欢迎通过联系页面与我们取得联系。',
                "If you didn't find what you're looking for, feel free to contact us through the contact page."
              )}
            </p>
            {onBack && (
              <button 
                className={styles.contactBtn}
                onClick={onBack}
              >
                {t('联系支持', 'Contact Support')} →
              </button>
            )}
          </div>
        </div>

        {/* 快捷链接 */}
        <div className={styles.quickLinks}>
          <h3>{t('相关帮助', 'Related Help')}</h3>
          <div className={styles.linkGrid}>
            <div className={styles.quickLink}>
              <span className={styles.linkIcon}>🎮</span>
              <div>
                <strong>{t('游戏规则', 'Game Rules')}</strong>
                <p>{t('了解 Bulls 和 Cows 的含义', 'Learn the meaning of Bulls and Cows')}</p>
              </div>
            </div>
            <div className={styles.quickLink}>
              <span className={styles.linkIcon}>💡</span>
              <div>
                <strong>{t('提示系统', 'Hint System')}</strong>
                <p>{t('如何使用推理模式的提示卡', 'How to use hint cards in Deduction Mode')}</p>
              </div>
            </div>
            <div className={styles.quickLink}>
              <span className={styles.linkIcon}>🎯</span>
              <div>
                <strong>{t('难度选择', 'Difficulty Levels')}</strong>
                <p>{t('选择适合你的挑战难度', 'Choose the right difficulty for you')}</p>
              </div>
            </div>
            <div className={styles.quickLink}>
              <span className={styles.linkIcon}>🏆</span>
              <div>
                <strong>{t('计分规则', 'Scoring')}</strong>
                <p>{t('如何记录和提高你的成绩', 'How scores are tracked and how to improve')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
