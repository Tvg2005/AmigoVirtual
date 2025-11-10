import React from 'react';
import { X } from 'lucide-react';
import { AchievementNotification as NotificationType } from '../types/achievements';

interface AchievementNotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ notification, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white border-l-4 border-yellow-400 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in-right z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{notification.achievement.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-green-800 text-sm">Conquista Desbloqueada!</h4>
            <h5 className="font-semibold text-blue-800 text-sm">{notification.achievement.title}</h5>
            <p className="text-blue-600 text-xs mt-1">{notification.achievement.description}</p>
            <p className="text-gray-500 text-xs mt-1">
              {notification.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;