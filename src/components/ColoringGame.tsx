import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Palette, Download, RefreshCw, Loader } from 'lucide-react';

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
  const [showColorPicker, setShowColorPicker] = useState(false);

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FF8A80', '#80CBC4', '#81C784', '#FFB74D', '#F06292',
    'eraser'
  ];

  const themes = [
    { id: 'animals', name: 'Animais', keywords: ['cat', 'dog', 'bird', 'fish', 'butterfly'] },
    { id: 'nature', name: 'Natureza', keywords: ['tree', 'flower', 'mountain', 'river', 'sunset'] },
    { id: 'food', name: 'Comida', keywords: ['fruit', 'cake', 'pizza', 'ice cream', 'apple'] },
    { id: 'vehicles', name: 'Veículos', keywords: ['car', 'airplane', 'boat', 'train', 'bicycle'] },
    { id: 'fantasy', name: 'Fantasia', keywords: ['castle', 'dragon', 'unicorn', 'fairy', 'magic'] },
    { id: 'patterns', name: 'Padrões', keywords: ['mandala', 'geometric', 'abstract', 'pattern', 'design'] }
  ];

  useEffect(() => {
    loadNewImage();
  }, [selectedTheme]);

  const loadNewImage = async () => {
    setIsLoadingImage(true);
    setImageLoaded(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Get random keyword from selected theme
      const theme = themes.find(t => t.id === selectedTheme);
      const keywords = theme?.keywords || ['simple', 'drawing'];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      // Try to get a coloring book style image
      const imageUrl = await getColoringImage(randomKeyword);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit image in canvas while maintaining aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        // Draw the image and convert to black and white outline
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Convert to black and white outline
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness
          const brightness = (r + g + b) / 3;
          
          // Create outline effect - dark pixels become black, light pixels become white
          if (brightness < 128) {
            data[i] = 0;     // R
            data[i + 1] = 0; // G
            data[i + 2] = 0; // B
          } else {
            data[i] = 255;     // R
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Store the original image data for eraser functionality
        setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
        setImageLoaded(true);
        setIsLoadingImage(false);
      };
      
      img.onerror = () => {
        // Fallback: create a simple drawing
        createFallbackDrawing(ctx, canvas);
        setIsLoadingImage(false);
      };
      
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Error loading image:', error);
      createFallbackDrawing(ctx, canvas);
      setIsLoadingImage(false);
    }
  };

  const getColoringImage = async (keyword: string): Promise<string> => {
    // Use Lorem Picsum with a specific seed for consistency
    const seed = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${keyword}${seed}/400/400?grayscale`;
  };

  const createFallbackDrawing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple house outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';
    
    // House base
    ctx.fillRect(100, 200, 200, 150);
    ctx.strokeRect(100, 200, 200, 150);
    
    // Roof
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.lineTo(200, 120);
    ctx.lineTo(320, 200);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Door
    ctx.fillRect(180, 280, 40, 70);
    ctx.strokeRect(180, 280, 40, 70);
    
    // Windows
    ctx.fillRect(130, 230, 30, 30);
    ctx.strokeRect(130, 230, 30, 30);
    ctx.fillRect(240, 230, 30, 30);
    ctx.strokeRect(240, 230, 30, 30);
    
    // Sun
    ctx.beginPath();
    ctx.arc(350, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Sun rays
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const x1 = 350 + Math.cos(angle) * 40;
      const y1 = 80 + Math.sin(angle) * 40;
      const x2 = 350 + Math.cos(angle) * 50;
      const y2 = 80 + Math.sin(angle) * 50;
      
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

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
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
      </div>

      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="mb-4 text-center">
            {isLoadingImage ? (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Carregando nova imagem...</span>
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
          <li>• Escolha um tema para gerar uma nova imagem para colorir</li>
          <li>• Clique nas cores predefinidas ou use o seletor de cores personalizado</li>
          <li>• Digite um código hexadecimal para usar uma cor específica</li>
          <li>• Use a borracha (🧽) para remover cores aplicadas</li>
          <li>• Ajuste o tamanho do pincel com o controle deslizante</li>
          <li>• Clique e arraste no desenho para pintar</li>
          <li>• Use "Nova Imagem" para gerar um desenho diferente do mesmo tema</li>
          <li>• Salve sua obra de arte com o botão "Salvar"</li>
        </ul>
      </div>
    </div>
  );
}