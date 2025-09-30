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
  private maxWords: number = 12; // Increased from implicit limit

  constructor() {
    this.grid = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill('.')
    );
  }

  generateCrossword(): { grid: CrosswordCell[][], clues: CrosswordClue[] } {
    this.reset();
    
    // Filter out inappropriate words and shuffle for randomness
    const appropriateWords = this.filterAppropriateWords(crosswordWords);
    const shuffledWords = [...appropriateWords].sort(() => Math.random() - 0.5);
    
    // Place first word in the center
    if (shuffledWords.length > 0) {
      this.placeFirstWord(shuffledWords[0]);
    }
    
    // Try to place remaining words with better intersection logic
    let attempts = 0;
    const maxAttempts = shuffledWords.length * 3;
    
    for (let i = 1; i < shuffledWords.length && this.placedWords.length < this.maxWords && attempts < maxAttempts; i++) {
      if (this.tryPlaceWordWithIntersections(shuffledWords[i])) {
        // Successfully placed word
      } else {
        attempts++;
      }
    }
    
    // If we don't have enough words, try again with different approach
    if (this.placedWords.length < 5) {
      this.reset();
      this.generateWithForcedPlacements(shuffledWords);
    }
    
    // Convert to game format
    return this.convertToGameFormat();
  }

  private filterAppropriateWords(words: WordData[]): WordData[] {
    // Filter out inappropriate words (basic filter)
    const inappropriateWords = ['MERDA', 'PORRA', 'CARALHO', 'PUTA', 'FODIDO', 'BUCETA'];
    return words.filter(word => 
      !inappropriateWords.includes(word.word.toUpperCase()) &&
      word.word.length >= 3 && 
      word.word.length <= 12
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
    const maxAttempts = 100;
    
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

  private generateWithForcedPlacements(words: WordData[]) {
    // Alternative generation method for better word placement
    const centerRow = Math.floor(this.gridSize / 2);
    const centerCol = Math.floor(this.gridSize / 2);
    
    // Place first word horizontally in center
    if (words.length > 0) {
      const firstWord = words[0];
      const startCol = centerCol - Math.floor(firstWord.word.length / 2);
      
      for (let i = 0; i < firstWord.word.length; i++) {
        this.grid[centerRow][startCol + i] = firstWord.word[i];
      }
      
      this.placedWords.push({
        number: this.wordNumber++,
        clue: firstWord.clue,
        answer: firstWord.word,
        direction: 'across',
        startRow: centerRow,
        startCol
      });
    }
    
    // Place second word vertically through center
    if (words.length > 1) {
      const secondWord = words[1];
      const intersectionIndex = Math.floor(secondWord.word.length / 2);
      const startRow = centerRow - intersectionIndex;
      
      if (this.canPlaceWord(secondWord.word, startRow, centerCol, 'down')) {
        this.placeWord(secondWord.word, startRow, centerCol, 'down');
        this.placedWords.push({
          number: this.wordNumber++,
          clue: secondWord.clue,
          answer: secondWord.word,
          direction: 'down',
          startRow,
          startCol: centerCol
        });
      }
    }
    
    // Try to place remaining words
    for (let i = 2; i < words.length && this.placedWords.length < this.maxWords; i++) {
      this.tryPlaceWordWithIntersections(words[i]);
    }
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
    
    // Check for conflicts and ensure proper intersections
    for (let i = 0; i < word.length; i++) {
      const row = direction === 'across' ? startRow : startRow + i;
      const col = direction === 'across' ? startCol + i : startCol;
      
      const currentCell = this.grid[row][col];
      if (currentCell !== '.' && currentCell !== word[i]) {
        return false;
      }
    }
    
    // Check that word doesn't touch other words inappropriately
    return this.checkWordSpacing(word, startRow, startCol, direction);
  }

  private checkWordSpacing(word: string, startRow: number, startCol: number, direction: 'across' | 'down'): boolean {
    // Check before and after the word
    if (direction === 'across') {
      // Check cell before
      if (startCol > 0 && this.grid[startRow][startCol - 1] !== '.') {
        return false;
      }
      // Check cell after
      if (startCol + word.length < this.gridSize && this.grid[startRow][startCol + word.length] !== '.') {
        return false;
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