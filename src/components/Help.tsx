'use client';

import { useState } from 'react';
import styles from './Help.module.css';

interface HelpProps {
  locale?: 'en' | 'zh';
  onBack?: () => void;
  embedded?: boolean;
}

export default function Help({ locale = 'en', onBack, embedded = false }: HelpProps) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en;
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', icon: '📖', label: t('游戏概述', 'Overview') },
    { id: 'rules', icon: '📜', label: t('游戏规则', 'Rules') },
    { id: 'hints', icon: '💡', label: t('提示系统', 'Hints') },
    { id: 'difficulty', icon: '🎯', label: t('难度说明', 'Difficulty') },
    { id: 'controls', icon: '🎮', label: t('操作指南', 'Controls') },
    { id: 'scoring', icon: '🏆', label: t('计分规则', 'Scoring') },
  ];

  return (
    <div className={styles.container}>
      {!embedded && (
        <div className={styles.header}>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← {t('返回', 'Back')}
            </button>
          )}
          <h1 className={styles.title}>{t('🎮 游戏帮助', '🎮 Game Help')}</h1>
          <p className={styles.subtitle}>
            {t('学习如何成为密码破解大师', 'Learn how to become a master code breaker')}
          </p>
        </div>
      )}

      <div className={styles.content}>
        {/* 导航选项卡 */}
        <div className={styles.navTabs}>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.navTab} ${activeSection === section.id ? styles.active : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className={styles.navIcon}>{section.icon}</span>
              <span className={styles.navLabel}>{section.label}</span>
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className={styles.sectionContent}>
          {/* 游戏概述 */}
          {activeSection === 'overview' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📖</span>
                {t('游戏概述', 'Game Overview')}
              </h2>
              
              <div className={styles.infoCard}>
                <h3>{t('什么是 CrackCode？', 'What is CrackCode?')}</h3>
                <p>
                  {t(
                    'CrackCode 是一款基于经典撞码游戏（Bulls and Cows）改编的密码推理游戏。在游戏中，你需要通过逻辑推理，根据系统给出的提示信息，推测出隐藏在数字密码中的每一个数字及其正确位置。',
                    'CrackCode is a password deduction game based on the classic Bulls and Cows game. In this game, you need to use logical reasoning and the hints provided by the system to deduce each digit in the hidden password and its correct position.'
                  )}
                </p>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('游戏目标', 'Game Objective')}</h3>
                <p>
                  {t(
                    '你的目标是尽可能用最少的尝试次数猜出正确的密码。每一次猜测后，系统会给出提示，告诉你有多少个数字位置正确（Bulls），有多少个数字存在但位置不对（Cows）。',
                    'Your goal is to guess the correct password with as few attempts as possible. After each guess, the system will provide hints telling you how many digits are in the correct position (Bulls) and how many digits exist but are in the wrong position (Cows).'
                  )}
                </p>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('两种游戏模式', 'Two Game Modes')}</h3>
                <div className={styles.modeGrid}>
                  <div className={styles.modeCard}>
                    <h4>🎮 {t('基础版', 'Basic Mode')}</h4>
                    <ul>
                      <li>{t('10个难度递增的关卡', '10 levels with increasing difficulty')}</li>
                      <li>{t('有时间限制', 'Time-limited challenges')}</li>
                      <li>{t('解锁新关卡需要完成当前关卡', 'Complete current level to unlock next')}</li>
                      <li>{t('记录最佳时间和尝试次数', 'Track best time and attempts')}</li>
                    </ul>
                  </div>
                  <div className={styles.modeCard}>
                    <h4>🧩 {t('推理版', 'Deduction Mode')}</h4>
                    <ul>
                      <li>{t('纯推理挑战，无时间限制', 'Pure deduction challenges, no time limit')}</li>
                      <li>{t('支持3-9位数字密码', '3-9 digit passwords supported')}</li>
                      <li>{t('专注于逻辑推理能力', 'Focus on logical reasoning skills')}</li>
                      <li>{t('适合安静思考和练习', 'Perfect for quiet thinking and practice')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.tip}>
                <span className={styles.tipIcon}>💡</span>
                <span>
                  {t('提示：刚开始游戏时，建议从基础版的入门关卡开始，熟悉规则后再尝试更高难度。', 
                     'Tip: When starting, we recommend beginning with the Beginner level in Basic Mode to familiarize yourself with the rules before attempting higher difficulties.')}
                </span>
              </div>
            </div>
          )}

          {/* 游戏规则 */}
          {activeSection === 'rules' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📜</span>
                {t('游戏规则', 'Game Rules')}
              </h2>

              <div className={styles.infoCard}>
                <h3>{t('基本规则', 'Basic Rules')}</h3>
                <ol className={styles.ruleList}>
                  <li>
                    <strong>{t('密码组成', 'Password Composition')}</strong>
                    <p>
                      {t(
                        '密码由不重复的数字组成。基础模式中，位数从4位逐渐增加到10位。推理模式支持3-9位数字。',
                        'The password consists of non-repeating digits. In Basic Mode, the digit count increases from 4 to 10. Deduction Mode supports 3-9 digits.'
                      )}
                    </p>
                  </li>
                  <li>
                    <strong>{t('输入猜测', 'Making Guesses')}</strong>
                    <p>
                      {t(
                        '在数字键盘上输入你的猜测数字，按确认按钮提交。每次猜测都会消耗一次尝试机会。',
                        'Enter your guessed digits on the number pad and press confirm to submit. Each guess consumes one attempt.'
                      )}
                    </p>
                  </li>
                  <li>
                    <strong>{t('获取提示', 'Getting Hints')}</strong>
                    <p>
                      {t(
                        '提交猜测后，系统会显示 Bulls（B）和 Cows（C）的数量。这些提示帮助你缩小正确答案的范围。',
                        'After submitting a guess, the system displays the number of Bulls (B) and Cows (C). These hints help you narrow down the correct answer.'
                      )}
                    </p>
                  </li>
                  <li>
                    <strong>{t('胜利条件', 'Winning Condition')}</strong>
                    <p>
                      {t(
                        '当 Bulls 的数量等于密码的位数时，表示你完全猜中了密码，闯关成功！',
                        'When the number of Bulls equals the number of digits in the password, you have completely cracked the code and won!'
                      )}
                    </p>
                  </li>
                </ol>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('Bulls 和 Cows 详解', 'Bulls and Cows Explained')}</h3>
                <div className={styles.bullCowDemo}>
                  <div className={styles.demoExample}>
                    <div className={styles.demoHeader}>
                      <strong>{t('示例', 'Example')}</strong>
                    </div>
                    <div className={styles.demoContent}>
                      <p><strong>{t('密码', 'Password')}:</strong> 1234</p>
                      <p><strong>{t('你的猜测', 'Your Guess')}:</strong> 1432</p>
                      <div className={styles.demoResult}>
                        <div className={styles.bullResult}>
                          <span className={styles.bullLabel}>Bulls: 2</span>
                          <span className={styles.bullExplain}>(1和2位置正确)</span>
                        </div>
                        <div className={styles.cowResult}>
                          <span className={styles.cowLabel}>Cows: 2</span>
                          <span className={styles.cowExplain}>(3和4位置错误)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.visualGuide}>
                    <div className={styles.comparison}>
                      <div className={styles.codeRow}>
                        <span className={styles.codeLabel}>{t('密码', 'Code')}</span>
                        <span className={styles.codeDigit}>1</span>
                        <span className={styles.codeDigit}>2</span>
                        <span className={styles.codeDigit}>3</span>
                        <span className={styles.codeDigit}>4</span>
                      </div>
                      <div className={styles.codeRow}>
                        <span className={styles.codeLabel}>{t('猜测', 'Guess')}</span>
                        <span className={`${styles.codeDigit} ${styles.bull}`}>1</span>
                        <span className={`${styles.codeDigit} ${styles.bull}`}>4</span>
                        <span className={`${styles.codeDigit} ${styles.cow}`}>3</span>
                        <span className={`${styles.codeDigit} ${styles.cow}`}>2</span>
                      </div>
                    </div>
                    <div className={styles.legend}>
                      <span className={styles.legendBull}>🟢 Bulls: {t('位置正确', 'Correct position')}</span>
                      <span className={styles.legendCow}>🟡 Cows: {t('数字存在但位置错误', 'Digit exists but wrong position')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('时间限制规则', 'Time Limit Rules')}</h3>
                <p>
                  {t(
                    '在基础模式的部分关卡中，你需要同时兼顾速度和准确性。每个关卡都有不同的时间限制：',
                    'In some levels of Basic Mode, you need to balance speed and accuracy. Each level has a different time limit:'
                  )}
                </p>
                <ul className={styles.timeTable}>
                  <li><strong>{t('入门（4位数）', 'Beginner (4 digits)')}</strong>: {t('无时间限制', 'No time limit')}</li>
                  <li><strong>{t('数字迷宫（4位数）', 'Number Maze (4 digits)')}</strong>: 120{t('秒', 's')}</li>
                  <li><strong>{t('镜像挑战（5位数）', 'Mirror Challenge (5 digits)')}</strong>: 90{t('秒', 's')}</li>
                  <li><strong>{t('位置战争（6位数）', 'Position War (6 digits)')}</strong>: 60{t('秒', 's')}</li>
                  <li><strong>{t('邻居之争（6位数）', 'Neighborhood War (6 digits)')}</strong>: 45{t('秒', 's')}</li>
                  <li><strong>{t('质数迷局（7位数）', 'Prime Mystery (7 digits)')}</strong>: 40{t('秒', 's')}</li>
                  <li><strong>{t('数学家（8位数）', 'Mathematician (8 digits)')}</strong>: 35{t('秒', 's')}</li>
                  <li><strong>{t('数列密码（8位数）', 'Sequence Cipher (8 digits)')}</strong>: 30{t('秒', 's')}</li>
                  <li><strong>{t('大师推理（9位数）', 'Master Deduction (9 digits)')}</strong>: 25{t('秒', 's')}</li>
                  <li><strong>{t('终极挑战（10位数）', 'Ultimate Challenge (10 digits)')}</strong>: 20{t('秒', 's')}</li>
                </ul>
              </div>
            </div>
          )}

          {/* 提示系统 */}
          {activeSection === 'hints' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>💡</span>
                {t('提示系统', 'Hint System')}
              </h2>

              <div className={styles.infoCard}>
                <h3>{t('什么是提示卡？', 'What are Hint Cards?')}</h3>
                <p>
                  {t(
                    '在推理模式中，你可以使用提示卡来获取额外的帮助信息。提示卡会在游戏中随机出现，点击即可激活。',
                    'In Deduction Mode, you can use hint cards to get additional help. Hint cards appear randomly during gameplay - click to activate them.'
                  )}
                </p>
              </div>

              <div className={styles.hintTypes}>
                <div className={styles.hintCard}>
                  <div className={styles.hintIcon}>🔍</div>
                  <h4>{t('位置提示', 'Position Hint')}</h4>
                  <p>
                    {t('显示某个位置的数字范围，如"这个位置是偶数"或"这个数字大于5"。', 
                      'Shows the range for a position, such as "this position is an even number" or "this digit is greater than 5".')}
                  </p>
                  <span className={styles.hintFreq}>{t('出现频率', 'Frequency')}: {t('常见', 'Common')}</span>
                </div>

                <div className={styles.hintCard}>
                  <div className={styles.hintIcon}>❌</div>
                  <h4>{t('排除提示', 'Elimination Hint')}</h4>
                  <p>
                    {t('告诉你某个特定数字一定不在密码中（如果使用数字0-9）。',
                      'Tells you that a specific digit is definitely not in the password (if using digits 0-9).')}
                  </p>
                  <span className={styles.hintFreq}>{t('出现频率', 'Frequency')}: {t('常见', 'Common')}</span>
                </div>

                <div className={styles.hintCard}>
                  <div className={styles.hintIcon}>✅</div>
                  <h4>{t('确认提示', 'Confirmation Hint')}</h4>
                  <p>
                    {t('确认某个数字一定在密码中，但不告诉你具体位置。',
                      'Confirms that a digit is definitely in the password, but does not reveal its position.')}
                  </p>
                  <span className={styles.hintFreq}>{t('出现频率', 'Frequency')}: {t('中等', 'Medium')}</span>
                </div>

                <div className={styles.hintCard}>
                  <div className={styles.hintIcon}>📍</div>
                  <h4>{t('关系提示', 'Relationship Hint')}</h4>
                  <p>
                    {t('告诉你两个位置之间的关系，如"A位置大于B位置"或"A和B是相邻数字"。',
                      'Tells you about the relationship between two positions, such as "Position A is greater than Position B" or "A and B are adjacent digits".')}
                  </p>
                  <span className={styles.hintFreq}>{t('出现频率', 'Frequency')}: {t('稀有', 'Rare')}</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('使用策略', 'Usage Strategy')}</h3>
                <ul className={styles.strategyList}>
                  <li>
                    <strong>{t('早期使用关系提示', 'Use relationship hints early')}</strong>
                    <p>{t('在游戏早期获取关系提示可以帮助你快速建立数字之间的逻辑联系。', 
                        'Getting relationship hints early can help you quickly establish logical connections between digits.')}</p>
                  </li>
                  <li>
                    <strong>{t('中期使用位置和排除提示', 'Use position and elimination hints in mid-game')}</strong>
                    <p>{t('当范围缩小后，这些提示可以帮助你精确锁定每个位置的数字。',
                        'When the range narrows, these hints can help you precisely pinpoint each position.')}</p>
                  </li>
                  <li>
                    <strong>{t('谨慎使用确认提示', 'Use confirmation hints sparingly')}</strong>
                    <p>{t('虽然确认提示很有用，但其他类型的提示可能更有价值。',
                        'While confirmation hints are useful, other types of hints may be more valuable.')}</p>
                  </li>
                  <li>
                    <strong>{t('独立思考优先', 'Prioritize independent thinking')}</strong>
                    <p>{t('提示只是辅助工具，真正的乐趣来自于你自己推理出密码的过程！',
                        'Hints are just auxiliary tools - the real fun comes from deducing the code yourself!')}</p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 难度说明 */}
          {activeSection === 'difficulty' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎯</span>
                {t('难度说明', 'Difficulty Levels')}
              </h2>

              <div className={styles.difficultyIntro}>
                <p>
                  {t(
                    'CrackCode 提供两种游戏模式，每种模式都有不同的难度设置。选择适合你的挑战！',
                    'CrackCode offers two game modes, each with different difficulty settings. Choose the challenge that suits you!'
                  )}
                </p>
              </div>

              <h3 className={styles.subTitle}>{t('基础版关卡', 'Basic Mode Levels')}</h3>
              <div className={styles.levelCards}>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>1</div>
                  <h4>{t('入门', 'Beginner')}</h4>
                  <p>{t('4位数字，无时间限制', '4 digits, no time limit')}</p>
                  <span className={styles.difficulty}>⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>2</div>
                  <h4>{t('数字迷宫', 'Number Maze')}</h4>
                  <p>{t('4位数字，120秒', '4 digits, 120s')}</p>
                  <span className={styles.difficulty}>⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>3</div>
                  <h4>{t('镜像挑战', 'Mirror Challenge')}</h4>
                  <p>{t('5位数字，90秒', '5 digits, 90s')}</p>
                  <span className={styles.difficulty}>⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>4</div>
                  <h4>{t('位置战争', 'Position War')}</h4>
                  <p>{t('6位数字，60秒', '6 digits, 60s')}</p>
                  <span className={styles.difficulty}>⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>5</div>
                  <h4>{t('邻居之争', 'Neighborhood War')}</h4>
                  <p>{t('6位数字，45秒', '6 digits, 45s')}</p>
                  <span className={styles.difficulty}>⭐⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>6</div>
                  <h4>{t('质数迷局', 'Prime Mystery')}</h4>
                  <p>{t('7位数字，40秒', '7 digits, 40s')}</p>
                  <span className={styles.difficulty}>⭐⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>7</div>
                  <h4>{t('数学家', 'Mathematician')}</h4>
                  <p>{t('8位数字，35秒', '8 digits, 35s')}</p>
                  <span className={styles.difficulty}>⭐⭐⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>8</div>
                  <h4>{t('数列密码', 'Sequence Cipher')}</h4>
                  <p>{t('8位数字，30秒', '8 digits, 30s')}</p>
                  <span className={styles.difficulty}>⭐⭐⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>9</div>
                  <h4>{t('大师推理', 'Master Deduction')}</h4>
                  <p>{t('9位数字，25秒', '9 digits, 25s')}</p>
                  <span className={styles.difficulty}>⭐⭐⭐⭐⭐</span>
                </div>
                <div className={styles.levelCard}>
                  <div className={styles.levelBadge}>10</div>
                  <h4>{t('终极挑战', 'Ultimate Challenge')}</h4>
                  <p>{t('10位数字，20秒', '10 digits, 20s')}</p>
                  <span className={styles.difficulty}>⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <h3 className={styles.subTitle}>{t('推理版关卡', 'Deduction Mode Levels')}</h3>
              <div className={styles.deductionLevels}>
                <p>
                  {t(
                    '推理版专注于纯粹的逻辑推理，没有时间压力。每个关卡解锁后，你可以随时挑战更高位数的密码。',
                    'Deduction Mode focuses on pure logical reasoning with no time pressure. After unlocking each level, you can challenge higher digit passwords at any time.'
                  )}
                </p>
                <div className={styles.deductionGrid}>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>3</span>
                    <span>{t('3位密码', '3 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('初始解锁', 'Initially Unlocked')}</span>
                  </div>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>4</span>
                    <span>{t('4位密码', '4 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('需完成3位', 'Complete 3 Digit')}</span>
                  </div>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>5</span>
                    <span>{t('5位密码', '5 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('需完成4位', 'Complete 4 Digit')}</span>
                  </div>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>6</span>
                    <span>{t('6位密码', '6 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('需完成5位', 'Complete 5 Digit')}</span>
                  </div>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>7</span>
                    <span>{t('7位密码', '7 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('需完成6位', 'Complete 6 Digit')}</span>
                  </div>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>8</span>
                    <span>{t('8位密码', '8 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('需完成7位', 'Complete 7 Digit')}</span>
                  </div>
                  <div className={styles.deductionItem}>
                    <span className={styles.digitCount}>9</span>
                    <span>{t('9位密码', '9 Digit')}</span>
                    <span className={styles.unlockStatus}>{t('需完成8位', 'Complete 8 Digit')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.tip}>
                <span className={styles.tipIcon}>🎯</span>
                <span>
                  {t('建议：先在推理版中练习各个位数，掌握规律后再挑战有时间限制的基础版！',
                     'Suggestion: Practice with different digit counts in Deduction Mode first, then challenge the time-limited Basic Mode after mastering the patterns!')}
                </span>
              </div>
            </div>
          )}

          {/* 操作指南 */}
          {activeSection === 'controls' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎮</span>
                {t('操作指南', 'Controls Guide')}
              </h2>

              <div className={styles.infoCard}>
                <h3>{t('数字输入', 'Number Input')}</h3>
                <div className={styles.controlDemo}>
                  <div className={styles.controlItem}>
                    <div className={styles.controlKey}>0-9</div>
                    <p>{t('点击数字键输入对应的数字到当前光标位置', 'Click number keys to input corresponding digits at cursor position')}</p>
                  </div>
                  <div className={styles.controlItem}>
                    <div className={styles.controlKey}>⌫</div>
                    <p>{t('删除光标前的一个数字', 'Delete one digit before cursor')}</p>
                  </div>
                  <div className={styles.controlItem}>
                    <div className={styles.controlKey}>✓</div>
                    <p>{t('确认并提交当前猜测', 'Confirm and submit current guess')}</p>
                  </div>
                  <div className={styles.controlItem}>
                    <div className={styles.controlKey}>🔄</div>
                    <p>{t('重新开始当前关卡', 'Restart current level')}</p>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('菜单操作', 'Menu Operations')}</h3>
                <div className={styles.menuControls}>
                  <div className={styles.menuItem}>
                    <span className={styles.menuIcon}>🎮/🧩</span>
                    <div>
                      <strong>{t('选择游戏模式', 'Select Game Mode')}</strong>
                      <p>{t('在主菜单中切换基础版和推理版', 'Switch between Basic Mode and Deduction Mode in main menu')}</p>
                    </div>
                  </div>
                  <div className={styles.menuItem}>
                    <span className={styles.menuIcon}>🌐</span>
                    <div>
                      <strong>{t('切换语言', 'Switch Language')}</strong>
                      <p>{t('点击右上角的语言按钮在中英文之间切换', 'Click language button in top right to switch between Chinese and English')}</p>
                    </div>
                  </div>
                  <div className={styles.menuItem}>
                    <span className={styles.menuIcon}>📊</span>
                    <div>
                      <strong>{t('查看记录', 'View Records')}</strong>
                      <p>{t('点击记录按钮查看历史成绩和最佳时间', 'Click records button to view historical scores and best times')}</p>
                    </div>
                  </div>
                  <div className={styles.menuItem}>
                    <span className={styles.menuIcon}>⚙️</span>
                    <div>
                      <strong>{t('设置', 'Settings')}</strong>
                      <p>{t('点击设置按钮管理语言和重置进度', 'Click settings to manage language and reset progress')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('游戏内操作', 'In-Game Operations')}</h3>
                <div className={styles.inGameControls}>
                  <div className={styles.gameControlItem}>
                    <span className={styles.gameIcon}>←</span>
                    <span className={styles.gameAction}>{t('返回菜单', 'Back to Menu')}</span>
                    <span className={styles.gameDesc}>{t('放弃当前关卡，返回主菜单', 'Abandon current level and return to main menu')}</span>
                  </div>
                  <div className={styles.gameControlItem}>
                    <span className={styles.gameIcon}>🏳️</span>
                    <span className={styles.gameAction}>{t('投降', 'Give Up')}</span>
                    <span className={styles.gameDesc}>{t('显示正确答案并结束当前关卡', 'Reveal correct answer and end current level')}</span>
                  </div>
                  <div className={styles.gameControlItem}>
                    <span className={styles.gameIcon}>💡</span>
                    <span className={styles.gameAction}>{t('使用提示', 'Use Hints')}</span>
                    <span className={styles.gameDesc}>{t('推理模式专用，点击提示卡获取帮助', 'Deduction Mode only - click hint cards for help')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.tip}>
                <span className={styles.tipIcon}>⌨️</span>
                <span>
                  {t('提示：游戏支持触摸和鼠标操作。在桌面设备上，使用鼠标点击数字键即可。',
                     'Tip: The game supports both touch and mouse input. On desktop devices, simply click the number keys with your mouse.')}
                </span>
              </div>
            </div>
          )}

          {/* 计分规则 */}
          {activeSection === 'scoring' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🏆</span>
                {t('计分规则', 'Scoring System')}
              </h2>

              <div className={styles.infoCard}>
                <h3>{t('记录指标', 'Tracked Metrics')}</h3>
                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricIcon}>⏱</span>
                    <h4>{t('用时', 'Time')}</h4>
                    <p>{t('完成关卡所花费的总时间', 'Total time spent completing the level')}</p>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricIcon}>🎯</span>
                    <h4>{t('尝试次数', 'Attempts')}</h4>
                    <p>{t('成功破解密码所使用的猜测次数', 'Number of guesses used to crack the password')}</p>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricIcon}>🏆</span>
                    <h4>{t('总胜利', 'Total Wins')}</h4>
                    <p>{t('成功完成的关卡总数', 'Total number of levels successfully completed')}</p>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricIcon}>🎮</span>
                    <h4>{t('游戏场次', 'Games Played')}</h4>
                    <p>{t('开始过的关卡总数（包括未完成的）', 'Total levels started (including unfinished)')}</p>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('最佳记录', 'Best Records')}</h3>
                <p>
                  {t(
                    '系统会自动记录你在每个关卡的最佳表现。这些记录会显示在关卡选择界面和记录页面中。',
                    'The system automatically records your best performance on each level. These records are displayed on the level selection screen and records page.'
                  )}
                </p>
                <div className={styles.recordExample}>
                  <div className={styles.recordBadge}>📊</div>
                  <div className={styles.recordInfo}>
                    <p><strong>{t('示例记录', 'Example Record')}</strong></p>
                    <p>{t('关卡 3 - 镜像挑战', 'Level 3 - Mirror Challenge')}</p>
                    <p>⏱ 01:23 | 🎯 7 {t('次尝试', 'attempts')}</p>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>{t('如何提高成绩', 'How to Improve')}</h3>
                <div className={styles.improveTips}>
                  <div className={styles.improveItem}>
                    <span className={styles.improveNum}>1</span>
                    <div>
                      <strong>{t('系统性猜测', 'Systematic Guessing')}</strong>
                      <p>
                        {t('从能提供最多信息的猜测开始。例如，对于4位密码，先猜0123可以看到最多组合。',
                          'Start with guesses that provide the most information. For example, for a 4-digit password, guessing 0123 first reveals the most combinations.')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.improveItem}>
                    <span className={styles.improveNum}>2</span>
                    <div>
                      <strong>{t('记录每次猜测', 'Record Each Guess')}</strong>
                      <p>
                        {t('注意观察历史猜测中的Bulls和Cows变化，这有助于发现数字和位置的规律。',
                          'Pay attention to changes in Bulls and Cows from historical guesses - this helps discover patterns in digits and positions.')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.improveItem}>
                    <span className={styles.improveNum}>3</span>
                    <div>
                      <strong>{t('使用逻辑排除', 'Use Logical Elimination')}</strong>
                      <p>
                        {t('根据提示逐步排除不可能的数字组合，缩小搜索范围。',
                          'Gradually eliminate impossible digit combinations based on hints to narrow the search range.')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.improveItem}>
                    <span className={styles.improveNum}>4</span>
                    <div>
                      <strong>{t('练习高难度关卡', 'Practice Higher Difficulty')}</strong>
                      <p>
                        {t('推理版没有时间压力，是练习高级技巧的最佳场所。',
                          'Deduction Mode has no time pressure, making it the best place to practice advanced techniques.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.tip}>
                <span className={styles.tipIcon}>🏆</span>
                <span>
                  {t('终极目标：用最少的尝试次数破解最长的密码！这需要大量练习和敏锐的逻辑思维能力。',
                     'Ultimate goal: Crack the longest password with the fewest attempts! This requires lots of practice and sharp logical thinking skills.')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
