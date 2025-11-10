import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Shuffle } from 'lucide-react';

interface Piece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  image: string;
}

interface JigsawGameProps {
  onBack: () => void;
  onAchievement: (gameType: string, type: 'moves' | 'time' | 'completion', value: number, metadata?: any) => void;
}

const JigsawGame: React.FC<JigsawGameProps> = ({ onBack, onAchievement }) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [currentImage, setCurrentImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const gridOptions = [
    { size: 3, label: '3x3', pieces: 9 },
    { size: 4, label: '4x4', pieces: 16 },
    { size: 5, label: '5x5', pieces: 25 }
  ];

  // Array of safe, family-friendly image categories
  const imageCategories = [
    'nature',
    'landscape',
    'flowers',
    'animals',
    'food',
    'architecture',
    'art',
    'abstract',
    'patterns',
    'colors'
  ];

  useEffect(() => {
    initializePuzzle();
  }, [gridSize]);

  const getRandomImage = async (): Promise<string> => {
    setIsLoading(true);
    try {
      // Using Picsum Photos for random, safe images
      const randomId = Math.floor(Math.random() * 1000) + 1;
      const imageUrl = `https://picsum.photos/400/400?random=${randomId}`;
      
      // Test if the image loads
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          resolve(imageUrl);
        };
        img.onerror = () => {
          // Fallback to a different random image
          const fallbackId = Math.floor(Math.random() * 1000) + 1001;
          resolve(`https://picsum.photos/400/400?random=${fallbackId}`);
        };
        img.src = imageUrl;
      });
    } catch (error) {
      // Ultimate fallback - use a solid color pattern
      const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return `https://via.placeholder.com/400x400/${randomColor}/FFFFFF?text=Puzzle`;
    } finally {
      setIsLoading(false);
    }
  };

  const initializePuzzle = async () => {
    setIsLoading(true);
    const imageUrl = await getRandomImage();
    setCurrentImage(imageUrl);
    
    const newPieces: Piece[] = [];
    const totalPieces = gridSize * gridSize;
    
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        image: imageUrl
      });
    }

    // Shuffle pieces
    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempPosition = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = tempPosition;
    }

    setPieces(shuffled);
    setSelectedPiece(null);
    setGameWon(false);
    setMoves(0);
    setIsLoading(false);
  };

  const handlePieceClick = (pieceId: number) => {
    if (isLoading) return;
    
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      // Swap pieces
      const newPieces = [...pieces];
      const piece1 = newPieces.find(p => p.id === selectedPiece);
      const piece2 = newPieces.find(p => p.id === pieceId);

      if (piece1 && piece2) {
        const tempPosition = piece1.currentPosition;
        piece1.currentPosition = piece2.currentPosition;
        piece2.currentPosition = tempPosition;
      }

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);

      // Check if puzzle is solved
      const isSolved = newPieces.every(piece => piece.correctPosition === piece.currentPosition);
      if (isSolved) {
        setGameWon(true);
        // Check achievements
        onAchievement('jigsaw', 'completion', 1);
        onAchievement('jigsaw', 'moves', moves + 1, { gridSize });
      }
    }
  };

  const getPieceStyle = (piece: Piece) => {
    const row = Math.floor(piece.correctPosition / gridSize);
    const col = piece.correctPosition % gridSize;
    
    return {
      backgroundImage: `url(${piece.image})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `-${col * 100}% -${row * 100}%`,
    };
  };

  const getPieceByPosition = (position: number) => {
    return pieces.find(piece => piece.currentPosition === position);
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
  };

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
          <h2 className="text-2xl font-bold text-blue-800">Quebra-Cabeça</h2>
          <p className="text-blue-600">
            {isLoading ? 'Carregando...' : `${gridSize}x${gridSize} - Movimentos: ${moves}`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={initializePuzzle}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            <span>Nova Imagem</span>
          </button>
          <button
            onClick={initializePuzzle}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {gridOptions.map((option) => (
          <button
            key={option.size}
            onClick={() => handleGridSizeChange(option.size)}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors text-lg ${
              gridSize === option.size
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 disabled:bg-gray-100'
            }`}
          >
            {option.label}
            <div className="text-sm opacity-75">{option.pieces} peças</div>
          </button>
        ))}
      </div>

      {gameWon && (
        <div className="bg-green-100 border border-green-400 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">Parabéns!</h3>
          <p className="text-green-700">
            Você completou o quebra-cabeça {gridSize}x{gridSize} em {moves} movimentos!
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          {isLoading ? (
            <div className="flex items-center justify-center w-96 h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-blue-600 text-lg">Carregando nova imagem...</p>
              </div>
            </div>
          ) : (
            <div 
              className={`grid gap-2`}
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: '400px',
                height: '400px'
              }}
            >
              {Array.from({ length: gridSize * gridSize }, (_, position) => {
                const piece = getPieceByPosition(position);
                if (!piece) return null;

                return (
                  <div
                    key={position}
                    className={`w-full h-full border-2 cursor-pointer transition-all hover:scale-105 ${
                      selectedPiece === piece.id
                        ? 'border-yellow-400 shadow-lg'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    style={getPieceStyle(piece)}
                    onClick={() => handlePieceClick(piece.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview of complete image */}
      {currentImage && !isLoading && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
            <h3 className="text-lg font-bold text-blue-800 mb-3 text-center">Imagem Completa:</h3>
            <img 
              src={currentImage} 
              alt="Imagem completa do quebra-cabeça"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Escolha o tamanho do quebra-cabeça: 3x3, 4x4 ou 5x5</li>
          <li>• Clique em uma peça para selecioná-la (ficará destacada)</li>
          <li>• Clique em outra peça para trocar as posições</li>
          <li>• Monte a imagem colocando cada peça no lugar correto</li>
          <li>• Use "Nova Imagem" para buscar uma imagem diferente da internet</li>
          <li>• Use a imagem pequena como referência para montar o quebra-cabeça</li>
        </ul>
      </div>
    </div>
  );
};

export default JigsawGame;