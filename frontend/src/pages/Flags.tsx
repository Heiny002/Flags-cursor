import React, { useState } from 'react';
import FooterNav from '../components/FooterNav';
import HotTakeCard from '../components/HotTakeCard';
import Header from '../components/Header';

interface HotTake {
  id: string;
  text: string;
  author: string;
  category: string;
}

const agreementLevels = [
  { value: 1, label: 'Strongly Disagree', color: 'bg-red-100 hover:bg-red-200' },
  { value: 2, label: 'Disagree', color: 'bg-orange-100 hover:bg-orange-200' },
  { value: 3, label: 'Neutral', color: 'bg-slate-100 hover:bg-slate-200' },
  { value: 4, label: 'Agree', color: 'bg-emerald-100 hover:bg-emerald-200' },
  { value: 5, label: 'Strongly Agree', color: 'bg-blue-100 hover:bg-blue-200' }
];

const Flags: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [matchRanges, setMatchRanges] = useState<Record<string, [number, number]>>({});
  const [dealbreakers, setDealbreakers] = useState<Record<string, boolean>>({});

  // Temporary mock data
  const hotTakes: HotTake[] = [
    {
      id: '1',
      text: 'Pineapple belongs on pizza',
      author: 'John Doe',
      category: 'Food'
    },
    {
      id: '2',
      text: 'Social media does more harm than good',
      author: 'Jane Smith',
      category: 'Technology'
    },
    {
      id: '3',
      text: 'Dogs are better than cats',
      author: 'Mike Johnson',
      category: 'Pets'
    }
  ];

  const handleResponseChange = (hotTakeId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [hotTakeId]: value
    }));
  };

  const handleMatchChange = (hotTakeId: string, value: [number, number]) => {
    setMatchRanges(prev => ({
      ...prev,
      [hotTakeId]: value
    }));
  };

  const handleDealbreakerChange = (hotTakeId: string, checked: boolean) => {
    setDealbreakers(prev => ({
      ...prev,
      [hotTakeId]: checked
    }));
  };

  const handleNext = () => {
    if (currentIndex < hotTakes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentHotTake = hotTakes[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-xl mx-auto px-4 py-6 pb-24 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hot Takes</h1>
        
        <div className="space-y-6">
          <HotTakeCard
            key={currentHotTake.id}
            title={currentHotTake.text}
            category={currentHotTake.category}
            onResponseChange={(value) => handleResponseChange(currentHotTake.id, value)}
            onMatchChange={(value) => handleMatchChange(currentHotTake.id, value)}
            onDealbreakerChange={(checked) => handleDealbreakerChange(currentHotTake.id, checked)}
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200
                ${currentIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === hotTakes.length - 1}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200
                ${currentIndex === hotTakes.length - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <FooterNav />
    </div>
  );
};

export default Flags; 