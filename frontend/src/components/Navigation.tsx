import React, { useState, useEffect } from 'react';
import { Home, Bell } from 'lucide-react';
import FontButton from './FontButton';
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

const Navigation: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [todayMedications, setTodayMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);

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

  const isMedicationTaken = (medicationId: string, medicationTime: string) => {
    const today = new Date();
    const [hours, minutes] = medicationTime.split(':');
    const medicationDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
    
    return medicationLogs.some(log => {
      const logDate = new Date(log.taken_at);
      const logMedicationTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), logDate.getHours(), logDate.getMinutes());
      
      return log.medication_id === medicationId && 
             Math.abs(logMedicationTime.getTime() - medicationDateTime.getTime()) < 30 * 60 * 1000;
    });
  };

  const getAvailableMedications = () => {
    return todayMedications.filter(med => !isMedicationTaken(med.id, med.time));
  };

  const availableMedications = getAvailableMedications();

  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Esquerda - Ícone e Início */}
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="#"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium"
                >
                  Início
                </a>
              </div>
            </div>

            {/* Direita - Botão de Fonte e Notificações */}
            <div className="flex items-center gap-4">
              <FontButton />
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 relative"
                >
                  <span className="sr-only">Ver notificações</span>
                  <Bell className="h-6 w-6" />
                  {availableMedications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {availableMedications.length}
                    </span>
                  )}
                </button>

                {/* Dropdown de Notificações */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Lembretes de Hoje</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {availableMedications.length > 0 ? (
                        availableMedications.map((medication) => (
                          <div key={medication.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{medication.name}</p>
                                <p className="text-sm text-gray-600">{medication.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Nenhum lembrete pendente
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;