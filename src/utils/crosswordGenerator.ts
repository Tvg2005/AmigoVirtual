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
  isLocked?: boolean;
}

export class CrosswordGenerator {
  private gridSize: number = 15;
  private grid: string[][];
  private placedWords: CrosswordClue[] = [];
  private wordNumber: number = 1;
  private maxWords: number = 8; // Reduced for better spacing

  constructor() {
    this.grid = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill('.')
    );
  }

  generateCrossword(): { grid: CrosswordCell[][], clues: CrosswordClue[] } {
    this.reset();
    
    // Filter and shuffle words
    const appropriateWords = this.filterAppropriateWords(crosswordWords);
    const shuffledWords = [...appropriateWords].sort(() => Math.random() - 0.5);
    
    // Place first word in the center
    if (shuffledWords.length > 0) {
      this.placeFirstWord(shuffledWords[0]);
    }
    
    // Try to place remaining words with better intersection logic
    let attempts = 0;
    const maxAttempts = shuffledWords.length * 2;
    
    for (let i = 1; i < shuffledWords.length && this.placedWords.length < this.maxWords && attempts < maxAttempts; i++) {
      if (this.tryPlaceWordWithIntersections(shuffledWords[i])) {
        // Successfully placed word
      } else {
        attempts++;
      }
    }
    
    // Convert to game format
    return this.convertToGameFormat();
  }

  private filterAppropriateWords(words: WordData[]): WordData[] {
    const inappropriateWords = ['MERDA', 'PORRA', 'CARALHO', 'PUTA', 'FODIDO', 'BUCETA'];
    return words.filter(word => 
      !inappropriateWords.includes(word.word.toUpperCase()) &&
      word.word.length >= 3 && 
      word.word.length <= 10 // Reduced max length for better fit
    );
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

  private tryPlaceWordWithIntersections(wordData: WordData): boolean {
    const word = wordData.word;
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Try to find intersection with existing words
      for (const placedWord of this.placedWords) {
        const intersections = this.findIntersections(word, placedWord.answer);
        
        // Shuffle intersections for randomness
        const shuffledIntersections = intersections.sort(() => Math.random() - 0.5);
        
        for (const intersection of shuffledIntersections) {
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
      if (startRow < 1 || startRow >= this.gridSize - 1 || 
          startCol < 1 || startCol + word.length >= this.gridSize - 1) {
        return false;
      }
    } else {
      if (startCol < 1 || startCol >= this.gridSize - 1 || 
          startRow < 1 || startRow + word.length >= this.gridSize - 1) {
        return false;
      }
    }
    
    // Check for conflicts and ensure proper intersections
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      const currentCell = this.grid[row][col];
      if (currentCell !== '.' && currentCell !== word[i]) {
        return false;
      }
    }
    
    // Check spacing - ensure words don't touch inappropriately
    return this.checkWordSpacing(word, startRow, startCol, direction);
  }

  private checkWordSpacing(word: string, startRow: number, startCol: number, direction: 'across' | 'down'): boolean {
    // Check cells around the word to ensure proper spacing
    if (direction === 'across') {
      // Check cell before
      if (startCol > 0 && this.grid[startRow][startCol - 1] !== '.') {
        return false;
      }
      // Check cell after
      if (startCol + word.length < this.gridSize && this.grid[startRow][startCol + word.length] !== '.') {
        return false;
      }
      
      // Check cells above and below each letter
      for (let i = 0; i < word.length; i++) {
        const col = startCol + i;
        // Check above
        if (startRow > 0 && this.grid[startRow - 1][col] !== '.' && this.grid[startRow][col] === '.') {
          return false;
        }
        // Check below
        if (startRow < this.gridSize - 1 && this.grid[startRow + 1][col] !== '.' && this.grid[startRow][col] === '.') {
          return false;
        }
      }
    } else {
      // Check cell before
      if (startRow > 0 && this.grid[startRow - 1][startCol] !== '.') {
        return false;
      }
      // Check cell after
      if (startRow + word.length < this.gridSize && this.grid[startRow + word.length][startCol] !== '.') {
        return false;
      }
      
      // Check cells left and right of each letter
      for (let i = 0; i < word.length; i++) {
        const row = startRow + i;
        // Check left
        if (startCol > 0 && this.grid[row][startCol - 1] !== '.' && this.grid[row][startCol] === '.') {
          return false;
        }
        // Check right
        if (startCol < this.gridSize - 1 && this.grid[row][startCol + 1] !== '.' && this.grid[row][startCol] === '.') {
          return false;
        }
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
        userInput: '',
        isLocked: false
      }))
    );

    // Mark cells with letters as white
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] !== '.') {
          gameGrid[row][col] = {
            letter: this.grid[row][col],
            isBlack: false,
            userInput: '',
            isLocked: false
          };
        }
      }
    }

    // Add numbers to starting positions
    this.placedWords.forEach(word => {
      if (gameGrid[word.startRow] && gameGrid[word.startRow][word.startCol]) {
        gameGrid[word.startRow][word.startCol].number = word.number;
      }
    });

    return {
      grid: gameGrid,
      clues: this.placedWords
    };
  }
}