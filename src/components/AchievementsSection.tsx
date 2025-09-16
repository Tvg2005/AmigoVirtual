import React, { useState } from 'react';
import { Trophy, Star, Clock, Target, CheckCircle, Lock } from 'lucide-react';
import { useAchievements } from '../hooks/useAchievements';

const AchievementsSection: React.FC = () => {
  const { achievements, getCompletedAchievements, getTotalAchievements } = useAchievements();
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [isMinimized, setIsMinimized] = useState(false);

  const gameTypes = [
    { id: 'all', name: 'Todos os Jogos', icon: Trophy },
    { id: 'solitaire', name: 'Paciência', icon: Star },
    { id: 'sudoku', name: 'Sudoku', icon: Target },
    { id: 'memory', name: 'Memória', icon: Clock },
    { id: 'jigsaw', name: 'Quebra-Cabeça', icon: Star },
    { id: 'crossword', name: 'Palavras-Cruzadas', icon: Target },
    { id: 'music', name: 'Piano', icon: Star },
    { id: 'coloring', name: 'Colorir', icon: Star }
  ];

  const filteredAchievements = selectedGame === 'all' 
    ? achievements 
    : achievements.filter(a => a.gameType === selectedGame);

  const completedCount = getCompletedAchievements().length;
  const totalCount = getTotalAchievements();
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'moves': return Target;
      case 'time': return Clock;
      case 'completion': return Trophy;
      case 'streak': return Star;
      default: return Trophy;
    }
  };

  const formatTarget = (achievement: any) => {
    switch (achievement.type) {
      case 'moves':
        return `${achievement.target} movimentos`;
      case 'time':
        const minutes = Math.floor(achievement.target / 60);
        const seconds = achievement.target % 60;
        return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      case 'completion':
        return 'Completar';
      default:
        return achievement.target.toString();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-500 text-white p-3 rounded-xl">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Conquistas</h2>
            <p className="text-blue-600">
              {completedCount} de {totalCount} conquistadas ({completionPercentage}%)
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 rounded-full p-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-blue-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${completionPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blue-800 font-bold text-sm">{completionPercentage}%</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
            title={isMinimized ? 'Expandir conquistas' : 'Minimizar conquistas'}
          >
            {isMinimized ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Game Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {gameTypes.map((game) => {
              const IconComponent = game.icon;
              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedGame === game.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{game.name}</span>
                </button>
              );
            })}
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredAchievements.map((achievement) => {
              const TypeIcon = getTypeIcon(achievement.type);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.completed
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex items-center space-x-1">
                        <TypeIcon className="w-4 h-4 text-blue-500" />
                        {achievement.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h4 className={`font-bold text-sm mb-1 ${
                    achievement.completed ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {achievement.title}
                  </h4>
                  
                  <p className={`text-xs mb-2 ${
                    achievement.completed ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={achievement.completed ? 'text-green-600' : 'text-gray-500'}>
                      Meta: {formatTarget(achievement)}
                    </span>
                    {achievement.completed && achievement.completedAt && (
                      <span className="text-green-500 font-medium">
                        {new Date(achievement.completedAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma conquista encontrada para este jogo.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AchievementsSection;