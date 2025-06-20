import React from 'react';
import RecentActivities from '../components/RecentActivities';
import Navigation from '../components/Navigation';
import WelcomeSection from '../components/WelcomeSection';
import MainPageComponents from '../components/MainPageComponents';
import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
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

export default Dashboard;