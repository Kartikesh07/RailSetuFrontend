import React from 'react';
import { FaTrain, FaQuestionCircle } from 'react-icons/fa';

// The Header now needs to be able to trigger the tour, so we pass down a function for it.
const Header = ({ sectionName, lastUpdated, onOpenTour }) => {
  const formattedTime = new Date(lastUpdated).toLocaleString();
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <div className="flex items-center gap-3">
          <FaTrain className="text-3xl text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Railway AI Decision Support</h1>
        </div>
        <p className="text-gray-400 mt-1">
          Live monitoring for the <span className="font-semibold text-cyan-300">{sectionName}</span> section.
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center gap-4">
        {/* NEW "HELP/GUIDE" BUTTON */}
        <button 
            onClick={onOpenTour} 
            className="flex items-center gap-2 text-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-md transition-colors"
            title="Show Guide"
        >
          <FaQuestionCircle />
          <span className="hidden sm:inline">Quick Guide</span>
        </button>
        <div className="text-left sm:text-right">
            <span className="inline-block bg-green-500/20 text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              ● LIVE
            </span>
            <p className="text-sm text-gray-500 mt-1">Last Updated: {formattedTime}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;