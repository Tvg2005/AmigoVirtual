import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Music, Play, Pause, Save, CreditCard as Edit, Volume2, Download, Trash2, Plus } from 'lucide-react';

interface MusicGameProps {
  onBack: () => void;
  onAchievement: (
    gameType: string,
    type: 'moves' | 'time' | 'completion',
    value: number,
    metadata?: any
  ) => void;
}

interface SavedSong {
  id: string;
  name: string;
  notes: string[];
  createdAt: Date;
}

const MusicGame: React.FC<MusicGameProps> = ({ onBack, onAchievement }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string[]>([]);
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);
  const [editingMode, setEditingMode] = useState(false);
  const [editingSong, setEditingSong] = useState<SavedSong | null>(null);
  const [songName, setSongName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<'piano' | 'guitar' | 'flute' | 'violin'>('piano');
  const audioContextRef = useRef<AudioContext | null>(null);

  const notes = [
    { note: 'C', frequency: 261.63, color: 'bg-red-400', name: 'Dó' },
    { note: 'C#', frequency: 277.18, color: 'bg-red-500', name: 'Dó#' },
    { note: 'D', frequency: 293.66, color: 'bg-orange-400', name: 'Ré' },
    { note: 'D#', frequency: 311.13, color: 'bg-orange-500', name: 'Ré#' },
    { note: 'E', frequency: 329.63, color: 'bg-yellow-400', name: 'Mi' },
    { note: 'F', frequency: 349.23, color: 'bg-green-400', name: 'Fá' },
    { note: 'F#', frequency: 369.99, color: 'bg-green-500', name: 'Fá#' },
    { note: 'G', frequency: 392.0, color: 'bg-blue-400', name: 'Sol' },
    { note: 'G#', frequency: 415.30, color: 'bg-blue-500', name: 'Sol#' },
    { note: 'A', frequency: 440.0, color: 'bg-indigo-400', name: 'Lá' },
    { note: 'A#', frequency: 466.16, color: 'bg-indigo-500', name: 'Lá#' },
    { note: 'B', frequency: 493.88, color: 'bg-purple-400', name: 'Si' },
  ];

  const instruments = [
    { id: 'piano', name: 'Piano', waveType: 'sine' as OscillatorType },
    { id: 'guitar', name: 'Guitarra', waveType: 'sawtooth' as OscillatorType },
    { id: 'flute', name: 'Flauta', waveType: 'triangle' as OscillatorType },
    { id: 'violin', name: 'Violino', waveType: 'square' as OscillatorType },
  ];

  const simpleSongs = [
    {
      name: 'Parabéns para Você',
      notes: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F'],
    },
    {
      name: 'Brilha, Brilha Estrelinha',
      notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
    },
    {
      name: 'Asa Branca',
      notes: ['G', 'A', 'B', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C'],
    },
  ];

  useEffect(() => {
    loadSavedSongs();
  }, []);

  const loadSavedSongs = () => {
    const saved = localStorage.getItem('elizia-saved-songs');
    if (saved) {
      try {
        const songs = JSON.parse(saved).map((song: any) => ({
          ...song,
          createdAt: new Date(song.createdAt)
        }));
        setSavedSongs(songs);
      } catch (error) {
        console.error('Error loading saved songs:', error);
      }
    }
  };

  const saveSongsToStorage = (songs: SavedSong[]) => {
    localStorage.setItem('elizia-saved-songs', JSON.stringify(songs));
    setSavedSongs(songs);
  };

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playNote = (frequency: number, duration: number = 0.3, waveType: OscillatorType = 'sine') => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = waveType;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handleNoteClick = (note: typeof notes[0]) => {
    const instrument = instruments.find(i => i.id === selectedInstrument);
    playNote(note.frequency, 0.3, instrument?.waveType || 'sine');
    
    if (editingMode && editingSong) {
      // Add note to editing song
      const updatedSong = {
        ...editingSong,
        notes: [...editingSong.notes, note.note]
      };
      setEditingSong(updatedSong);
    } else {
      setCurrentSong([...currentSong, note.note]);
    }

    if (currentSong.length + 1 >= 20) {
      onAchievement('music', 'moves', currentSong.length + 1);
    }
  };

  const playSong = async (song: typeof simpleSongs[0] | SavedSong) => {
    setIsPlaying(true);
    const instrument = instruments.find(i => i.id === selectedInstrument);
    
    for (let i = 0; i < song.notes.length; i++) {
      const noteData = notes.find((n) => n.note === song.notes[i]);
      if (noteData) {
        playNote(noteData.frequency, 0.5, instrument?.waveType || 'sine');
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    setIsPlaying(false);
    onAchievement('music', 'completion', 1);
  };

  const clearSong = () => {
    if (editingMode && editingSong) {
      setEditingSong({ ...editingSong, notes: [] });
    } else {
      setCurrentSong([]);
    }
  };

  const saveSong = () => {
    if (!songName.trim() || currentSong.length === 0) return;
    
    const newSong: SavedSong = {
      id: Date.now().toString(),
      name: songName.trim(),
      notes: [...currentSong],
      createdAt: new Date()
    };
    
    const updatedSongs = [...savedSongs, newSong];
    saveSongsToStorage(updatedSongs);
    
    setSongName('');
    setShowSaveDialog(false);
    setCurrentSong([]);
    
    onAchievement('music', 'completion', 1, { firstSave: savedSongs.length === 0 });
  };

  const editSong = (song: SavedSong) => {
    setEditingMode(true);
    setEditingSong({ ...song });
  };

  const saveEditedSong = () => {
    if (!editingSong) return;
    
    const updatedSongs = savedSongs.map(song => 
      song.id === editingSong.id ? editingSong : song
    );
    saveSongsToStorage(updatedSongs);
    
    setEditingMode(false);
    setEditingSong(null);
  };

  const deleteSong = (songId: string) => {
    const updatedSongs = savedSongs.filter(song => song.id !== songId);
    saveSongsToStorage(updatedSongs);
  };

  const removeNoteFromSong = (index: number) => {
    if (editingMode && editingSong) {
      const updatedNotes = editingSong.notes.filter((_, i) => i !== index);
      setEditingSong({ ...editingSong, notes: updatedNotes });
    } else {
      const updatedNotes = currentSong.filter((_, i) => i !== index);
      setCurrentSong(updatedNotes);
    }
  };

  const cancelEdit = () => {
    setEditingMode(false);
    setEditingSong(null);
  };

  const currentNotes = editingMode && editingSong ? editingSong.notes : currentSong;

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
          <h2 className="text-2xl font-bold text-blue-800">Piano Virtual</h2>
          <p className="text-blue-600">
            {editingMode ? `Editando: ${editingSong?.name}` : 'Toque e crie melodias'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {editingMode ? (
            <>
              <button
                onClick={saveEditedSong}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>Cancelar</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowSaveDialog(true)}
                disabled={currentSong.length === 0}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={clearSong}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors text-lg"
              >
                <span>Limpar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Instrument Selection */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-800">Escolha o Instrumento:</h3>
        </div>
        
        <div className="flex space-x-3">
          {instruments.map((instrument) => (
            <button
              key={instrument.id}
              onClick={() => setSelectedInstrument(instrument.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedInstrument === instrument.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {instrument.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-6">
          <Music className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-800">Piano:</h3>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {notes.map((note) => (
            <button
              key={note.note}
              onClick={() => handleNoteClick(note)}
              className={`${note.color} hover:opacity-80 text-white font-bold py-6 px-4 rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95`}
              disabled={isPlaying}
            >
              <div className="text-lg">{note.name}</div>
              <div className="text-xs opacity-75">{note.note}</div>
            </button>
          ))}
        </div>

        {currentNotes.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              {editingMode ? 'Editando Melodia:' : 'Sua Melodia:'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentNotes.map((note, index) => {
                const noteData = notes.find(n => n.note === note);
                return (
                  <div key={index} className="relative group">
                    <span
                      className={`${noteData?.color} text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer`}
                    >
                      {noteData?.name}
                    </span>
                    <button
                      onClick={() => removeNoteFromSong(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <Play className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-blue-800">Músicas Conhecidas:</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {simpleSongs.map((song, index) => (
            <button
              key={index}
              onClick={() => playSong(song)}
              disabled={isPlaying}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{song.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Songs */}
      {savedSongs.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center space-x-3 mb-4">
            <Save className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-blue-800">Suas Composições:</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSongs.map((song) => (
              <div key={song.id} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">{song.name}</h4>
                <p className="text-purple-600 text-sm mb-3">
                  {song.notes.length} notas • {song.createdAt.toLocaleDateString('pt-BR')}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => playSong(song)}
                    disabled={isPlaying}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Tocar</span>
                  </button>
                  <button
                    onClick={() => editSong(song)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => deleteSong(song.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Salvar Composição</h3>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              placeholder="Nome da música..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={saveSong}
                disabled={!songName.trim()}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-3">Como Usar:</h3>
        <ul className="text-blue-700 space-y-2 text-lg">
          <li>• Escolha um instrumento para mudar o som das notas</li>
          <li>• Clique nas teclas coloridas para tocar as notas</li>
          <li>• Experimente criar suas próprias melodias</li>
          <li>• Salve suas composições para tocar depois</li>
          <li>• Edite suas músicas salvas adicionando ou removendo notas</li>
          <li>• Use os botões verdes para ouvir músicas conhecidas</li>
        </ul>
      </div>
    </div>
  );
};

export default MusicGame;