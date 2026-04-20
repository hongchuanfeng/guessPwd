export interface LevelConfig {
  id: number;
  name: string;
  digits: number;
  timeLimit: number;
  allowDuplicates: boolean;
  hintTypes: string[];
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    name: 'level1',
    digits: 4,
    timeLimit: 0,
    allowDuplicates: false,
    hintTypes: ['color'],
  },
  {
    id: 2,
    name: 'level2',
    digits: 4,
    timeLimit: 120,
    allowDuplicates: false,
    hintTypes: ['color', 'range'],
  },
  {
    id: 3,
    name: 'level3',
    digits: 5,
    timeLimit: 90,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'parity'],
  },
  {
    id: 4,
    name: 'level4',
    digits: 6,
    timeLimit: 60,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'position'],
  },
  {
    id: 5,
    name: 'level5',
    digits: 6,
    timeLimit: 45,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'adjacent'],
  },
  {
    id: 6,
    name: 'level6',
    digits: 7,
    timeLimit: 40,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'prime'],
  },
  {
    id: 7,
    name: 'level7',
    digits: 8,
    timeLimit: 35,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'calculation'],
  },
  {
    id: 8,
    name: 'level8',
    digits: 8,
    timeLimit: 30,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'sequence'],
  },
  {
    id: 9,
    name: 'level9',
    digits: 9,
    timeLimit: 25,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'advanced'],
  },
  {
    id: 10,
    name: 'level10',
    digits: 10,
    timeLimit: 20,
    allowDuplicates: true,
    hintTypes: ['color', 'range', 'ultimate'],
  },
];

export function generatePassword(level: number): string {
  const config = LEVEL_CONFIGS.find(l => l.id === level);
  if (!config) return '1234';

  let password = '';
  
  if (config.allowDuplicates) {
    for (let i = 0; i < config.digits; i++) {
      password += Math.floor(Math.random() * 10).toString();
    }
  } else {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    password = digits.slice(0, config.digits).join('');
  }

  return password;
}

export interface ValidationResult {
  positions: ('correct' | 'wrong' | 'none')[];
  hints: string[];
}

export function validateGuess(password: string, guess: string, level: number): ValidationResult {
  const positions: ('correct' | 'wrong' | 'none')[] = [];
  const hints: string[] = [];
  const config = LEVEL_CONFIGS.find(l => l.id === level);
  
  if (!config) return { positions: [], hints: [] };

  const passwordArr = password.split('');
  const guessArr = guess.split('');
  const usedPasswordIndices = new Set<number>();
  const usedGuessIndices = new Set<number>();

  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === passwordArr[i]) {
      positions[i] = 'correct';
      usedPasswordIndices.add(i);
      usedGuessIndices.add(i);
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

  hints.push(...generateColorHints(positions));

  if (config.hintTypes.includes('range')) {
    hints.push(...generateRangeHints(password, guess, positions));
  }

  if (config.hintTypes.includes('parity')) {
    hints.push(...generateParityHints(password, positions));
  }

  if (config.hintTypes.includes('position')) {
    hints.push(...generatePositionHints(password, positions));
  }

  if (config.hintTypes.includes('adjacent')) {
    hints.push(...generateAdjacentHints(password));
  }

  if (config.hintTypes.includes('prime')) {
    hints.push(...generatePrimeHints(password, positions));
  }

  if (config.hintTypes.includes('calculation')) {
    hints.push(...generateCalculationHints(password));
  }

  if (config.hintTypes.includes('sequence')) {
    hints.push(...generateSequenceHints(password));
  }

  if (config.hintTypes.includes('advanced')) {
    hints.push(...generateAdvancedHints(password));
  }

  if (config.hintTypes.includes('ultimate')) {
    hints.push(...generateUltimateHints(password));
  }

  return { positions, hints };
}

function generateColorHints(positions: ('correct' | 'wrong' | 'none')[]): string[] {
  const hints: string[] = [];
  for (let i = 0; i < positions.length; i++) {
    if (positions[i] === 'correct') {
      hints.push(`position_${i}_correct`);
    } else if (positions[i] === 'wrong') {
      hints.push(`position_${i}_exists`);
    }
  }
  return hints;
}

function generateRangeHints(password: string, guess: string, positions: ('correct' | 'wrong' | 'none')[]): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('');

  for (let i = 0; i < guess.length; i++) {
    if (positions[i] === 'correct' || positions[i] === 'wrong') {
      const digit = parseInt(passwordArr[i]);
      const ranges = [
        { min: 0, max: 2 },
        { min: 3, max: 4 },
        { min: 5, max: 6 },
        { min: 7, max: 8 },
        { min: 5, max: 9 },
        { min: 0, max: 5 },
      ];
      const range = ranges[Math.floor(Math.random() * ranges.length)];
      hints.push(`range_${i}_${range.min}_${range.max}`);
    }
  }

  return hints;
}

function generateParityHints(password: string, positions: ('correct' | 'wrong' | 'none')[]): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('');

  for (let i = 0; i < passwordArr.length; i++) {
    if (positions[i] === 'correct' || positions[i] === 'wrong') {
      const digit = parseInt(passwordArr[i]);
      if (digit % 2 === 0) {
        hints.push(`even_${i}`);
      } else {
        hints.push(`odd_${i}`);
      }
    }
  }

  return hints;
}

