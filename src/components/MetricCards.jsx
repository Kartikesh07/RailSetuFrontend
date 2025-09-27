import React from 'react';
import { FiActivity, FiClock, FiGitMerge, FiSend, FiList } from 'react-icons/fi';

const MetricCard = ({ icon, title, value, unit, color }) => {
  const IconComponent = icon;
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${color.bg}`}>
          <IconComponent className={`text-2xl ${color.text}`} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">
            {value} <span className="text-base font-normal text-gray-400">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const MetricCards = ({ metrics }) => {
  const metricData = [
    { icon: FiActivity, title: "Active Trains", value: metrics.active_trains, unit: "", color: { bg: 'bg-cyan-500/20', text: 'text-cyan-300' } },
    { icon: FiClock, title: "Average Delay", value: metrics.average_delay_minutes, unit: "min", color: { bg: 'bg-amber-500/20', text: 'text-amber-300' } },
    { icon: FiSend, title: "Average Speed", value: metrics.average_speed_kmh, unit: "km/h", color: { bg: 'bg-green-500/20', text: 'text-green-300' } },
    { icon: FiGitMerge, title: "Bottleneck Usage", value: `${(metrics.bottleneck_utilization * 100).toFixed(0)}%`, unit: "", color: { bg: 'bg-red-500/20', text: 'text-red-300' } },
    { icon: FiList, title: "Total Scheduled", value: metrics.total_scheduled_trains, unit: "trains", color: { bg: 'bg-indigo-500/20', text: 'text-indigo-300' } },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metricData.map(metric => <MetricCard key={metric.title} {...metric} />)}
    </div>
  );
};

export default MetricCards;