import React, { useState, useEffect } from "react";
import { GamepadIcon, Pill, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Medication {
  id: string;
  name: string;
  frequency: string;
  time: string;
  days: string[];
  user_id: string;
  created_at: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  created_at: string;
}

const FULL_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const RecentActivities: React.FC = () => {
  const [todayMedications, setTodayMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayMedications();
    fetchMedicationLogs();
  }, []);

  const fetchTodayMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const currentDay = FULL_DAYS[today.getDay()];

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const todayMeds = (data || []).filter(med => 
        med.days.includes(currentDay)
      );

      setTodayMedications(todayMeds);
    } catch (error) {
      console.error('Error fetching today medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const { data, error } = await supabase
        .from('medication_logs')
        .select(`
          *,
          medications!inner(user_id)
        `)
        .gte('taken_at', startOfDay.toISOString())
        .lt('taken_at', endOfDay.toISOString())
        .eq('medications.user_id', user.id);

      if (error) throw error;
      setMedicationLogs(data || []);
    } catch (error) {
      console.error('Error fetching medication logs:', error);
    }
  };

  const handleConfirmMedication = async (medicationId: string) => {
    try {
      const { error } = await supabase
        .from('medication_logs')
        .insert({
          medication_id: medicationId,
          taken_at: new Date().toISOString()
        });

      if (error) throw error;
      
      fetchMedicationLogs();
    } catch (error) {
      console.error('Error confirming medication:', error);
    }
  };

  const isMedicationTaken = (medicationId: string, medicationTime: string) => {
    const today = new Date();
    const [hours, minutes] = medicationTime.split(':');
    const medicationDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
    
    return medicationLogs.some(log => {
      const logDate = new Date(log.taken_at);
      const logMedicationTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), logDate.getHours(), logDate.getMinutes());
      
      return log.medication_id === medicationId && 
             Math.abs(logMedicationTime.getTime() - medicationDateTime.getTime()) < 30 * 60 * 1000; // 30 minutes tolerance
    });
  };

  const getAvailableMedications = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return todayMedications.filter(med => {
      const [hours, minutes] = med.time.split(':');
      const medicationTime = parseInt(hours) * 60 + parseInt(minutes);
      const timeDiff = Math.abs(currentTime - medicationTime);
      
      // Show medication if it's within 30 minutes of the scheduled time and not taken yet
      return timeDiff <= 30 && !isMedicationTaken(med.id, med.time);
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  const availableMedications = getAvailableMedications();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          {/* Lembretes de Remédio */}
          {availableMedications.length > 0 ? (
            availableMedications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Pill className="h-6 w-6 text-blue-600 mr-4" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Lembrete de Remédio</p>
                    <p className="text-gray-600">{medication.name} - {medication.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleConfirmMedication(medication.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirmar
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Pill className="h-6 w-6 text-blue-600 mr-4" />
              <div>
                <p className="text-lg font-medium text-gray-900">Lembretes de Remédio</p>
                <p className="text-gray-600">Nenhum remédio pendente no momento</p>
              </div>
            </div>
          )}

          {/* Jogo da Memória */}
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <GamepadIcon className="h-6 w-6 text-blue-600 mr-4" />
            <div>
              <p className="text-lg font-medium text-gray-900">Jogo da Memória</p>
              <p className="text-gray-600">Melhor pontuação: 85 pontos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;