import React, { useState, useEffect } from 'react';
import Header from './Header';
import MetricCards from './MetricCards';
import LiveTrackView from './LiveTrackView';
import TrainDataTable from './TrainDataTable';
import WelcomeTour from './WelcomeTour'; // Import the new component

const Dashboard = ({ reportData }) => {
  const { timestamp, section, metrics, decisions, trains, stations } = reportData;
  const totalDistance = 455.3;

  // State to manage the visibility of the welcome tour modal
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Check localStorage to see if the user has already seen the tour.
    const hasViewedTour = localStorage.getItem('hasViewedTour');
    if (!hasViewedTour) {
      // If they haven't, open the tour automatically.
      setIsTourOpen(true);
    }
  }, []); // The empty dependency array ensures this runs only once on component mount.

  return (
    <>
      {/* Conditionally render the WelcomeTour modal if isTourOpen is true */}
      {isTourOpen && <WelcomeTour onClose={() => setIsTourOpen(false)} />}
      
      <main className="p-4 md:p-6 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Pass the function to open the tour down to the Header */}
          <Header 
            sectionName={section} 
            lastUpdated={timestamp} 
            onOpenTour={() => setIsTourOpen(true)}
          />
          <MetricCards metrics={metrics} />
          <LiveTrackView 
            trains={trains} 
            stations={stations} 
            totalDistance={totalDistance} 
          />
          <TrainDataTable 
            trains={trains} 
            decisions={decisions} 
            totalDistance={totalDistance}
          />
        </div>
      </main>
    </>
  );
};

export default Dashboard;