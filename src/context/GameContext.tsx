'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameData {
  unlockedLevels: number[];
  completedLevels: number[];
  bestTimes: Record<number, number>;
  bestAttempts: Record<number, number>;
  totalGames: number;
  totalWins: number;
}

interface GameContextType {
  gameData: GameData;
  updateGameData: (data: Partial<GameData>) => void;
  completeLevel: (level: number, time: number, attempts: number) => void;
  resetProgress: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  isMounted: boolean;
}

const defaultGameData: GameData = {
  unlockedLevels: [1],
  completedLevels: [],
  bestTimes: {},
  bestAttempts: {},
  totalGames: 0,
  totalWins: 0,
};

const GameContext = createContext<GameContextType>({
  gameData: defaultGameData,
  updateGameData: () => {},
  completeLevel: () => {},
  resetProgress: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  musicEnabled: false,
  setMusicEnabled: () => {},
  isMounted: false,
});

const STORAGE_KEY = 'password_game_data';
const SOUND_KEY = 'password_game_sound';
const MUSIC_KEY = 'password_game_music';

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameData, setGameData] = useState<GameData>(defaultGameData);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGameData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse game data');
      }
    }
    const savedSound = localStorage.getItem(SOUND_KEY);
    const savedMusic = localStorage.getItem(MUSIC_KEY);
    if (savedSound !== null) {
      setSoundEnabled(savedSound !== 'false');
    }
    if (savedMusic !== null) {
      setMusicEnabled(savedMusic === 'true');
    }
  }, []);

  const saveGameData = (data: GameData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    setGameData(data);
  };

  const updateGameData = (data: Partial<GameData>) => {
    const newData = { ...gameData, ...data };
    saveGameData(newData);
  };

  const completeLevel = (level: number, time: number, attempts: number) => {
    const newData = { ...gameData };
    newData.totalGames++;
    newData.totalWins++;

    if (!newData.completedLevels.includes(level)) {
      newData.completedLevels.push(level);
    }

    if (!newData.bestTimes[level] || time < newData.bestTimes[level]) {
      newData.bestTimes[level] = time;
    }

    if (!newData.bestAttempts[level] || attempts < newData.bestAttempts[level]) {
      newData.bestAttempts[level] = attempts;
    }

    // 基础版关卡解锁（1-10）
    if (level >= 1 && level < 10 && !newData.unlockedLevels.includes(level + 1)) {
      newData.unlockedLevels.push(level + 1);
    }

    // 推理版关卡解锁（99-104 对应 3-8位，105 对应9位）
    if (level >= 99 && level < 105 && !newData.unlockedLevels.includes(level + 1)) {
      newData.unlockedLevels.push(level + 1);
    }

    saveGameData(newData);
  };

  const resetProgress = () => {
    saveGameData(defaultGameData);
  };

  const handleSetSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SOUND_KEY, enabled.toString());
    }
  };

  const handleSetMusic = (enabled: boolean) => {
    setMusicEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MUSIC_KEY, enabled.toString());
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameData,
        updateGameData,
        completeLevel,
        resetProgress,
        soundEnabled,
        setSoundEnabled: handleSetSound,
        musicEnabled,
        setMusicEnabled: handleSetMusic,
        isMounted: mounted,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
