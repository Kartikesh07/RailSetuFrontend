import React, { useState, useMemo } from 'react';
import { 
    FaTrain, FaArrowUp, FaArrowDown, FaRobot, FaCheckCircle, FaExclamationTriangle, 
    FaTimesCircle, FaAngleDoubleRight, FaStopCircle, FaSearch, FaFilter, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { GiCargoShip } from 'react-icons/gi';

const ITEMS_PER_PAGE = 8;

const getDecisionInfo = (decision) => {
    switch (decision) {
        case 'Proceed normally': return { icon: FaCheckCircle, color: 'text-green-400', isCritical: false };
        case 'Reduce speed': return { icon: FaAngleDoubleRight, color: 'text-amber-400', isCritical: true };
        case 'Stop at next station': return { icon: FaStopCircle, color: 'text-orange-400', isCritical: true };
        case 'Give priority': return { icon: FaExclamationTriangle, color: 'text-yellow-300', isCritical: true };
        case 'Hold/Reroute': return { icon: FaTimesCircle, color: 'text-red-500', isCritical: true };
        default: return { icon: FaRobot, color: 'text-gray-400', isCritical: false };
    }
};

const TrainRow = ({ train, decision, totalDistance }) => {
  const progress = (train.current_km / totalDistance) * 100;
  const decisionInfo = decision ? getDecisionInfo(decision.decision) : getDecisionInfo('');
  const DecisionIcon = decisionInfo.icon;

  const statusStyle = {
    running: "bg-green-500/20 text-green-300",
    delayed: "bg-amber-500/20 text-amber-300",
    stopped: "bg-red-500/20 text-red-300",
    scheduled: "bg-gray-500/20 text-gray-300",
    completed: "bg-blue-500/20 text-blue-300",
  };

  const TrainIcon = train.train_type === 'freight' ? GiCargoShip : FaTrain;

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
      <td className="p-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <TrainIcon className="text-xl text-cyan-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-white leading-tight">{train.train_number}</p>
            <p className="text-xs text-gray-400 leading-tight">{train.train_name}</p>
          </div>
        </div>
      </td>
      <td className="p-3">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{train.origin}</span>
          <span>{`${train.current_km.toFixed(1)}km`}</span>
          <span>{train.destination}</span>
        </div>
      </td>
      <td className="p-3 text-center">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyle[train.status]}`}>
          {train.status}
        </span>
      </td>
      <td className={`p-3 text-center font-mono ${train.delay_minutes > 15 ? 'text-red-400' : 'text-green-400'}`}>
        {train.delay_minutes} min
      </td>
      <td className="p-3">
        {decision ? (
          <div className="flex items-center gap-2 group relative">
            <DecisionIcon className={`text-lg ${decisionInfo.color}`} />
            <span className={`hidden lg:inline ${decisionInfo.color}`}>{decision.decision}</span>
            <div className="absolute bottom-full mb-2 -left-1/2 w-64 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
              <p className="font-bold">Reasoning:</p>
              <p className="mb-2">{decision.reasoning}</p>
              <p>Confidence: <span className="font-semibold text-cyan-300">{(decision.confidence * 100).toFixed(0)}%</span></p>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700"></div>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">No data</span>
        )}
      </td>
    </tr>
  );
};

const SortableHeader = ({ children, column, sortConfig, onSort }) => {
    const isSorted = sortConfig.key === column;
    const Icon = isSorted ? (sortConfig.direction === 'ascending' ? FaArrowUp : FaArrowDown) : null;
    return (
        <th scope="col" className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort(column)}>
            <div className="flex items-center gap-2">
                {children}
                {Icon && <Icon className="text-cyan-400" />}
            </div>
        </th>
    );
}

const TrainDataTable = ({ trains, decisions, totalDistance }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'delay_minutes', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAndSortedTrains = useMemo(() => {
    let filteredTrains = trains
      .filter(train => {
        const decisionInfo = decisions[train.train_number] ? getDecisionInfo(decisions[train.train_number].decision) : { isCritical: false };
        if (statusFilter === "all") return true;
        if (statusFilter === "critical") return decisionInfo.isCritical;
        return train.status === statusFilter;
      })
      .filter(train => 
        train.train_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.train_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortConfig.key !== null) {
      filteredTrains.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filteredTrains;
  }, [trains, decisions, statusFilter, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const totalPages = Math.ceil(filteredAndSortedTrains.length / ITEMS_PER_PAGE);
  const paginatedTrains = filteredAndSortedTrains.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg">
      {/* RESPONSIVE CHANGE: Controls stack vertically on mobile (flex-col) and become a row on small screens and up (sm:flex-row) */}
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-white self-start sm:self-center">Active Train Details</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Search train..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-slate-700/50 border border-slate-600 rounded-md py-2 pl-9 pr-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none w-full sm:w-48"
            />
          </div>
          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto">
             <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
             <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-700/50 border border-slate-600 rounded-md py-2 pl-9 pr-8 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none w-full sm:w-auto"
            >
                <option value="all">All Statuses</option>
                <option value="running">Running</option>
                <option value="delayed">Delayed</option>
                <option value="stopped">Stopped</option>
                <option value="critical">Critical AI Decision</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* RESPONSIVE CHANGE: This div allows the table to scroll horizontally on small screens instead of breaking the layout. */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800 sticky top-0">
            <tr>
              <SortableHeader column="train_number" sortConfig={sortConfig} onSort={requestSort}><span className="whitespace-nowrap">Train</span></SortableHeader>
              <th scope="col" className="p-3 w-1/4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"><span className="whitespace-nowrap">Journey Progress</span></th>
              <SortableHeader column="status" sortConfig={sortConfig} onSort={requestSort}><span className="whitespace-nowrap">Status</span></SortableHeader>
              <SortableHeader column="delay_minutes" sortConfig={sortConfig} onSort={requestSort}><span className="whitespace-nowrap">Delay</span></SortableHeader>
              <th scope="col" className="p-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"><span className="whitespace-nowrap">AI Recommendation</span></th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/30">
            {paginatedTrains.length > 0 ? (
                paginatedTrains.map(train => (
                  <TrainRow
                    key={train.train_number}
                    train={train}
                    decision={decisions[train.train_number]}
                    totalDistance={totalDistance}
                  />
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                        No trains match your criteria.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-700 flex justify-between items-center text-sm text-gray-400">
            <span>Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaChevronLeft />
                </button>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TrainDataTable;