import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  color: 'red' | 'black';
  faceUp: boolean;
}

interface SolitaireGameProps {
  onBack: () => void;
  onAchievement: (gameType: string, type: 'moves' | 'time' | 'completion', value: number, metadata?: any) => void;
}

const SolitaireGame: React.FC<SolitaireGameProps> = ({ onBack, onAchievement }) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [selectedCard, setSelectedCard] = useState<{pile: string, index: number} | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [draggedCard, setDraggedCard] = useState<{pile: string, index: number} | null>(null);

  const suits = ['♠', '♥', '♦', '♣'] as const;
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({
          suit,
          rank,
          color: suit === '♥' || suit === '♦' ? 'red' : 'black',
          faceUp: false
        });
      });
    });
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const newDeck = createDeck();
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let deckIndex = 0;

    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = newDeck[deckIndex++];
        card.faceUp = row === col;
        newTableau[col].push(card);
      }
    }

    const remainingDeck = newDeck.slice(deckIndex);

    setTableau(newTableau);
    setDeck(remainingDeck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setSelectedCard(null);
    setMoves(0);
    setGameWon(false);
    setDraggedCard(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const drawCard = () => {
    if (deck.length === 0) {
      setDeck([...waste].reverse().map(card => ({ ...card, faceUp: false })));
      setWaste([]);
    } else {
      const card = deck[0];
      card.faceUp = true;
      setWaste([card, ...waste]);
      setDeck(deck.slice(1));
    }
    setMoves(moves + 1);
  };

  const canMoveToFoundation = (card: Card, foundationIndex: number): boolean => {
    const foundation = foundations[foundationIndex];
    if (foundation.length === 0) {
      return card.rank === 'A';
    }
    const topCard = foundation[foundation.length - 1];
    if (card.suit !== topCard.suit) return false;
    
    const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return rankOrder.indexOf(card.rank) === rankOrder.indexOf(topCard.rank) + 1;
  };

  const canMoveToTableau = (card: Card, tableauIndex: number): boolean => {
    const tableauPile = tableau[tableauIndex];
    if (tableauPile.length === 0) {
      return card.rank === 'K';
    }
    const topCard = tableauPile[tableauPile.length - 1];
    if (!topCard.faceUp) return false;
    if (card.color === topCard.color) return false;
    
    const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return rankOrder.indexOf(card.rank) === rankOrder.indexOf(topCard.rank) - 1;
  };

  const moveToFoundation = (card: Card, foundationIndex: number, sourcePile: string, sourceIndex: number) => {
    if (!canMoveToFoundation(card, foundationIndex)) return;

    const newFoundations = [...foundations];
    newFoundations[foundationIndex] = [...newFoundations[foundationIndex], card];

    if (sourcePile === 'waste') {
      setWaste(waste.slice(1));
    } else if (sourcePile.startsWith('tableau-')) {
      const tableauIndex = parseInt(sourcePile.split('-')[1]);
      const newTableau = [...tableau];
      newTableau[tableauIndex] = newTableau[tableauIndex].slice(0, -1);
      
      if (newTableau[tableauIndex].length > 0) {
        newTableau[tableauIndex][newTableau[tableauIndex].length - 1].faceUp = true;
      }
      setTableau(newTableau);
    }

    setFoundations(newFoundations);
    setMoves(moves + 1);
    setSelectedCard(null);

    const allFoundationsFull = newFoundations.every(f => f.length === 13);
    if (allFoundationsFull) {
      setGameWon(true);
      onAchievement('solitaire', 'completion', 1);
      onAchievement('solitaire', 'moves', moves + 1);
    }
  };

  const moveToTableau = (cardIndex: number, sourcePile: string, targetTableauIndex: number) => {
    const sourceTableauIndex = sourcePile.startsWith('tableau-') 
      ? parseInt(sourcePile.split('-')[1]) 
      : -1;

    let cardsToMove: Card[] = [];
    let sourceCard: Card | null = null;

    if (sourcePile === 'waste') {
      sourceCard = waste[0];
      if (!canMoveToTableau(sourceCard, targetTableauIndex)) return;
      cardsToMove = [sourceCard];
    } else if (sourceTableauIndex >= 0) {
      const sourcePileCards = tableau[sourceTableauIndex];
      sourceCard = sourcePileCards[cardIndex];
      if (!sourceCard.faceUp || !canMoveToTableau(sourceCard, targetTableauIndex)) return;
      cardsToMove = sourcePileCards.slice(cardIndex);
    } else {
      return;
    }

    const newTableau = [...tableau];

    if (sourcePile === 'waste') {
      setWaste(waste.slice(1));
    } else if (sourceTableauIndex >= 0) {
      newTableau[sourceTableauIndex] = newTableau[sourceTableauIndex].slice(0, cardIndex);
      
      if (newTableau[sourceTableauIndex].length > 0) {
        newTableau[sourceTableauIndex][newTableau[sourceTableauIndex].length - 1].faceUp = true;
      }
    }

    newTableau[targetTableauIndex] = [...newTableau[targetTableauIndex], ...cardsToMove];

    setTableau(newTableau);
    setMoves(moves + 1);
    setSelectedCard(null);
  };

  const handleCardClick = (pile: string, index: number) => {
    if (selectedCard) {
      if (pile.startsWith('foundation-')) {
        const foundationIndex = parseInt(pile.split('-')[1]);
        let card: Card | null = null;

        if (selectedCard.pile === 'waste') {
          card = waste[0];
        } else if (selectedCard.pile.startsWith('tableau-')) {
          const tableauIndex = parseInt(selectedCard.pile.split('-')[1]);
          card = tableau[tableauIndex][selectedCard.index];
        }

        if (card) {
          moveToFoundation(card, foundationIndex, selectedCard.pile, selectedCard.index);
        }
      } else if (pile.startsWith('tableau-')) {
        const tableauIndex = parseInt(pile.split('-')[1]);
        moveToTableau(selectedCard.index, selectedCard.pile, tableauIndex);
      }
    } else {
      setSelectedCard({ pile, index });
    }
  };

  const handleDragStart = (e: React.DragEvent, pile: string, index: number) => {
    // Só permitir arrastar cartas viradas para cima
    if (pile.startsWith('tableau-')) {
      const tableauIndex = parseInt(pile.split('-')[1]);
      const card = tableau[tableauIndex][index];
      if (!card.faceUp) return;
    }
    
    setDraggedCard({ pile, index });
    e.dataTransfer.effectAllowed = 'move';
    
    // Criar uma imagem de arrasto customizada se estiver arrastando múltiplas cartas
    if (pile.startsWith('tableau-')) {
      const tableauIndex = parseInt(pile.split('-')[1]);
      const cardsToMove = tableau[tableauIndex].slice(index);
      if (cardsToMove.length > 1) {
        const dragImage = document.createElement('div');
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.innerHTML = `<div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 8px; font-weight: bold; color: #1e40af;">${cardsToMove.length} cartas</div>`;
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 30, 30);
        setTimeout(() => document.body.removeChild(dragImage), 0);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnFoundation = (e: React.DragEvent, foundationIndex: number) => {
    e.preventDefault();
    if (!draggedCard) return;

    let card: Card | null = null;
    if (draggedCard.pile === 'waste' && waste.length > 0) {
      card = waste[0];
    } else if (draggedCard.pile.startsWith('tableau-')) {
      const tableauIndex = parseInt(draggedCard.pile.split('-')[1]);
      card = tableau[tableauIndex][draggedCard.index];
    }

    if (card) {
      moveToFoundation(card, foundationIndex, draggedCard.pile, draggedCard.index);
    }
    setDraggedCard(null);
  };

  const handleDropOnTableau = (e: React.DragEvent, tableauIndex: number) => {
    e.preventDefault();
    if (!draggedCard) return;

    moveToTableau(draggedCard.index, draggedCard.pile, tableauIndex);
    setDraggedCard(null);
  };

  const renderCard = (card: Card, index: number, pile: string, allowDrag: boolean = true) => {
    if (!card.faceUp) {
      return (
        <div
          key={index}
          className="w-16 h-20 bg-blue-800 border-2 border-blue-900 rounded-lg flex items-center justify-center transition-colors"
        >
          <div className="w-8 h-8 bg-blue-600 rounded"></div>
        </div>
      );
    }

    const isSelected = selectedCard?.pile === pile && selectedCard?.index === index;
    const isDragging = draggedCard?.pile === pile && draggedCard?.index === index;
    
    // Verificar se esta carta faz parte de uma sequência sendo arrastada
    let isDraggingSequence = false;
    if (draggedCard && pile.startsWith('tableau-') && draggedCard.pile === pile) {
      const tableauIndex = parseInt(pile.split('-')[1]);
      isDraggingSequence = index >= draggedCard.index;
    }

    return (
      <div
        key={index}
        draggable={allowDrag && card.faceUp}
        onDragStart={(e) => allowDrag && card.faceUp && handleDragStart(e, pile, index)}
        onDragEnd={() => setDraggedCard(null)}
        className={`w-16 h-20 bg-white border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
          allowDrag && card.faceUp ? 'cursor-move' : 'cursor-pointer'
        } ${
          isDraggingSequence ? 'opacity-50' : ''
        } ${
          isSelected ? 'border-yellow-400 shadow-lg transform -translate-y-1' : 'border-gray-300 hover:border-blue-400'
        } ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}
        onClick={() => allowDrag && handleCardClick(pile, index)}
      >
        <div className="text-xs font-bold">{card.rank}</div>
        <div className="text-lg">{card.suit}</div>
      </div>
    );
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
          <h2 className="text-2xl font-bold text-blue-800">Paciência</h2>
          <p className="text-blue-600">Movimentos: {moves}</p>
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
          <p className="text-green-700">Você ganhou em {moves} movimentos!</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="grid grid-cols-7 gap-4 mb-8">
          <div className="space-y-2">
            <div
              className="w-16 h-20 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
              onClick={drawCard}
            >
              {deck.length > 0 ? (
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
              ) : (
                <div className="text-blue-600 text-xs text-center">Clique para virar</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {waste.length > 0 && renderCard(waste[0], 0, 'waste')}
          </div>

          <div></div>

          {foundations.map((foundation, index) => (
            <div 
              key={index} 
              className="space-y-2"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnFoundation(e, index)}
            >
              <div 
                className="w-16 h-20 bg-green-50 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-100 transition-colors relative"
                onClick={() => {
                  if (selectedCard) {
                    let card: Card | null = null;
                    if (selectedCard.pile === 'waste' && waste.length > 0) {
                      card = waste[0];
                    } else if (selectedCard.pile.startsWith('tableau-')) {
                      const tableauIndex = parseInt(selectedCard.pile.split('-')[1]);
                      card = tableau[tableauIndex][selectedCard.index];
                    }
                    if (card) {
                      moveToFoundation(card, index, selectedCard.pile, selectedCard.index);
                    }
                  }
                }}
              >
                {foundation.length > 0 ? (
                  <div className="pointer-events-none">
                    {renderCard(foundation[foundation.length - 1], foundation.length - 1, `foundation-${index}`, false)}
                  </div>
                ) : (
                  <div className="text-green-500 text-2xl pointer-events-none">{suits[index]}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {tableau.map((pile, pileIndex) => (
            <div 
              key={pileIndex} 
              className="space-y-1 min-h-20"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnTableau(e, pileIndex)}
            >
              {pile.length === 0 ? (
                <div 
                  className="w-16 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (selectedCard) {
                      moveToTableau(selectedCard.index, selectedCard.pile, pileIndex);
                    }
                  }}
                >
                  <div className="text-gray-400 text-xs">K</div>
                </div>
              ) : (
                <>
                  {pile.map((card, cardIndex) => (
                    <div 
                      key={cardIndex} 
                      style={{ marginTop: cardIndex > 0 ? '-40px' : '0' }}
                    >
                      {renderCard(card, cardIndex, `tableau-${pileIndex}`)}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Jogar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• <strong>Arraste</strong> as cartas ou <strong>clique</strong> para selecionar e depois clique no destino</li>
          <li>• Clique no baralho para virar uma carta</li>
          <li>• Organize as cartas em sequência decrescente alternando cores</li>
          <li>• Mova os Ases para as fundações e construa em sequência crescente por naipe</li>
          <li>• Objetivo: Mover todas as cartas para as fundações</li>
        </ul>
      </div>
    </div>
  );
};

export default SolitaireGame;