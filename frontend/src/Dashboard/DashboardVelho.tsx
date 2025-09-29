import React from 'react';
import RecentActivities from '../Desktop/components/RecentActivities';
import Navigation from '../Desktop/components/Navigation';
import WelcomeSection from '../Desktop/components/WelcomeSection';
import MainPageComponents from '../Desktop/components/MainPageComponents';
import Footer from '../Desktop/components/Footer';

const DashboardVelho: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation/>

      <WelcomeSection/>

      <MainPageComponents/>

      <RecentActivities/>
   
      <Footer />
    </div>
  );
};

export default DashboardVelho;