import React from 'react';
import Header from './Header';
import MetricCards from './MetricCards';
import LiveTrackView from './LiveTrackView';
import TrainDataTable from './TrainDataTable';

const Dashboard = ({ reportData }) => {
  const { timestamp, section, metrics, decisions, trains, stations } = reportData;
  const totalDistance = 455.3; // As defined in your backend

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-6">
        <Header sectionName={section} lastUpdated={timestamp} />
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
  );
};

export default Dashboard;