import React, { useState } from 'react';
import { FiX, FiArrowLeft, FiArrowRight, FiCpu, FiMap, FiActivity, FiDatabase } from 'react-icons/fi';

const tourSteps = [
  {
    icon: FiCpu,
    title: 'Welcome to the Railway AI Decision Support System',
    content: "This dashboard is a live simulation of an AI managing a railway section. The system generates realistic train traffic and uses a machine learning model to make optimal, real-time decisions to prevent delays and resolve conflicts.",
  },
  {
    icon: FiActivity,
    title: 'Real-Time Metrics',
    content: "At the top, you'll find Key Performance Indicators (KPIs) for the entire railway section. These cards give you an at-a-glance overview of the network's health, including the number of active trains, average delays, and how congested the critical bottleneck areas are.",
  },
  {
    icon: FiMap,
    title: 'Live Section View',
    content: "This is a visual map of the entire railway track. You can see the live position of every train (color-coded by its status), the location of all stations, and the highlighted red zones which represent single-line 'bottlenecks' where conflicts are most likely to occur.",
  },
  {
    icon: FiDatabase,
    title: 'AI-Powered Recommendations',
    content: "The table below lists all trains and, most importantly, the AI's recommendation for each one. Hover over a decision in the 'AI Recommendation' column to see the AI's reasoning and its confidence level. This makes the AI's logic transparent and understandable.",
  },
];

const WelcomeTour = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, tourSteps.length - 1));
  };

  const handlePrev = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };
  
  const handleClose = () => {
    // Set a flag in localStorage so the tour doesn't show again
    localStorage.setItem('hasViewedTour', 'true');
    onClose();
  };

  const currentStep = tourSteps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg text-white animate-fade-in-up">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-cyan-400">Quick Guide</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <FiX size={24} />
            </button>
        </div>
        
        <div className="p-8 text-center">
            <div className="flex justify-center items-center w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-6">
                <Icon size={32} className="text-cyan-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{currentStep.title}</h3>
            <p className="text-gray-300 leading-relaxed">{currentStep.content}</p>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl flex justify-between items-center">
            <div className="flex gap-1.5">
                {tourSteps.map((_, index) => (
                    <div 
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${step === index ? 'bg-cyan-400' : 'bg-slate-600'}`}
                    />
                ))}
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={handlePrev} 
                    disabled={step === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FiArrowLeft />
                    <span>Prev</span>
                </button>
                {step < tourSteps.length - 1 ? (
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors"
                    >
                        <span>Next</span>
                        <FiArrowRight />
                    </button>
                ) : (
                    <button 
                        onClick={handleClose}
                        className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Finish
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTour;