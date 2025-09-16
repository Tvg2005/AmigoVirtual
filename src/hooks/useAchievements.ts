import { useState, useEffect } from 'react';
import { Achievement, AchievementNotification } from '../types/achievements';

const STORAGE_KEY = 'elizia-achievements';

const defaultAchievements: Achievement[] = [
  // Paciência
  {
    id: 'solitaire-first-win',
    gameType: 'solitaire',
    title: 'Primeira Vitória',
    description: 'Complete seu primeiro jogo de Paciência',
    target: 1,
    type: 'completion',
    icon: '🏆',
    completed: false
  },
  {
    id: 'solitaire-efficient',
    gameType: 'solitaire',
    title: 'Jogador Eficiente',
    description: 'Complete a Paciência em menos de 150 movimentos',
    target: 150,
    type: 'moves',
    icon: '⚡',
    completed: false
  },
  {
    id: 'solitaire-master',
    gameType: 'solitaire',
    title: 'Mestre da Paciência',
    description: 'Complete a Paciência em menos de 100 movimentos',
    target: 100,
    type: 'moves',
    icon: '👑',
    completed: false
  },

  // Sudoku
  {
    id: 'sudoku-first-win',
    gameType: 'sudoku',
    title: 'Primeira Vitória',
    description: 'Complete seu primeiro Sudoku',
    target: 1,
    type: 'completion',
    icon: '🏆',
    completed: false
  },
  {
    id: 'sudoku-few-mistakes',
    gameType: 'sudoku',
    title: 'Quase Perfeito',
    description: 'Complete o Sudoku com menos de 5 erros',
    target: 5,
    type: 'moves',
    icon: '🎯',
    completed: false
  },
  {
    id: 'sudoku-perfect',
    gameType: 'sudoku',
    title: 'Perfeição',
    description: 'Complete o Sudoku sem erros',
    target: 0,
    type: 'moves',
    icon: '💎',
    completed: false
  },

  // Jogo da Memória
  {
    id: 'memory-first-win',
    gameType: 'memory',
    title: 'Primeira Vitória',
    description: 'Complete seu primeiro Jogo da Memória',
    target: 1,
    type: 'completion',
    icon: '🏆',
    completed: false
  },
  {
    id: 'memory-quick',
    gameType: 'memory',
    title: 'Memória Rápida',
    description: 'Complete o Jogo da Memória em menos de 60 segundos',
    target: 60,
    type: 'time',
    icon: '⏰',
    completed: false
  },
  {
    id: 'memory-efficient',
    gameType: 'memory',
    title: 'Memória Eficiente',
    description: 'Complete o Jogo da Memória em menos de 20 movimentos',
    target: 20,
    type: 'moves',
    icon: '🧠',
    completed: false
  },

  // Quebra-Cabeça
  {
    id: 'jigsaw-first-win',
    gameType: 'jigsaw',
    title: 'Primeira Vitória',
    description: 'Complete seu primeiro Quebra-Cabeça',
    target: 1,
    type: 'completion',
    icon: '🏆',
    completed: false
  },
  {
    id: 'jigsaw-3x3-master',
    gameType: 'jigsaw',
    title: 'Mestre 3x3',
    description: 'Complete um quebra-cabeça 3x3 em menos de 30 movimentos',
    target: 30,
    type: 'moves',
    icon: '🧩',
    completed: false
  },
  {
    id: 'jigsaw-4x4-expert',
    gameType: 'jigsaw',
    title: 'Expert 4x4',
    description: 'Complete um quebra-cabeça 4x4 em menos de 80 movimentos',
    target: 80,
    type: 'moves',
    icon: '🎨',
    completed: false
  },
  {
    id: 'jigsaw-5x5-legend',
    gameType: 'jigsaw',
    title: 'Lenda 5x5',
    description: 'Complete um quebra-cabeça 5x5 em menos de 150 movimentos',
    target: 150,
    type: 'moves',
    icon: '🌟',
    completed: false
  },

  // Palavras-Cruzadas
  {
    id: 'crossword-first-win',
    gameType: 'crossword',
    title: 'Primeira Vitória',
    description: 'Complete suas primeiras Palavras-Cruzadas',
    target: 1,
    type: 'completion',
    icon: '🏆',
    completed: false
  },
  {
    id: 'crossword-no-hints',
    gameType: 'crossword',
    title: 'Sem Ajuda',
    description: 'Complete as Palavras-Cruzadas sem usar dicas',
    target: 1,
    type: 'completion',
    icon: '🎓',
    completed: false
  },

  // Piano Virtual
  {
    id: 'music-first-song',
    gameType: 'music',
    title: 'Primeira Melodia',
    description: 'Toque sua primeira música completa',
    target: 1,
    type: 'completion',
    icon: '🎵',
    completed: false
  },
  {
    id: 'music-composer',
    gameType: 'music',
    title: 'Compositor',
    description: 'Crie uma melodia com mais de 20 notas',
    target: 20,
    type: 'moves',
    icon: '🎼',
    completed: false
  },

  // Livro de Colorir
  {
    id: 'coloring-first-art',
    gameType: 'coloring',
    title: 'Primeira Arte',
    description: 'Complete sua primeira obra de arte',
    target: 1,
    type: 'completion',
    icon: '🎨',
    completed: false
  },
  {
    id: 'coloring-artist',
    gameType: 'coloring',
    title: 'Artista Dedicado',
    description: 'Passe mais de 5 minutos colorindo',
    target: 300,
    type: 'time',
    icon: '🖌️',
    completed: false
  }
];

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedAchievements = JSON.parse(stored);
        setAchievements(parsedAchievements);
      } catch {
        setAchievements(defaultAchievements);
      }
    } else {
      setAchievements(defaultAchievements);
    }
  };

  const saveAchievements = (newAchievements: Achievement[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAchievements));
    setAchievements(newAchievements);
  };

  const checkAchievement = (gameType: string, type: 'moves' | 'time' | 'completion', value: number, metadata?: any) => {
    const updatedAchievements = [...achievements];
    let newNotifications: AchievementNotification[] = [];

    updatedAchievements.forEach(achievement => {
      if (achievement.gameType === gameType && achievement.type === type && !achievement.completed) {
        let shouldComplete = false;

        switch (type) {
          case 'moves':
            shouldComplete = value <= achievement.target;
            break;
          case 'time':
            shouldComplete = value <= achievement.target;
            break;
          case 'completion':
            shouldComplete = true;
            break;
        }

        // Special cases for specific achievements with metadata validation
        if (achievement.id === 'crossword-no-hints' && metadata?.usedHints) {
          shouldComplete = false;
        }

        // Jigsaw puzzle specific validation - only complete if correct grid size
        if (achievement.gameType === 'jigsaw' && metadata?.gridSize) {
          if (achievement.id === 'jigsaw-3x3-master' && metadata.gridSize !== 3) {
            shouldComplete = false;
          }
          if (achievement.id === 'jigsaw-4x4-expert' && metadata.gridSize !== 4) {
            shouldComplete = false;
          }
          if (achievement.id === 'jigsaw-5x5-legend' && metadata.gridSize !== 5) {
            shouldComplete = false;
          }
        }

        if (shouldComplete) {
          achievement.completed = true;
          achievement.completedAt = new Date();
          
          newNotifications.push({
            id: `${achievement.id}-${Date.now()}`,
            achievement: { ...achievement },
            timestamp: new Date()
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      saveAchievements(updatedAchievements);
      setNotifications(prev => [...prev, ...newNotifications]);
      
      // Auto-remove notifications after 5 seconds
      newNotifications.forEach(notification => {
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      });
    }
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getAchievementsByGame = (gameType: string) => {
    return achievements.filter(a => a.gameType === gameType);
  };

  const getCompletedAchievements = () => {
    return achievements.filter(a => a.completed);
  };

  const getTotalAchievements = () => {
    return achievements.length;
  };

  const resetAchievements = () => {
    setAchievements(defaultAchievements);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    achievements,
    notifications,
    checkAchievement,
    removeNotification,
    getAchievementsByGame,
    getCompletedAchievements,
    getTotalAchievements,
    resetAchievements
  };
};