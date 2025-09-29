import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
// Import FiClock for the new loading state
import { FiLoader, FiAlertTriangle, FiClock } from 'react-icons/fi';
import './App.css';

function App() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW STATE FOR THE INTELLIGENT LOADER ---
  const [loadingMessage, setLoadingMessage] = useState("Connecting to the AI Decision System...");
  const [isLongLoad, setIsLongLoad] = useState(false);
  // useRef to hold the timer ID without causing re-renders
  const longLoadTimer = useRef(null);

  const fetchData = async () => {
    // We don't need to start the timer here, it starts on component mount.
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
      // --- CRUCIAL: Clear the timer when fetch is complete (success or fail) ---
      // This prevents the "long load" message from appearing after data has already loaded.
      clearTimeout(longLoadTimer.current);
    }
  };

  useEffect(() => {
    // --- SET UP THE TIMER FOR THE "PATIENT STAGE" ---
    // After 8 seconds, we'll assume it's a cold start on the server.
    longLoadTimer.current = setTimeout(() => {
      setLoadingMessage(
        "Waking up the AI server... This can take up to a minute on the first load as our free-tier service spins up from sleep. Thanks for your patience!"
      );
      setIsLongLoad(true); // Switch to the "patient" loading state
    }, 8000); // 8 seconds

    fetchData();
    
    const intervalId = setInterval(fetchData, 300000);

    // Cleanup function to clear both the timer and the interval on component unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(longLoadTimer.current);
    };
  }, []); // Empty array ensures this runs only once on mount

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
        {/* --- DYNAMIC ICON AND ANIMATION --- */}
        {isLongLoad ? (
          <FiClock className="animate-pulse text-4xl text-amber-400 mb-4" />
        ) : (
          <FiLoader className="animate-spin text-4xl text-cyan-400 mb-4" />
        )}
        {/* --- DYNAMIC LOADING MESSAGE --- */}
        <p className="text-lg max-w-md">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-amber-400 p-4 text-center">
        <FiAlertTriangle className="text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p>{error}</p>
        <button
          onClick={() => { 
            setIsLoading(true); 
            // Reset the loading states for the retry attempt
            setIsLongLoad(false);
            setLoadingMessage("Connecting to the AI Decision System...");
            // Re-run the entire effect hook logic
            fetchData();
            longLoadTimer.current = setTimeout(() => {
                setLoadingMessage("Waking up the AI server... This can take up to a minute on the first load as our free-tier service spins up from sleep. Thanks for your patience!");
                setIsLongLoad(true);
            }, 8000);
          }}
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