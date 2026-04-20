'use client';

import { memo, useState, useEffect } from 'react';
import styles from './HintsPanel.module.css';

interface HintsPanelProps {
  hints: string[];
  level: number;
}

function HintsPanel({ hints, level }: HintsPanelProps) {
  const [locale, setLocale] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale === 'en' || savedLocale === 'zh') {
      setLocale(savedLocale);
    }
  }, []);

  const translateHint = (hint: string): { type: string; text: string; icon: string } => {
    const parts = hint.split('_');
    const type = parts[0];

    const translations = locale === 'en' ? {
      position: { icon: '📍', prefix: 'Position ' },
      correct: { icon: '✅', text: locale === 'en' ? 'Correct position' : '位置正确' },
      exists: { icon: '🔄', text: locale === 'en' ? 'Exists but wrong position' : '存在但位置错误' },
      none: { icon: '❌', text: locale === 'en' ? 'Does not exist' : '不存在' },
      range: { icon: '📏', prefix: locale === 'en' ? 'Range: ' : '范围: ' },
      even: { icon: '🔢', text: locale === 'en' ? 'Even number' : '偶数' },
      odd: { icon: '🔢', text: locale === 'en' ? 'Odd number' : '奇数' },
      consecutive: { icon: '➡️', text: locale === 'en' ? 'Consecutive with next' : '与下一位连续' },
      no_consecutive: { icon: '📊', text: locale === 'en' ? 'No consecutive numbers' : '没有连续数字' },
      prime: { icon: '⭐', text: locale === 'en' ? 'Prime number' : '质数' },
      prime_count: { icon: '🔢', prefix: locale === 'en' ? 'Prime count: ' : '质数数量: ' },
      sum_first: { icon: '➕', prefix: locale === 'en' ? 'Sum of first ' : '前' },
      sum_last: { icon: '➕', prefix: locale === 'en' ? 'Sum of last ' : '后' },
      sum_all: { icon: '➕', text: locale === 'en' ? 'Total sum' : '总和' },
      product: { icon: '✖️', prefix: locale === 'en' ? 'Product: ' : '乘积: ' },
      largest: { icon: '🔺', text: locale === 'en' ? 'Largest digit' : '最大数字' },
      smallest: { icon: '🔻', text: locale === 'en' ? 'Smallest digit' : '最小数字' },
      compare: { icon: '⚖️', suffix: '' },
      has_ascending: { icon: '📈', text: locale === 'en' ? 'Has ascending sequence' : '有递增序列' },
      has_descending: { icon: '📉', text: locale === 'en' ? 'Has descending sequence' : '有递减序列' },
      has_fibonacci: { icon: '🔮', text: locale === 'en' ? 'Has Fibonacci sequence' : '有斐波那契数列' },
      average: { icon: '📊', prefix: locale === 'en' ? 'Average: ' : '平均值: ' },
      unique: { icon: '🎯', prefix: locale === 'en' ? 'Unique digits: ' : '不同数字: ' },
      max_consecutive: { icon: '🔗', prefix: locale === 'en' ? 'Max consecutive: ' : '最大连续: ' },
      even_count: { icon: '🔢', prefix: locale === 'en' ? 'Even count: ' : '偶数数量: ' },
      odd_count: { icon: '🔢', prefix: locale === 'en' ? 'Odd count: ' : '奇数数量: ' },
      digit_sum: { icon: '➕', prefix: locale === 'en' ? 'Digit sum: ' : '数字之和: ' },
      mean: { icon: '📊', prefix: locale === 'en' ? 'Mean: ' : '平均值: ' },
      variance: { icon: '📉', prefix: locale === 'en' ? 'Variance: ' : '方差: ' },
      _4: { suffix: locale === 'en' ? ' digits' : ' 位' },
      _8: { suffix: locale === 'en' ? ' digits' : ' 位' },
      _all: { suffix: locale === 'en' ? ' all digits' : ' 所有位' },
    } : {
      position: { icon: '📍', prefix: '第 ' },
      correct: { icon: '✅', text: '位置正确' },
      exists: { icon: '🔄', text: '存在但位置错误' },
      none: { icon: '❌', text: '不存在' },
      range: { icon: '📏', prefix: '范围: ' },
      even: { icon: '🔢', text: '偶数' },
      odd: { icon: '🔢', text: '奇数' },
      consecutive: { icon: '➡️', text: '与下一位连续' },
      no_consecutive: { icon: '📊', text: '没有连续数字' },
      prime: { icon: '⭐', text: '质数' },
      prime_count: { icon: '🔢', prefix: '质数数量: ' },
      sum_first: { icon: '➕', prefix: '前' },
      sum_last: { icon: '➕', prefix: '后' },
      sum_all: { icon: '➕', text: '总和' },
      product: { icon: '✖️', prefix: '乘积: ' },
      largest: { icon: '🔺', text: '最大数字' },
      smallest: { icon: '🔻', text: '最小数字' },
      compare: { icon: '⚖️', suffix: '' },
      has_ascending: { icon: '📈', text: '有递增序列' },
      has_descending: { icon: '📉', text: '有递减序列' },
      has_fibonacci: { icon: '🔮', text: '有斐波那契数列' },
      average: { icon: '📊', prefix: '平均值: ' },
      unique: { icon: '🎯', prefix: '不同数字: ' },
      max_consecutive: { icon: '🔗', prefix: '最大连续: ' },
      even_count: { icon: '🔢', prefix: '偶数数量: ' },
      odd_count: { icon: '🔢', prefix: '奇数数量: ' },
      digit_sum: { icon: '➕', prefix: '数字之和: ' },
      mean: { icon: '📊', prefix: '平均值: ' },
      variance: { icon: '📉', prefix: '方差: ' },
      _4: { suffix: ' 位' },
      _8: { suffix: ' 位' },
      _all: { suffix: ' 所有位' },
    };

    if (type === 'position' && parts[1] !== undefined) {
      const pos = parseInt(parts[1]) + 1;
      const status = parts[2];
      if (status === 'correct') {
        return { type: 'correct', icon: '✅', text: locale === 'en' ? `Position ${pos}: Correct` : `第 ${pos} 位: 正确` };
      } else if (status === 'exists') {
        return { type: 'exists', icon: '🔄', text: locale === 'en' ? `Position ${pos}: Exists` : `第 ${pos} 位: 存在` };
      }
    }

    if (type === 'range' && parts.length >= 4) {
      const pos = parseInt(parts[1]) + 1;
      const min = parts[2];
      const max = parts[3];
      return { type: 'range', icon: '📏', text: locale === 'en' ? `Position ${pos}: ${min}-${max}` : `第 ${pos} 位: ${min}-${max}` };
    }

    if (type === 'even') {
      const pos = parseInt(parts[1]) + 1;
      return { type: 'parity', icon: '🔢', text: locale === 'en' ? `Position ${pos}: Even` : `第 ${pos} 位: 偶数` };
    }

    if (type === 'odd' && parts.length > 1 && !isNaN(parseInt(parts[1]))) {
      const pos = parseInt(parts[1]) + 1;
      return { type: 'parity', icon: '🔢', text: locale === 'en' ? `Position ${pos}: Odd` : `第 ${pos} 位: 奇数` };
    }

    if (type === 'consecutive' && parts.length > 1) {
      const pos = parseInt(parts[1]) + 1;
      return { type: 'adjacent', icon: '➡️', text: locale === 'en' ? `Position ${pos}: Consecutive` : `第 ${pos} 位: 与下一位连续` };
    }

    if (type === 'prime' && parts.length > 1 && !isNaN(parseInt(parts[1]))) {
      const pos = parseInt(parts[1]) + 1;
      return { type: 'prime', icon: '⭐', text: locale === 'en' ? `Position ${pos}: Prime` : `第 ${pos} 位: 质数` };
    }

    if (type === 'prime_count') {
      return { type: 'prime', icon: '🔢', text: locale === 'en' ? `Prime count: ${parts[1]}` : `质数数量: ${parts[1]}` };
    }

    if (type === 'largest') {
      const pos = parseInt(parts[1]) + 1;
      return { type: 'position', icon: '🔺', text: locale === 'en' ? `Position ${pos}: Largest` : `第 ${pos} 位: 最大` };
    }

    if (type === 'smallest') {
      const pos = parseInt(parts[1]) + 1;
      return { type: 'position', icon: '🔻', text: locale === 'en' ? `Position ${pos}: Smallest` : `第 ${pos} 位: 最小` };
    }

    if (type === 'compare' && parts.length >= 4) {
      const pos1 = parseInt(parts[1]) + 1;
      const pos2 = parseInt(parts[2]) + 1;
      const relation = parts[3];
      if (relation === 'greater') {
        return { type: 'compare', icon: '⚖️', text: locale === 'en' ? `Pos ${pos1} > Pos ${pos2}` : `第 ${pos1} 位 > 第 ${pos2} 位` };
      } else {
        return { type: 'compare', icon: '⚖️', text: locale === 'en' ? `Pos ${pos1} < Pos ${pos2}` : `第 ${pos1} 位 < 第 ${pos2} 位` };
      }
    }

    if (type === 'sum_first' && parts.length > 1) {
      const count = parts[1].replace(/\D/g, '');
      const value = parts[parts.length - 1];
      return { type: 'calc', icon: '➕', text: locale === 'en' ? `Sum of first ${count}: ${value}` : `前 ${count} 位之和: ${value}` };
    }

    if (type === 'sum_last' && parts.length > 1) {
      const count = parts[1].replace(/\D/g, '');
      const value = parts[parts.length - 1];
      return { type: 'calc', icon: '➕', text: locale === 'en' ? `Sum of last ${count}: ${value}` : `后 ${count} 位之和: ${value}` };
    }

    if (type === 'sum_all') {
      const value = parts[parts.length - 1];
      return { type: 'calc', icon: '➕', text: locale === 'en' ? `Total sum: ${value}` : `总和: ${value}` };
    }

    if (type === 'product' && parts.length >= 4) {
      const pos1 = parseInt(parts[2]) + 1;
      const pos2 = parseInt(parts[3]) + 1;
      const value = parts[parts.length - 1];
      return { type: 'calc', icon: '✖️', text: locale === 'en' ? `Pos ${pos1} × Pos ${pos2}: ${value}` : `第 ${pos1} 位 × 第 ${pos2} 位: ${value}` };
    }

    const simpleMap: Record<string, { icon: string; text: string }> = {
      'no_consecutive': { icon: '📊', text: locale === 'en' ? 'No consecutive numbers' : '没有连续数字' },
      'has_ascending': { icon: '📈', text: locale === 'en' ? 'Has ascending sequence' : '有递增序列' },
      'has_descending': { icon: '📉', text: locale === 'en' ? 'Has descending sequence' : '有递减序列' },
      'has_fibonacci': { icon: '🔮', text: locale === 'en' ? 'Has Fibonacci sequence' : '有斐波那契数列' },
    };

    if (simpleMap[hint]) {
      return { type, ...simpleMap[hint] };
    }

    if (type === 'average' || type === 'unique' || type === 'max_consecutive' || 
        type === 'even_count' || type === 'odd_count' || type === 'digit_sum' ||
        type === 'mean' || type === 'variance') {
      const value = parts[parts.length - 1];
      const prefixMap: Record<string, string> = {
        'average': locale === 'en' ? 'Average: ' : '平均值: ',
        'unique': locale === 'en' ? 'Unique digits: ' : '不同数字: ',
        'max_consecutive': locale === 'en' ? 'Max consecutive: ' : '最大连续: ',
        'even_count': locale === 'en' ? 'Even count: ' : '偶数数量: ',
        'odd_count': locale === 'en' ? 'Odd count: ' : '奇数数量: ',
        'digit_sum': locale === 'en' ? 'Digit sum: ' : '数字之和: ',
        'mean': locale === 'en' ? 'Mean: ' : '平均值: ',
        'variance': locale === 'en' ? 'Variance: ' : '方差: ',
      };
      return { type, icon: '📊', text: `${prefixMap[type]}${value}` };
    }

    return { type: 'unknown', icon: '❓', text: hint };
  };

  const groupedHints = hints.reduce((acc, hint) => {
    const translated = translateHint(hint);
    if (!acc[translated.type]) {
      acc[translated.type] = [];
    }
    acc[translated.type].push(translated);
    return acc;
  }, {} as Record<string, { type: string; text: string; icon: string }[]>);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {locale === 'en' ? '💡 Hints' : '💡 提示'}
        </h3>
      </div>
      <div className={styles.content}>
        {hints.length === 0 ? (
          <p className={styles.empty}>
            {locale === 'en' ? 'Submit a guess to see hints...' : '提交猜测以查看提示...'}
          </p>
        ) : (
          <div className={styles.groups}>
            {Object.entries(groupedHints).map(([type, items]) => (
              <div key={type} className={styles.group}>
                {items.map((item, idx) => (
                  <div key={idx} className={styles.hint}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.text}>{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(HintsPanel);
