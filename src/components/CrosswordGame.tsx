import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Lightbulb, Check } from 'lucide-react';
import { CrosswordGenerator, CrosswordClue, CrosswordCell } from '../utils/crosswordGenerator';

interface CrosswordGameProps {
  onBack: () => void;
  onAchievement: (gameType: string, type: 'moves' | 'time' | 'completion', value: number, metadata?: any) => void;
}

const CrosswordGame: React.FC<CrosswordGameProps> = ({ onBack, onAchievement }) => {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [gameWon, setGameWon] = useState(false);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [usedHints, setUsedHints] = useState(false);
  const [gridSize, setGridSize] = useState(15);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    checkCompletedWords();
  }, [grid]);

  const initializeGrid = () => {
    const generator = new CrosswordGenerator();
    const { grid: newGrid, clues: newClues } = generator.generateCrossword();
    
    setGrid(newGrid);
    setClues(newClues);
    setGridSize(newGrid.length);
    setGameWon(false);
    setCompletedWords([]);
    setUsedHints(false);
    setHintsRemaining(3);
    setSelectedCell(null);
  };

  const checkCompletedWords = () => {
    if (!grid.length || !grid[0] || !grid[0].length) {
      return;
    }
    
    const completed: number[] = [];
    const newGrid = [...grid];
    
    clues.forEach(clue => {
      const { startRow, startCol, answer, direction, number } = clue;
      let isComplete = true;
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        
        if (row < gridSize && col < gridSize && grid[row] && grid[row][col]) {
          if (grid[row][col].userInput.toUpperCase() !== answer[i]) {
            isComplete = false;
            break;
          }
        }
      }
      
      if (isComplete && !completedWords.includes(number)) {
        completed.push(number);
        
        // Lock the cells of completed words
        for (let i = 0; i < answer.length; i++) {
          const row = direction === 'across' ? startRow : startRow + i;
          const col = direction === 'across' ? startCol + i : startCol;
          
          if (row < gridSize && col < gridSize && newGrid[row] && newGrid[row][col]) {
            newGrid[row][col].isLocked = true;
          }
        }
      }
    });
    
    if (completed.length > 0) {
      setGrid(newGrid);
    }
    
    const allCompleted = [...completedWords, ...completed];
    setCompletedWords(allCompleted);
    
    // Check if all words are completed
    if (allCompleted.length === clues.length) {
      setGameWon(true);
      onAchievement('crossword', 'completion', 1, { usedHints });
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack || grid[row][col].isLocked) return;
    
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setSelectedDirection(selectedDirection === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    if (grid[row][col].isLocked) return;
    
    if (e.key.match(/[a-zA-Z]/)) {
      const newGrid = [...grid];
      newGrid[row][col].userInput = e.key.toUpperCase();
      setGrid(newGrid);
      
      moveToNextCell();
    } else if (e.key === 'Backspace') {
      const newGrid = [...grid];
      newGrid[row][col].userInput = '';
      setGrid(newGrid);
      
      moveToPreviousCell();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || 
               e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      handleArrowKey(e.key);
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let nextRow = row;
    let nextCol = col;
    
    if (selectedDirection === 'across') {
      nextCol = col + 1;
    } else {
      nextRow = row + 1;
    }
    
    if (nextRow < gridSize && nextCol < gridSize && 
        !grid[nextRow][nextCol].isBlack && !grid[nextRow][nextCol].isLocked) {
      setSelectedCell({ row: nextRow, col: nextCol });
    }
  };

  const moveToPreviousCell = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let prevRow = row;
    let prevCol = col;
    
    if (selectedDirection === 'across') {
      prevCol = col - 1;
    } else {
      prevRow = row - 1;
    }
    
    if (prevRow >= 0 && prevCol >= 0 && 
        !grid[prevRow][prevCol].isBlack && !grid[prevRow][prevCol].isLocked) {
      setSelectedCell({ row: prevRow, col: prevCol });
    }
  };

  const handleArrowKey = (key: string) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;
    
    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(gridSize - 1, row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(gridSize - 1, col + 1);
        break;
    }
    
    if (!grid[newRow][newCol].isBlack && !grid[newRow][newCol].isLocked) {
      setSelectedCell({ row: newRow, col: newCol });
    }
  };

  const getCellClass = (row: number, col: number) => {
    const cell = grid[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    
    if (cell.isBlack) {
      return "bg-gray-800 border border-gray-600 flex items-center justify-center relative";
    }
    
    let className = "border border-gray-400 flex items-center justify-center font-bold relative ";
    
    if (cell.isLocked) {
      className += "bg-green-100 border-green-400 cursor-not-allowed ";
    } else if (isSelected) {
      className += "bg-blue-200 border-blue-500 cursor-pointer ";
    } else {
      className += "bg-white hover:bg-blue-50 cursor-pointer ";
    }
    
    return className;
  };

  const showHint = (clueNumber: number) => {
    const clue = clues.find(c => c.number === clueNumber);
    if (!clue || hintsRemaining <= 0 || completedWords.includes(clueNumber)) return;
    
    setUsedHints(true);
    setHintsRemaining(hintsRemaining - 1);
    
    const { startRow, startCol, answer, direction } = clue;
    const newGrid = [...grid];
    
    // Find the first empty cell in this word
    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      if (row < gridSize && col < gridSize && grid[row] && grid[row][col] && 
          !grid[row][col].userInput && !grid[row][col].isLocked) {
        newGrid[row][col].userInput = answer[i];
        break;
      }
    }
    
    setGrid(newGrid);
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg border border-blue-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800">Palavras-Cruzadas</h2>
          <p className="text-blue-600">
            Palavras completas: {completedWords.length}/{clues.length} | Dicas restantes: {hintsRemaining}
          </p>
        </div>

        <button
          onClick={initializeGrid}
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
          <p className="text-green-700">Você completou todas as palavras-cruzadas!</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex justify-center mb-4">
            <div 
              className="grid gap-0 border-2 border-gray-600"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: 'min(600px, 90vw)',
                height: 'min(600px, 90vw)'
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex)}
                    style={{
                      width: `${Math.min(600, window.innerWidth * 0.9) / gridSize}px`,
                      height: `${Math.min(600, window.innerWidth * 0.9) / gridSize}px`,
                      fontSize: `${Math.max(8, Math.min(600, window.innerWidth * 0.9) / gridSize / 3)}px`
                    }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.number && (
                      <span 
                        className="absolute top-0 left-0 text-blue-600 font-bold"
                        style={{ fontSize: `${Math.max(6, Math.min(600, window.innerWidth * 0.9) / gridSize / 4)}px` }}
                      >
                        {cell.number}
                      </span>
                    )}
                    <span className="text-center">
                      {cell.userInput}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-blue-600">
            <p>Direção atual: <strong>{selectedDirection === 'across' ? 'Horizontal' : 'Vertical'}</strong></p>
            <p className="mt-1">Use as setas do teclado para navegar • Digite letras para preencher</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Dicas</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Horizontais:</h4>
              <div className="space-y-2">
                {clues.filter(clue => clue.direction === 'across').map(clue => (
                  <div key={clue.number} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completedWords.includes(clue.number) && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-medium text-blue-800">{clue.number}.</span>
                      <span className="text-blue-700">{clue.clue}</span>
                    </div>
                    <button
                      onClick={() => showHint(clue.number)}
                      disabled={hintsRemaining <= 0 || completedWords.includes(clue.number)}
                      className="text-xs bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 disabled:text-gray-400 text-yellow-800 px-2 py-1 rounded transition-colors flex items-center space-x-1"
                    >
                      <Lightbulb className="w-3 h-3" />
                      <span>Dica</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Verticais:</h4>
              <div className="space-y-2">
                {clues.filter(clue => clue.direction === 'down').map(clue => (
                  <div key={clue.number} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completedWords.includes(clue.number) && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-medium text-blue-800">{clue.number}.</span>
                      <span className="text-blue-700">{clue.clue}</span>
                    </div>
                    <button
                      onClick={() => showHint(clue.number)}
                      disabled={hintsRemaining <= 0 || completedWords.includes(clue.number)}
                      className="text-xs bg-yellow-100 hover:bg-yellow-200 disabled:bg-gray-100 disabled:text-gray-400 text-yellow-800 px-2 py-1 rounded transition-colors flex items-center space-x-1"
                    >
                      <Lightbulb className="w-3 h-3" />
                      <span>Dica</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Clique em uma célula para selecioná-la</li>
          <li>• Digite letras para preencher as palavras</li>
          <li>• Use as setas do teclado para navegar</li>
          <li>• Clique na mesma célula para alternar entre horizontal e vertical</li>
          <li>• Use as dicas (máximo 3 por jogo) para revelar a primeira letra de uma palavra</li>
          <li>• Palavras completadas ficam travadas em verde</li>
        </ul>
      </div>
    </div>
  );
};

export default CrosswordGame;