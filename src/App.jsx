import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import './App.css';

function App() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/live_report`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReportData(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch report data:", e);
      setError("Failed to connect to the backend. Please ensure it's running and accessible.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 300000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <FiLoader className="animate-spin text-4xl text-cyan-400 mb-4" />
        <p className="text-lg">Loading Railway AI Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-amber-400">
        <FiAlertTriangle className="text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p>{error}</p>
        <button
          onClick={() => { setIsLoading(true); fetchData(); }}
          className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-gray-200 min-h-screen font-sans">
      {reportData && <Dashboard reportData={reportData} />}
    </div>
  );
}

export default App;
