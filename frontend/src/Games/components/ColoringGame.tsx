import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Palette, Download, RefreshCw, Loader, AlertCircle } from 'lucide-react';

interface ColoringGameProps {
  onBack: () => void;
  onAchievement: (gameType: string, type: 'moves' | 'time' | 'completion', value: number, metadata?: any) => void;
}

export default function ColoringGame({ onBack, onAchievement }: ColoringGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [customColor, setCustomColor] = useState('#FF6B6B');
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(6);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('animals');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [useOriginalImage, setUseOriginalImage] = useState(false);

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FF8A80', '#80CBC4', '#81C784', '#FFB74D', '#F06292',
    'eraser'
  ];

  const themes = [
    { 
      id: 'animals', 
      name: 'Animais',
      searchTerms: ['cat', 'dog', 'bird', 'butterfly', 'elephant', 'lion', 'tiger', 'bear', 'rabbit', 'fish', 'horse', 'owl'],
      drawings: [
        { name: 'Gato', path: 'M50,150 Q50,100 100,100 Q150,100 150,150 Q150,200 100,200 Q50,200 50,150 M75,125 C75,125 75,125 75,125 M125,125 C125,125 125,125 125,125 M100,140 L100,160 M85,160 Q100,170 115,160' },
        { name: 'Cachorro', path: 'M60,120 Q60,80 100,80 Q140,80 140,120 Q140,180 100,180 Q60,180 60,120 M80,110 C80,110 80,110 80,110 M120,110 C120,110 120,110 120,110 M100,130 L100,150 M90,150 Q100,160 110,150' },
        { name: 'Pássaro', path: 'M100,100 Q80,80 60,100 Q80,120 100,100 Q120,80 140,100 Q120,120 100,100 M90,95 C90,95 90,95 90,95 M110,95 C110,95 110,95 110,95 M100,105 L105,110' }
      ]
    },
    { 
      id: 'nature', 
      name: 'Natureza',
      searchTerms: ['tree', 'flower', 'leaf', 'forest', 'garden', 'landscape', 'plant', 'sunset', 'mountain', 'lake', 'ocean', 'sky'],
      drawings: [
        { name: 'Árvore', path: 'M100,200 L100,120 M80,140 Q100,100 120,140 M70,160 Q100,120 130,160 M60,180 Q100,140 140,180' },
        { name: 'Flor', path: 'M100,150 Q80,130 90,110 Q100,120 110,110 Q120,130 100,150 Q120,170 110,190 Q100,180 90,190 Q80,170 100,150 M100,150 C100,150 100,150 100,150' },
        { name: 'Sol', path: 'M100,100 C120,100 120,120 100,120 C80,120 80,100 100,100 M100,70 L100,80 M130,100 L120,100 M100,130 L100,140 M70,100 L80,100 M115,85 L122,78 M115,115 L122,122 M85,85 L78,78 M85,115 L78,122' }
      ]
    },
    { 
      id: 'food', 
      name: 'Comida',
      searchTerms: ['fruit', 'apple', 'banana', 'orange', 'strawberry', 'grape', 'pineapple', 'watermelon', 'cherry', 'peach', 'lemon', 'lime'],
      drawings: [
        { name: 'Maçã', path: 'M100,80 Q80,60 70,80 Q70,120 100,140 Q130,120 130,80 Q120,60 100,80 M100,80 Q100,70 105,65' },
        { name: 'Pizza', path: 'M100,60 L60,140 L140,140 Z M80,100 C85,100 85,105 80,105 C75,105 75,100 80,100 M120,100 C125,100 125,105 120,105 C115,105 115,100 120,100 M100,120 C105,120 105,125 100,125 C95,125 95,120 100,120' },
        { name: 'Sorvete', path: 'M100,160 L90,100 Q90,80 100,80 Q110,80 110,100 L100,160 M90,100 Q100,90 110,100 M85,110 Q100,100 115,110' }
      ]
    },
    { 
      id: 'vehicles', 
      name: 'Veículos',
      searchTerms: ['car', 'airplane', 'boat', 'truck', 'motorcycle', 'bicycle', 'train', 'bus', 'ship', 'helicopter', 'rocket', 'submarine'],
      drawings: [
        { name: 'Carro', path: 'M60,140 L60,120 Q60,100 80,100 L120,100 Q140,100 140,120 L140,140 Q140,160 120,160 L80,160 Q60,160 60,140 M75,150 C80,150 80,155 75,155 C70,155 70,150 75,150 M125,150 C130,150 130,155 125,155 C120,155 120,150 125,150' },
        { name: 'Avião', path: 'M100,100 L140,120 L100,110 L60,120 L100,100 M100,110 L100,140 M80,130 L120,130' },
        { name: 'Barco', path: 'M60,140 Q60,160 100,160 Q140,160 140,140 L120,140 L80,140 Z M100,140 L100,100 M90,120 L110,120' }
      ]
    },
    { 
      id: 'fantasy', 
      name: 'Fantasia',
      searchTerms: ['castle', 'star', 'heart', 'dragon', 'unicorn', 'fairy', 'crown', 'knight', 'princess', 'wizard', 'magic', 'rainbow'],
      drawings: [
        { name: 'Castelo', path: 'M60,160 L60,100 L80,100 L80,80 L90,80 L90,100 L110,100 L110,80 L120,80 L120,100 L140,100 L140,160 Z M70,120 L70,140 M130,120 L130,140 M100,120 L100,150' },
        { name: 'Estrela', path: 'M100,60 L105,85 L130,85 L110,105 L115,130 L100,115 L85,130 L90,105 L70,85 L95,85 Z' },
        { name: 'Coração', path: 'M100,130 Q80,110 70,120 Q70,140 100,160 Q130,140 130,120 Q120,110 100,130' }
      ]
    },
    { 
      id: 'patterns', 
      name: 'Padrões',
      searchTerms: ['mandala', 'geometric', 'spiral', 'abstract', 'design', 'art', 'decorative', 'ornament', 'symmetry', 'circle', 'triangle', 'square'],
      drawings: [
        { name: 'Mandala', path: 'M100,100 C120,100 120,120 100,120 C80,120 80,100 100,100 M100,80 C110,80 110,90 100,90 C90,90 90,80 100,80 M100,110 C110,110 110,120 100,120 C90,120 90,110 100,110 M80,100 C80,110 90,110 90,100 C90,90 80,90 80,100 M110,100 C110,110 120,110 120,100 C120,90 110,90 110,100' },
        { name: 'Geométrico', path: 'M60,60 L140,60 L140,140 L60,140 Z M80,80 L120,80 L120,120 L80,120 Z M100,100 C110,100 110,110 100,110 C90,110 90,100 100,100' },
        { name: 'Espiral', path: 'M100,100 Q120,100 120,120 Q120,140 100,140 Q80,140 80,120 Q80,100 100,100 Q110,100 110,110 Q110,120 100,120 Q90,120 90,110 Q90,100 100,100' }
      ]
    }
  ];

  useEffect(() => {
    loadNewImage();
  }, [selectedTheme]);

  const loadImageFromAPI = async (): Promise<boolean> => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    try {
      // Get random image URL similar to JigsawGame approach
      const imageUrl = await getRandomImage();
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        // Set timeout to avoid infinite loading
        const timeout = setTimeout(() => {
          console.error('Image loading timeout');
          resolve(false);
        }, 10000); // 10 seconds timeout
        
        img.onload = () => {
          clearTimeout(timeout);
          try {
            // Clear canvas with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the image with minimal or no processing
            if (useOriginalImage) {
              // Just draw the image as is
              const imgAspect = img.width / img.height;
              const canvasAspect = canvas.width / canvas.height;
              
              let drawWidth, drawHeight, offsetX, offsetY;
              
              if (imgAspect > canvasAspect) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
              } else {
                drawWidth = canvas.height * imgAspect;
                drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
              }
              
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            } else {
              // Apply light processing
              processImageForColoring(ctx, img, canvas.width, canvas.height);
            }
            resolve(true);
          } catch (error) {
            console.error('Error processing image:', error);
            resolve(false);
          }
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          console.error('Error loading image from URL:', imageUrl);
          resolve(false);
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error in loadImageFromAPI:', error);
      return false;
    }
  };

  const getRandomImage = async (): Promise<string> => {
    try {
      const theme = themes.find(t => t.id === selectedTheme);
      if (!theme) {
        // Fallback to random image
        const randomId = Math.floor(Math.random() * 1000) + 1;
        return `https://picsum.photos/500/400?random=${randomId}`;
      }

      // Select random search term from theme
      const searchTerm = theme.searchTerms[Math.floor(Math.random() * theme.searchTerms.length)];
      
      // Try APIs that provide better images for coloring
      const imageUrls = [
        // Picsum with specific seed for consistency
        `https://picsum.photos/500/400?random=${Math.floor(Math.random() * 1000) + 1}`,
        // Unsplash with specific terms
        `https://source.unsplash.com/500x400/?${searchTerm}`,
        // Simple placeholder with theme text
        `https://via.placeholder.com/500x400/ffffff/000000?text=${encodeURIComponent(searchTerm)}`,
        // Another random from picsum
        `https://picsum.photos/500/400?random=${Math.floor(Math.random() * 1000) + 1000}`
      ];

      // Test each URL with timeout
      for (const imageUrl of imageUrls) {
        try {
          const result = await testImageUrl(imageUrl);
          if (result) {
            return imageUrl;
          }
        } catch (error) {
          console.log(`Failed to load ${imageUrl}, trying next...`);
          continue;
        }
      }
      
      // Ultimate fallback
      const randomId = Math.floor(Math.random() * 1000) + 1;
      return `https://picsum.photos/500/400?random=${randomId}`;
      
    } catch (error) {
      console.error('Error in getRandomImage:', error);
      // Ultimate fallback - use a solid color pattern
      const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return `https://via.placeholder.com/500x400/${randomColor}/FFFFFF?text=Coloring`;
    }
  };

  const testImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000); // 3 seconds timeout per URL
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      
      img.src = url;
    });
  };

  const processImageForColoring = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) => {
    try {
      // Calculate scaling to fit image in canvas while maintaining aspect ratio
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgAspect > canvasAspect) {
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawWidth = height * imgAspect;
        drawHeight = height;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      }
      
      // Draw the image first
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Simple approach: Just apply a light filter to make it more suitable for coloring
      // without destroying the image
      
      // Get image data for minimal processing
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Light processing: only enhance contrast slightly and reduce noise
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Light contrast enhancement - don't destroy the image
        const enhancedGray = gray < 128 ? gray * 0.8 : gray * 1.2;
        const clampedGray = Math.min(255, Math.max(0, enhancedGray));
        
        // Only apply if it's not already a simple image
        if (r !== g || g !== b) {
          // Apply light grayscale with contrast
          data[i] = clampedGray;     // R
          data[i + 1] = clampedGray; // G
          data[i + 2] = clampedGray; // B
        }
        data[i + 3] = 255; // A
      }
      
      // Put the lightly processed image data back
      ctx.putImageData(imageData, 0, 0);
      
    } catch (error) {
      console.error('Error processing image for coloring:', error);
      // If processing fails, just draw the image as is - better than broken processing
      ctx.drawImage(img, 0, 0, width, height);
    }
  };


  const loadNewImage = async () => {
    setIsLoadingImage(true);
    setImageLoaded(false);
    setApiError(null);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Try to load image from API first
      const apiImageLoaded = await loadImageFromAPI();
      
      if (!apiImageLoaded) {
        // Fallback to SVG drawings if API fails
        const theme = themes.find(t => t.id === selectedTheme);
        if (!theme) return;
        
        const randomDrawing = theme.drawings[Math.floor(Math.random() * theme.drawings.length)];
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create SVG-based drawing
        createDrawingFromPath(ctx, randomDrawing.path, canvas.width, canvas.height);
      }
      
      // Store the original image data for eraser functionality
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setImageLoaded(true);
      setIsLoadingImage(false);
      
    } catch (error) {
      console.error('Error loading image:', error);
      setApiError('Erro ao carregar imagem. Usando desenho padrão.');
      createFallbackDrawing(ctx, canvas);
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setImageLoaded(true);
      setIsLoadingImage(false);
    }
  };

  const createDrawingFromPath = (ctx: CanvasRenderingContext2D, pathData: string, width: number, height: number) => {
    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Scale the drawing to fit canvas
    const scale = Math.min(width / 200, height / 200);
    const offsetX = (width - 200 * scale) / 2;
    const offsetY = (height - 200 * scale) / 2;
    
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    
    // Parse and draw the path
    const path = new Path2D(pathData);
    ctx.fill(path);
    ctx.stroke(path);
    
    ctx.restore();
  };

  const createFallbackDrawing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple house outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.6;
    
    // House base
    const houseWidth = size * 0.6;
    const houseHeight = size * 0.4;
    const houseX = centerX - houseWidth / 2;
    const houseY = centerY - houseHeight / 2 + size * 0.1;
    
    ctx.fillRect(houseX, houseY, houseWidth, houseHeight);
    ctx.strokeRect(houseX, houseY, houseWidth, houseHeight);
    
    // Roof
    ctx.beginPath();
    ctx.moveTo(houseX - size * 0.1, houseY);
    ctx.lineTo(centerX, houseY - size * 0.2);
    ctx.lineTo(houseX + houseWidth + size * 0.1, houseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Door
    const doorWidth = houseWidth * 0.2;
    const doorHeight = houseHeight * 0.5;
    const doorX = centerX - doorWidth / 2;
    const doorY = houseY + houseHeight - doorHeight;
    
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
    ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);
    
    // Windows
    const windowSize = houseWidth * 0.15;
    const windowY = houseY + houseHeight * 0.3;
    
    // Left window
    ctx.fillRect(houseX + houseWidth * 0.2, windowY, windowSize, windowSize);
    ctx.strokeRect(houseX + houseWidth * 0.2, windowY, windowSize, windowSize);
    
    // Right window
    ctx.fillRect(houseX + houseWidth * 0.65, windowY, windowSize, windowSize);
    ctx.strokeRect(houseX + houseWidth * 0.65, windowY, windowSize, windowSize);
    
    // Sun
    const sunRadius = size * 0.08;
    const sunX = centerX + size * 0.3;
    const sunY = centerY - size * 0.3;
    
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Sun rays
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const x1 = sunX + Math.cos(angle) * sunRadius * 1.3;
      const y1 = sunY + Math.sin(angle) * sunRadius * 1.3;
      const x2 = sunX + Math.cos(angle) * sunRadius * 1.6;
      const y2 = sunY + Math.sin(angle) * sunRadius * 1.6;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
    setImageLoaded(true);
  };

  const drawOnCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (selectedColor === 'eraser') {
      // Restore original image data in the eraser area
      const eraserSize = brushSize * 2;
      const startX = Math.max(0, Math.floor(x - eraserSize));
      const startY = Math.max(0, Math.floor(y - eraserSize));
      const endX = Math.min(canvas.width, Math.ceil(x + eraserSize));
      const endY = Math.min(canvas.height, Math.ceil(y + eraserSize));
      
      const currentImageData = ctx.getImageData(startX, startY, endX - startX, endY - startY);
      const originalData = originalImageData.data;
      const currentData = currentImageData.data;
      
      for (let py = startY; py < endY; py++) {
        for (let px = startX; px < endX; px++) {
          const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
          if (distance <= eraserSize) {
            const originalIndex = (py * canvas.width + px) * 4;
            const currentIndex = ((py - startY) * (endX - startX) + (px - startX)) * 4;
            
            // Copy original pixel data
            currentData[currentIndex] = originalData[originalIndex];     // R
            currentData[currentIndex + 1] = originalData[originalIndex + 1]; // G
            currentData[currentIndex + 2] = originalData[originalIndex + 2]; // B
            currentData[currentIndex + 3] = originalData[originalIndex + 3]; // A
          }
        }
      }
      
      ctx.putImageData(currentImageData, startX, startY);
    } else {
      // Use multiply blend mode for coloring effect
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = selectedColor;
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded || isLoadingImage) return;
    
    if (!startTime) {
      setStartTime(new Date());
    }
    
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageLoaded || isLoadingImage) return;
    
    if (!hasDrawn) {
      setHasDrawn(true);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawOnCanvas(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    loadNewImage();
  };

  const loadFallbackImage = () => {
    setIsLoadingImage(true);
    setImageLoaded(false);
    setApiError(null);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Force use SVG drawings
      const theme = themes.find(t => t.id === selectedTheme);
      if (!theme) return;
      
      const randomDrawing = theme.drawings[Math.floor(Math.random() * theme.drawings.length)];
      
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create SVG-based drawing
      createDrawingFromPath(ctx, randomDrawing.path, canvas.width, canvas.height);
      
      // Store the original image data for eraser functionality
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setImageLoaded(true);
      setIsLoadingImage(false);
      
    } catch (error) {
      console.error('Error creating fallback drawing:', error);
      createFallbackDrawing(ctx, canvas);
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      setImageLoaded(true);
      setIsLoadingImage(false);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (hasDrawn && startTime) {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      onAchievement('coloring', 'completion', 1);
      onAchievement('coloring', 'time', timeSpent);
    }

    const link = document.createElement('a');
    link.download = `colorir-${selectedTheme}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg border border-blue-100">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        
        <h2 className="text-2xl font-bold text-blue-800">Livro de Colorir</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={loadNewImage}
            disabled={isLoadingImage}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
          >
            {isLoadingImage ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            <span>Nova Imagem</span>
          </button>
          <button
            onClick={() => setUseOriginalImage(!useOriginalImage)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              useOriginalImage 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            <span>{useOriginalImage ? '✓' : '○'}</span>
            <span>{useOriginalImage ? 'Imagem Original' : 'Imagem sem cor'}</span>
          </button>
          <button
            onClick={clearCanvas}
            disabled={isLoadingImage}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Limpar</span>
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      {/* <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <Palette className="w-6 h-6 mr-2" />
          Escolha um Tema:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              disabled={isLoadingImage}
              className={`p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div> */}

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="mb-4 text-center">
            {isLoadingImage ? (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Carregando nova imagem...</span>
              </div>
            ) : apiError ? (
              <div className="flex items-center justify-center space-x-2 text-orange-600">
                <AlertCircle className="w-5 h-5" />
                <span>{apiError}</span>
              </div>
            ) : (
              <span className="text-blue-800 font-medium">Clique e arraste para colorir a imagem</span>
            )}
          </div>
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className={`border-2 border-gray-300 rounded-lg ${
              !imageLoaded || isLoadingImage ? 'opacity-50 cursor-wait' : selectedColor === 'eraser' ? 'cursor-grab' : 'cursor-crosshair'
            }`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Paleta de Cores:</h3>
        
        {/* Predefined Colors */}
        <div className="grid grid-cols-8 gap-3 mb-4">
          {predefinedColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(color)}
              className={`w-12 h-12 rounded-full border-4 transition-all ${
                selectedColor === color
                  ? 'border-gray-800 scale-110'
                  : 'border-gray-300 hover:border-gray-500'
              } ${color === 'eraser' ? 'bg-gray-200 flex items-center justify-center text-2xl' : ''}`}
              style={color !== 'eraser' ? { backgroundColor: color } : {}}
            >
              {color === 'eraser' ? '🧽' : ''}
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-blue-800 font-medium">Cor Personalizada:</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setCustomColor(value);
                  if (value.length === 7) {
                    handleColorChange(value);
                  }
                }
              }}
              placeholder="#FF6B6B"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
              maxLength={7}
            />
            <button
              onClick={() => handleColorChange(customColor)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Usar
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-blue-800 font-medium">Tamanho do Pincel:</label>
          <input
            type="range"
            min="2"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-blue-800 font-medium w-8">{brushSize}</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Escolha um tema para buscar imagens aleatórias relacionadas a esse tema</li>
          <li>• Use "Nova Imagem" para buscar uma imagem diferente da internet</li>
          <li>• Use "Desenho SVG" para usar desenhos pré-definidos se a API falhar</li>
          <li>• Toggle "Original/Processada" para ver a imagem sem processamento (melhor qualidade)</li>
          <li>• Clique nas cores predefinidas ou use o seletor de cores personalizado</li>
          <li>• Digite um código hexadecimal para usar uma cor específica</li>
          <li>• Use a borracha (🧽) para remover cores aplicadas</li>
          <li>• Ajuste o tamanho do pincel com o controle deslizante</li>
          <li>• Clique e arraste na imagem para pintar</li>
          <li>• Salve sua obra de arte com o botão "Salvar"</li>
        </ul>
      </div>
    </div>
  );
}