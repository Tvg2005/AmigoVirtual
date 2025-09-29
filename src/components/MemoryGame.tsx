import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Clock, Star } from 'lucide-react';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';
interface MemoryGameProps {
  onBack: () => void;
  onAchievement: (gameType: string, type: 'moves' | 'time' | 'completion', value: number, metadata?: any) => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onAchievement }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const allSymbols = [
    '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🍀', '🌿',
    '🦋', '🐝', '🐞', '🦜', '🐰', '🐱', '🐶', '🐸',
    '🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🥝', '🍑',
    '⭐', '🌟', '✨', '💫', '🌙', '☀️', '🌈', '⚡',
    '🎵', '🎶', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸'
  ];

  const getDifficultySettings = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return { gridSize: 4, pairs: 8, cols: 4 };
      case 'medium':
        return { gridSize: 5, pairs: 12, cols: 6 };
      case 'hard':
        return { gridSize: 6, pairs: 18, cols: 6 };
      default:
        return { gridSize: 4, pairs: 8, cols: 4 };
    }
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const initializeGame = () => {
    const { pairs } = getDifficultySettings(difficulty);
    const selectedSymbols = allSymbols.slice(0, pairs);
    
    const gameCards: Card[] = [];
    selectedSymbols.forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          ));
          setFlippedCards([]);
          setMatches(matches + 1);

          if (matches + 1 === selectedSymbols.length) {
            setGameWon(true);
            // Check achievements
            onAchievement('memory', 'completion', 1, { difficulty });
            onAchievement('memory', 'time', timeElapsed);
            onAchievement('memory', 'moves', moves + 1);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const { cols } = getDifficultySettings(difficulty);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg border border-blue-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800">Jogo da Memória</h2>
          <div className="flex items-center justify-center space-x-4 text-blue-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Movimentos: {moves}</span>
            </div>
            <div>Pares: {matches}/{symbols.length}</div>
            <div>Pares: {matches}/{getDifficultySettings(difficulty).pairs}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg border border-blue-300"
          >
            <option value="easy">Fácil (4x4)</option>
            <option value="medium">Médio (6x4)</option>
            <option value="hard">Difícil (6x6)</option>
          </select>
        </div>

        <button
          onClick={initializeGame}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Novo Jogo</span>
        </button>
      </div>

      {gameWon && (
        <div className="bg-green-100 border border-green-400 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Parabéns!</h3>
          <p className="text-green-700">
            Você completou o jogo em {moves} movimentos e {formatTime(timeElapsed)}!
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 transform ${
                  card.isFlipped || card.isMatched
                    ? card.isMatched
                      ? 'bg-green-200 border-2 border-green-400 scale-105'
                      : 'bg-blue-100 border-2 border-blue-400'
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 shadow-lg'
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? (
                  card.symbol
                ) : (
                  <div className="text-white text-xl">?</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Clique nas cartas para virá-las</li>
          <li>• Encontre os pares de símbolos iguais</li>
          <li>• Escolha a dificuldade: Fácil (4x4), Médio (6x4) ou Difícil (6x6)</li>
          <li>• Quando encontrar um par, as cartas permanecerão viradas</li>
          <li>• Objetivo: Encontrar todos os pares no menor número de movimentos</li>
        </ul>
      </div>
    </div>
  );
};

export default MemoryGame;