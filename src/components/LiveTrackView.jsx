import React, { useState, useEffect } from 'react';
import { FaTrain, FaMapMarkerAlt } from 'react-icons/fa';
import { GiCargoShip } from 'react-icons/gi';

// ===================================================================
// 1. HELPER HOOK TO DETECT SCREEN SIZE
// ===================================================================
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};


// ===================================================================
// 2. DESKTOP-ONLY COMPONENTS
// ===================================================================
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
    <div className="absolute top-1/2 -translate-y-1/2 group" style={{ left: `${position}%` }}>
      <TrainIcon className={`text-2xl cursor-pointer transition-transform duration-300 group-hover:scale-125 ${statusColors[train.status]}`} style={{ transform: `translate(-50%, -50%) ${isReversed ? 'scaleX(-1)' : ''}` }}/>
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
        <p className="font-bold">{train.train_number} - {train.train_name}</p>
        <p>Status: <span className="font-semibold">{train.status}</span></p>
        <p>Speed: {(train.speed || 0).toFixed(0)} km/h</p><p>Delay: {train.delay_minutes || 0} min</p>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700"></div>
      </div>
    </div>
  );
};

const StationMarker = ({ station, totalDistance }) => {
  const position = (station.km / totalDistance) * 100;
  return (
    <div className="absolute top-1/2 -translate-y-1/2 h-full flex flex-col items-center group" style={{ left: `${position}%` }} >
      <div className="w-0.5 h-2.5 bg-slate-500"></div>
      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full border-2 border-slate-500"></div>
      <p className="absolute top-full mt-2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{station.name} ({station.code})</p>
    </div>
  );
};


// ===================================================================
// 3. DESKTOP VIEW COMPONENT (The horizontal track map)
// ===================================================================
const DesktopTrackView = ({ trains, stations, totalDistance }) => {
    const singleLineSegments = [
        { start_km: 25.3, end_km: 45.8, name: "Hotgi-Indi" },
        { start_km: 142.3, end_km: 168.9, name: "Badami-Gadag" },
    ];

    return (
        <div className="overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">Live Section View</h2>
            <div className="flex justify-between text-sm font-semibold text-gray-300 mb-8">
                <span>SUR (Solapur)</span>
                <span>WDI (Wadi)</span>
            </div>
            <div className="relative h-12 px-4">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-slate-600 rounded-full left-0"></div>
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
                {stations.map(station => (
                    <StationMarker key={station.code} station={station} totalDistance={totalDistance} />
                ))}
                {trains
                    .filter(train => train.status !== 'scheduled' && train.status !== 'completed')
                    .map(train => (
                        <TrainMarker key={train.train_number} train={train} totalDistance={totalDistance} />
                    ))
                }
            </div>
        </div>
    );
};


// ===================================================================
// 4. MOBILE VIEW COMPONENT (The new vertical list)
// ===================================================================
const MobileTrackListView = ({ trains, stations, totalDistance }) => {
    const trackItems = React.useMemo(() => {
        const items = [
            ...trains
                .filter(train => train.status !== 'scheduled' && train.status !== 'completed')
                .map(train => ({ ...train, type: 'train', km: train.current_km })),
            ...stations.map(station => ({ ...station, type: 'station', km: station.km_from_start })),
        ];
        // FIX: Add defensive check for sorting to prevent errors if `km` is missing.
        items.sort((a, b) => (a.km || 0) - (b.km || 0));
        return items;
    }, [trains, stations]);

    const TrackListItem = ({ item }) => {
        if (item.type === 'station') {
            return (
                <div className="flex items-center gap-4 py-2 px-3 border-b border-slate-700/50">
                    <FaMapMarkerAlt className="text-slate-400 text-lg flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-300">{item.name}</p>
                    </div>
                    {/* FIX: Add fallback for `km` to prevent crash. */}
                    <p className="text-xs font-mono text-slate-500">{(item.km || 0).toFixed(1)} km</p>
                </div>
            );
        }

        const isReversed = item.origin === 'WDI';
        const TrainIcon = item.train_type === 'freight' ? GiCargoShip : FaTrain;
        // FIX: Add fallback for `current_km` to prevent crash.
        const progress = ((item.current_km || 0) / totalDistance) * 100;
        
        const statusStyles = {
            running: { text: "text-green-300", bg: "bg-green-500/20" },
            delayed: { text: "text-amber-300", bg: "bg-amber-500/20" },
            stopped: { text: "text-red-300", bg: "bg-red-500/20" },
        };
        const style = statusStyles[item.status] || { text: 'text-gray-400', bg: 'bg-gray-500/20' };

        return (
            <div className="flex flex-col gap-2 py-3 px-3 border-b border-slate-700/50 bg-slate-800/20">
                <div className="flex items-center gap-3">
                    <TrainIcon className={`text-xl flex-shrink-0 ${style.text}`} style={{ transform: isReversed ? 'scaleX(-1)' : '' }} />
                    <div className="flex-grow">
                        <p className="font-bold text-white leading-tight">{item.train_number}</p>
                        <p className="text-xs text-gray-400 leading-tight">{item.train_name}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${style.bg} ${style.text}`}>
                        {item.status}
                    </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                    {/* FIX: Add fallback for `speed` to prevent crash. THIS IS THE LINE FROM THE ERROR. */}
                    <span>Speed: <span className="font-semibold text-slate-200">{(item.speed || 0).toFixed(0)} km/h</span></span>
                    {/* FIX: Add fallback for `delay_minutes` to prevent crash and display correctly. */}
                    <span>Delay: <span className={`font-semibold ${(item.delay_minutes || 0) > 15 ? 'text-red-400' : 'text-green-400'}`}>{item.delay_minutes || 0} min</span></span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-2">
            <h2 className="text-xl font-bold text-white mb-2 px-2 pt-2">Live Section View</h2>
            <div className="max-h-[400px] overflow-y-auto rounded-md">
                {trackItems.map((item, index) => <TrackListItem key={`${item.type}-${item.train_number || item.code}-${index}`} item={item} />)}
            </div>
        </div>
    );
};


// ===================================================================
// 5. MAIN COMPONENT (The smart one that swaps layouts)
// ===================================================================
const LiveTrackView = ({ trains, stations, totalDistance }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <DesktopTrackView trains={trains} stations={stations} totalDistance={totalDistance} />
  ) : (
    <MobileTrackListView trains={trains} stations={stations} totalDistance={totalDistance} />
  );
};

export default LiveTrackView;