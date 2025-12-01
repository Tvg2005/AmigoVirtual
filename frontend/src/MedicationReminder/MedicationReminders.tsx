import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import AccessibilityMenu from './components/AccessibilityMenu';

interface Medication {
  id: string;
  name: string;
  frequency: string;
  time: string;
  days: string[];
  user_id: string;
  created_at: string;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const FULL_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function MedicationReminders() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    frequency: '',
    time: '',
    days: [] as string[]
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingMedication) {
        const { error } = await supabase
          .from('medications')
          .update({
            name: formData.name,
            frequency: formData.frequency,
            time: formData.time,
            days: formData.days
          })
          .eq('id', editingMedication.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('medications')
          .insert({
            name: formData.name,
            frequency: formData.frequency,
            time: formData.time,
            days: formData.days,
            user_id: user.id
          });

        if (error) throw error;
      }

      setFormData({ name: '', frequency: '', time: '', days: [] });
      setShowForm(false);
      setEditingMedication(null);
      fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      frequency: medication.frequency,
      time: medication.time,
      days: medication.days
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lembrete?')) {
      try {
        const { error } = await supabase
          .from('medications')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchMedications();
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    
    setCurrentDate(newDate);
  };

  const getFilteredMedications = () => {
    const today = new Date();
    const currentDay = FULL_DAYS[currentDate.getDay()];
    
    return medications.filter(med => {
      if (viewMode === 'daily') {
        return med.days.includes(currentDay);
      } else if (viewMode === 'weekly') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return med.days.some(day => {
          const dayIndex = FULL_DAYS.indexOf(day);
          const dayDate = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + dayIndex);
          return dayDate >= startOfWeek && dayDate <= endOfWeek;
        });
      } else {
        return true; // Monthly view shows all medications
      }
    });
  };

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: viewMode === 'daily' ? 'long' : undefined,
      year: 'numeric',
      month: 'long',
      day: viewMode !== 'monthly' ? 'numeric' : undefined
    };
    
    return currentDate.toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-blue-900">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 relative">
      {/* Botão de Acessibilidade */}
      <div className="absolute top-4 right-4 z-20">
        <AccessibilityMenu />
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 transition-colors" title="Voltar ao dashboard">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-blue-900">Lembretes de Remédios</h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingMedication(null);
                setFormData({ name: '', frequency: '', time: '', days: [] });
              }}
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-2.5 rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Lembrete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* View Mode Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              {(['daily', 'weekly'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-6 py-2.5 rounded-2xl transition-all font-medium ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {mode === 'daily' ? 'Diário' : mode === 'weekly' ? 'Semanal' : 'Mensal'}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold min-w-[200px] text-center text-blue-900">
                {formatDateHeader()}
              </h2>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-blue-100">
          <div className="grid gap-4">
            {getFilteredMedications().length === 0 ? (
              <div className="text-center py-12 text-blue-400">
                <div className="text-6xl mb-4">💊</div>
                <p className="text-lg">Nenhum medicamento agendado para hoje</p>
              </div>
            ) : (
              getFilteredMedications().map((medication) => (
                <div key={medication.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 hover:shadow-xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900">{medication.name}</h3>
                      <div className="flex items-center gap-4 mt-3 text-sm text-blue-700">
                        <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full">
                          <Clock className="h-4 w-4" />
                          {medication.time.slice(0,5)}
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full">
                          <Calendar className="h-4 w-4" />
                          {medication.frequency}
                        </div>
                      </div>
                      <div className="mt-3 bg-white/60 inline-block px-3 py-1.5 rounded-full">
                        <span className="text-sm text-blue-600">Dias: </span>
                        <span className="text-sm font-semibold text-blue-800">
                          {medication.days.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(medication)}
                        className="p-3 text-blue-600 hover:bg-blue-100 rounded-2xl transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(medication.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl border-2 border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              {editingMedication ? 'Editar Lembrete' : 'Novo Lembrete'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Nome do Medicamento
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border-2 border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Frequência
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-3 border-2 border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50/50"
                  required
                >
                  <option value="">Selecione a frequência</option>
                  <option value="Uma vez ao dia">Uma vez ao dia</option>
                  <option value="Duas vezes ao dia">Duas vezes ao dia</option>
                  <option value="Três vezes ao dia">Três vezes ao dia</option>
                  <option value="A cada 8 horas">A cada 8 horas</option>
                  <option value="A cada 12 horas">A cada 12 horas</option>
                  <option value="Conforme necessário">Conforme necessário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Horário
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-3 border-2 border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-3">
                  Dias da Semana
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {FULL_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`p-2.5 text-sm font-medium rounded-2xl border-2 transition-all ${
                        formData.days.includes(day)
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-500 shadow-md'
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {DAYS_OF_WEEK[FULL_DAYS.indexOf(day)]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMedication(null);
                    setFormData({ name: '', frequency: '', time: '', days: [] });
                  }}
                  className="flex-1 px-4 py-3 border-2 border-blue-200 text-blue-700 font-semibold rounded-2xl hover:bg-blue-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-2xl hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all"
                >
                  {editingMedication ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}