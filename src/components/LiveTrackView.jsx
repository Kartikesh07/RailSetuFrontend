import React from 'react';
import { FaTrain, FaMapMarkerAlt } from 'react-icons/fa';
import { GiCargoShip } from 'react-icons/gi';

const TrainMarker = ({ train, totalDistance }) => {
  const position = (train.current_km / totalDistance) * 100;
  const isReversed = train.origin === 'WDI';
  const TrainIcon = train.train_type === 'freight' ? GiCargoShip : FaTrain;

  const statusColors = {
    running: 'text-green-400',
    delayed: 'text-amber-400',
    stopped: 'text-red-500',
    scheduled: 'text-gray-500',
    completed: 'text-blue-500'
  };

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 group"
      style={{ left: `${position}%` }}
    >
      <TrainIcon
        className={`text-2xl cursor-pointer transition-transform duration-300 group-hover:scale-125 ${statusColors[train.status]}`}
        style={{ transform: `translate(-50%, -50%) ${isReversed ? 'scaleX(-1)' : ''}` }}
      />
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
        <p className="font-bold">{train.train_number} - {train.train_name}</p>
        <p>Status: <span className="font-semibold">{train.status}</span></p>
        <p>Speed: {train.speed.toFixed(0)} km/h</p>
        <p>Delay: {train.delay_minutes} min</p>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700"></div>
      </div>
    </div>
  );
};

const StationMarker = ({ station, totalDistance }) => {
  const position = (station.km / totalDistance) * 100;
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 h-full flex flex-col items-center group"
      style={{ left: `${position}%` }}
    >
      <div className="w-0.5 h-2.5 bg-slate-500"></div>
      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full border-2 border-slate-500"></div>
      <p className="absolute top-full mt-2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {station.name} ({station.code})
      </p>
    </div>
  );
};

const LiveTrackView = ({ trains, stations, totalDistance }) => {
    // Hardcoded from your backend data_models for visualization
    const singleLineSegments = [
        { start_km: 25.3, end_km: 45.8, name: "Hotgi-Indi" },
        { start_km: 142.3, end_km: 168.9, name: "Badami-Gadag" },
        { start_km: 325.2, end_km: 345.7, name: "Alnavar-Londa" },
    ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2">Live Section View</h2>
      <div className="flex justify-between text-sm font-semibold text-gray-300 mb-8">
        <span>SUR (Solapur)</span>
        <span>WDI (Wadi)</span>
      </div>
      <div className="relative h-12">
        {/* Main Track Line */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-slate-600 rounded-full"></div>

        {/* Bottleneck Segments */}
        {singleLineSegments.map(segment => (
          <div key={segment.name}
            className="absolute top-1/2 -translate-y-1/2 h-3 bg-red-500/30 rounded-full border border-red-500/50 group"
            style={{
                left: `${(segment.start_km / totalDistance) * 100}%`,
                width: `${((segment.end_km - segment.start_km) / totalDistance) * 100}%`
            }}>
             <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-300 bg-red-900/50 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Bottleneck: {segment.name}
             </span>
          </div>
        ))}

        {/* Stations */}
        {stations.map(station => (
          <StationMarker key={station.code} station={station} totalDistance={totalDistance} />
        ))}
        
        {/* Trains */}
        {trains
            .filter(train => train.status !== 'scheduled' && train.status !== 'completed')
            .map(train => (
              <TrainMarker key={train.train_number} train={train} totalDistance={totalDistance} />
        ))}
      </div>
    </div>
  );
};

export default LiveTrackView;