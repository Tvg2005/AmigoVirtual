import { useState, useEffect } from 'react';
import { Settings, X, Volume2, Eye, Type } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  screenReader: boolean;
  fontSize: number;
}

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    screenReader: false,
    fontSize: 100,
  });

  useEffect(() => {
    const stored = localStorage.getItem('accessibilitySettings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  useEffect(() => {
    if (!settings.screenReader) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.getAttribute('title') ||
                   target.getAttribute('aria-label') ||
                   target.textContent?.trim() ||
                   target.placeholder ||
                   '';

      if (text && text.length > 0) {
        announceText(text);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [settings.screenReader]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    if (newSettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    document.documentElement.style.fontSize = `${newSettings.fontSize}%`;
  };

  const toggleHighContrast = () => {
    const newSettings = { ...settings, highContrast: !settings.highContrast };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    if (settings.screenReader) {
      announceText('Modo de alto contraste ' + (newSettings.highContrast ? 'ativado' : 'desativado'));
    }
  };

  const toggleScreenReader = () => {
    const newSettings = { ...settings, screenReader: !settings.screenReader };
    setSettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    // Sempre anunciar mudança de leitura de tela, mesmo quando desativando
    announceText('Leitura de tela ' + (newSettings.screenReader ? 'ativada' : 'desativada'));
  };

  const handleFontSizeChange = (size: number) => {
    const newSettings = { ...settings, fontSize: size };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    if (settings.screenReader) {
      announceText(`Tamanho da fonte alterado para ${size}%`);
    }
  };

  const announceText = (text: string) => {
    window.speechSynthesis.cancel();
    const announcement = new SpeechSynthesisUtterance(text);
    announcement.lang = 'pt-BR';
    window.speechSynthesis.speak(announcement);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-400 hover:bg-blue-500 text-white font-medium p-3 rounded-xl
                 transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-50"
        aria-label="Acessibilidades"
        aria-expanded={isOpen}
        title="Abrir menu de acessibilidades"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border-2 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-blue-700 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Acessibilidades</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                aria-label="Fechar menu"
                title="Fechar menu de acessibilidades"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div
                className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                title="Ativa contraste alto para melhor visualização"
              >
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={toggleHighContrast}
                    className="w-5 h-5 rounded border-2 border-blue-400 cursor-pointer"
                    aria-label="Modo de alto contraste"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-700">Alto Contraste</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Melhora a visualização</p>
                  </div>
                </label>
              </div>

              <div
                className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                title="Ativa leitura de tela para navegação por áudio"
              >
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.screenReader}
                    onChange={toggleScreenReader}
                    className="w-5 h-5 rounded border-2 border-blue-400 cursor-pointer"
                    aria-label="Leitura de tela"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-700">Leitura de Tela</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Narração de eventos</p>
                  </div>
                </label>
              </div>

              <div
                className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                title="Ajusta o tamanho da fonte em toda a página"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Type className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Tamanho da Fonte</span>
                </div>
                <div className="flex space-x-2">
                  {[80, 100, 120, 140].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`flex-1 py-2 px-2 rounded text-sm font-semibold transition-all
                        ${
                          settings.fontSize === size
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      aria-pressed={settings.fontSize === size}
                      title={`Fonte ${size}%`}
                    >
                      {size}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (settings.screenReader) {
                  announceText('Acessibilidades redefinidas para padrão');
                }
                setSettings({
                  highContrast: false,
                  screenReader: false,
                  fontSize: 100,
                });
                document.documentElement.classList.remove('high-contrast');
                document.documentElement.style.fontSize = '100%';
                localStorage.removeItem('accessibilitySettings');
              }}
              className="w-full mt-6 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700
                       rounded-lg font-semibold transition-colors text-sm"
              title="Restaurar configurações padrão"
            >
              Redefinir Tudo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

