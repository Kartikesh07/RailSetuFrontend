import React from 'react';
import { FaTrain } from 'react-icons/fa';

const Header = ({ sectionName, lastUpdated }) => {
  const formattedTime = new Date(lastUpdated).toLocaleString();
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <div className="flex items-center gap-3">
          <FaTrain className="text-3xl text-cyan-400" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Railway AI Decision Support</h1>
        </div>
        <p className="text-gray-400 mt-1">
          Live monitoring for the <span className="font-semibold text-cyan-300">{sectionName}</span> section.
        </p>
      </div>
      <div className="mt-4 sm:mt-0 text-right">
          <span className="inline-block bg-green-500/20 text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            ● LIVE
          </span>
          <p className="text-sm text-gray-500 mt-1">Last Updated: {formattedTime}</p>
      </div>
    </header>
  );
};

export default Header;