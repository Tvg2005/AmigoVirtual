import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Lembretes de Remédios</h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingMedication(null);
                setFormData({ name: '', frequency: '', time: '', days: [] });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Lembrete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {(['daily', 'weekly'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'daily' ? 'Diário' : mode === 'weekly' ? 'Semanal' : 'Mensal'}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold min-w-[200px] text-center">
                {formatDateHeader()}
              </h2>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid gap-4">
            {getFilteredMedications().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum lembrete encontrado para este período
              </div>
            ) : (
              getFilteredMedications().map((medication) => (
                <div key={medication.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {medication.time.slice(0,5)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {medication.frequency}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">Dias: </span>
                        <span className="text-sm font-medium">
                          {medication.days.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(medication)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(medication.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingMedication ? 'Editar Lembrete' : 'Novo Lembrete'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Medicamento
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias da Semana
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {FULL_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        formData.days.includes(day)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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