import { crosswordWords, WordData } from '../data/crosswordWords';

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
}

export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
  userInput: string;
}

export class CrosswordGenerator {
  private gridSize: number = 15;
  private grid: string[][];
  private placedWords: CrosswordClue[] = [];
  private wordNumber: number = 1;

  constructor() {
    this.grid = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill('.')
    );
  }

  generateCrossword(): { grid: CrosswordCell[][], clues: CrosswordClue[] } {
    this.reset();
    
    // Shuffle words for randomness
    const shuffledWords = [...crosswordWords].sort(() => Math.random() - 0.5);
    
    // Place first word in the center
    const firstWord = shuffledWords[0];
    this.placeFirstWord(firstWord);
    
    // Try to place remaining words
    for (let i = 1; i < Math.min(shuffledWords.length, 15); i++) {
      this.tryPlaceWord(shuffledWords[i]);
    }
    
    // Convert to game format
    return this.convertToGameFormat();
  }

  private reset() {
    this.grid = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill('.')
    );
    this.placedWords = [];
    this.wordNumber = 1;
  }

  private placeFirstWord(wordData: WordData) {
    const word = wordData.word;
    const startRow = Math.floor(this.gridSize / 2);
    const startCol = Math.floor((this.gridSize - word.length) / 2);
    
    // Place horizontally
    for (let i = 0; i < word.length; i++) {
      this.grid[startRow][startCol + i] = word[i];
    }
    
    this.placedWords.push({
      number: this.wordNumber++,
      clue: wordData.clue,
      answer: word,
      direction: 'across',
      startRow,
      startCol
    });
  }

  private tryPlaceWord(wordData: WordData) {
    const word = wordData.word;
    const attempts = 50; // Limit attempts to avoid infinite loops
    
    for (let attempt = 0; attempt < attempts; attempt++) {
      // Try to find intersection with existing words
      for (const placedWord of this.placedWords) {
        const intersections = this.findIntersections(word, placedWord.answer);
        
        for (const intersection of intersections) {
          const { newWordIndex, placedWordIndex } = intersection;
          
          // Calculate position for new word
          let startRow: number, startCol: number, direction: 'across' | 'down';
          
          if (placedWord.direction === 'across') {
            // Place new word vertically
            direction = 'down';
            startRow = placedWord.startRow - newWordIndex;
            startCol = placedWord.startCol + placedWordIndex;
          } else {
            // Place new word horizontally
            direction = 'across';
            startRow = placedWord.startRow + placedWordIndex;
            startCol = placedWord.startCol - newWordIndex;
          }
          
          // Check if placement is valid
          if (this.canPlaceWord(word, startRow, startCol, direction)) {
            this.placeWord(word, startRow, startCol, direction);
            this.placedWords.push({
              number: this.wordNumber++,
              clue: wordData.clue,
              answer: word,
              direction,
              startRow,
              startCol
            });
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private findIntersections(word1: string, word2: string): Array<{newWordIndex: number, placedWordIndex: number}> {
    const intersections: Array<{newWordIndex: number, placedWordIndex: number}> = [];
    
    for (let i = 0; i < word1.length; i++) {
      for (let j = 0; j < word2.length; j++) {
        if (word1[i] === word2[j]) {
          intersections.push({
            newWordIndex: i,
            placedWordIndex: j
          });
        }
      }
    }
    
    return intersections;
  }

  private canPlaceWord(word: string, startRow: number, startCol: number, direction: 'across' | 'down'): boolean {
    // Check bounds
    if (direction === 'across') {
      if (startRow < 0 || startRow >= this.gridSize || 
          startCol < 0 || startCol + word.length > this.gridSize) {
        return false;
      }
    } else {
      if (startCol < 0 || startCol >= this.gridSize || 
          startRow < 0 || startRow + word.length > this.gridSize) {
        return false;
      }
    }
    
    // Check for conflicts
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      const currentCell = this.grid[row][col];
      if (currentCell !== '.' && currentCell !== word[i]) {
        return false;
      }
    }
    
    // Check adjacent cells (no touching words except at intersections)
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      // Check perpendicular adjacent cells
      if (direction === 'across') {
        if (row > 0 && this.grid[row - 1][col] !== '.' && this.grid[row - 1][col] !== word[i]) return false;
        if (row < this.gridSize - 1 && this.grid[row + 1][col] !== '.' && this.grid[row + 1][col] !== word[i]) return false;
      } else {
        if (col > 0 && this.grid[row][col - 1] !== '.' && this.grid[row][col - 1] !== word[i]) return false;
        if (col < this.gridSize - 1 && this.grid[row][col + 1] !== '.' && this.grid[row][col + 1] !== word[i]) return false;
      }
    }
    
    return true;
  }

  private placeWord(word: string, startRow: number, startCol: number, direction: 'across' | 'down') {
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      this.grid[row][col] = word[i];
    }
  }

  private convertToGameFormat(): { grid: CrosswordCell[][], clues: CrosswordClue[] } {
    const gameGrid: CrosswordCell[][] = Array(this.gridSize).fill(null).map(() =>
      Array(this.gridSize).fill(null).map(() => ({
        letter: '',
        isBlack: true,
        userInput: ''
      }))
    );

    // Mark cells with letters as white
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] !== '.') {
          gameGrid[row][col] = {
            letter: this.grid[row][col],
            isBlack: false,
            userInput: ''
          };
        }
      }
    }

    // Add numbers to starting positions
    this.placedWords.forEach(word => {
      gameGrid[word.startRow][word.startCol].number = word.number;
    });

    return {
      grid: gameGrid,
      clues: this.placedWords
    };
  }
}