function generatePositionHints(password: string, positions: ('correct' | 'wrong' | 'none')[]): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);

  const maxDigit = Math.max(...passwordArr);
  const minDigit = Math.min(...passwordArr);
  const maxIndex = passwordArr.indexOf(maxDigit);
  const minIndex = passwordArr.indexOf(minDigit);

  if (positions[maxIndex] !== 'none') {
    hints.push(`largest_${maxIndex}`);
  }
  if (positions[minIndex] !== 'none') {
    hints.push(`smallest_${minIndex}`);
  }

  for (let i = 0; i < passwordArr.length - 1; i++) {
    if (positions[i] !== 'none' && positions[i + 1] !== 'none') {
      if (passwordArr[i] > passwordArr[i + 1]) {
        hints.push(`compare_${i}_${i + 1}_greater`);
      } else if (passwordArr[i] < passwordArr[i + 1]) {
        hints.push(`compare_${i}_${i + 1}_less`);
      }
    }
  }

  return hints;
}

function generateAdjacentHints(password: string): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);

  const hasConsecutive = passwordArr.some((digit, i) => {
    if (i === passwordArr.length - 1) return false;
    return Math.abs(digit - passwordArr[i + 1]) === 1;
  });

  if (hasConsecutive) {
    for (let i = 0; i < passwordArr.length - 1; i++) {
      if (Math.abs(passwordArr[i] - passwordArr[i + 1]) === 1) {
        hints.push(`consecutive_${i}`);
        break;
      }
    }
  } else {
    hints.push('no_consecutive');
  }

  return hints;
}

function generatePrimeHints(password: string, positions: ('correct' | 'wrong' | 'none')[]): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);
  const primes = [2, 3, 5, 7];
  let primeCount = 0;

  for (let i = 0; i < passwordArr.length; i++) {
    if (primes.includes(passwordArr[i])) {
      primeCount++;
      if (positions[i] !== 'none') {
        hints.push(`prime_${i}`);
      }
    }
  }

  hints.push(`prime_count_${primeCount}`);

  return hints;
}

function generateCalculationHints(password: string): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);

  const firstHalfSum = passwordArr.slice(0, 4).reduce((a, b) => a + b, 0);
  hints.push(`sum_first_4_${firstHalfSum}`);

  const lastHalfSum = passwordArr.slice(4).reduce((a, b) => a + b, 0);
  hints.push(`sum_last_4_${lastHalfSum}`);

  if (passwordArr[0] !== 0) {
    const product = passwordArr[0] * passwordArr[1];
    hints.push(`product_0_1_${product}`);
  }

  const totalSum = passwordArr.reduce((a, b) => a + b, 0);
  hints.push(`sum_all_${totalSum}`);

  return hints;
}

function generateSequenceHints(password: string): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);

  let hasAscending = false;
  let hasDescending = false;

  for (let i = 0; i < passwordArr.length - 2; i++) {
    if (passwordArr[i + 1] === passwordArr[i] + 1 && passwordArr[i + 2] === passwordArr[i] + 2) {
      hasAscending = true;
      break;
    }
  }

  for (let i = 0; i < passwordArr.length - 2; i++) {
    if (passwordArr[i + 1] === passwordArr[i] - 1 && passwordArr[i + 2] === passwordArr[i] - 2) {
      hasDescending = true;
      break;
    }
  }

  if (hasAscending) hints.push('has_ascending');
  if (hasDescending) hints.push('has_descending');

  const fibonacci = [1, 1, 2, 3, 5, 8];
  for (let i = 0; i < passwordArr.length - 2; i++) {
    if (fibonacci.includes(passwordArr[i]) && 
        fibonacci.includes(passwordArr[i + 1]) && 
        fibonacci.includes(passwordArr[i + 2])) {
      hints.push('has_fibonacci');
      break;
    }
  }

  return hints;
}

function generateAdvancedHints(password: string): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);

  const sum = passwordArr.reduce((a, b) => a + b, 0);
  const avg = (sum / passwordArr.length).toFixed(1);
  hints.push(`average_${avg}`);

  const uniqueDigits = new Set(passwordArr).size;
  hints.push(`unique_${uniqueDigits}`);

  const maxConsecutive = findMaxConsecutive(passwordArr);
  if (maxConsecutive > 1) {
    hints.push(`max_consecutive_${maxConsecutive}`);
  }

  const evenCount = passwordArr.filter(d => d % 2 === 0).length;
  const oddCount = passwordArr.length - evenCount;
  hints.push(`even_count_${evenCount}`);
  hints.push(`odd_count_${oddCount}`);

  return hints;
}

function generateUltimateHints(password: string): string[] {
  const hints: string[] = [];
  const passwordArr = password.split('').map(Number);

  const sum = passwordArr.reduce((a, b) => a + b, 0);
  hints.push(`digit_sum_${sum}`);

  const mean = sum / passwordArr.length;
  hints.push(`mean_${mean.toFixed(1)}`);

  const variance = passwordArr.reduce((acc, d) => acc + Math.pow(d - mean, 2), 0) / passwordArr.length;
  hints.push(`variance_${variance.toFixed(1)}`);

  const sorted = [...passwordArr].sort((a, b) => a - b);
  const range = sorted[sorted.length - 1] - sorted[0];
  hints.push(`range_${range}`);

  return hints;
}

function findMaxConsecutive(arr: number[]): number {
  let max = 1;
  let current = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1] + 1 || arr[i] === arr[i - 1] - 1) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 1;
    }
  }
  return max;
}

export function isPasswordCorrect(password: string, guess: string): boolean {
  return password === guess;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
