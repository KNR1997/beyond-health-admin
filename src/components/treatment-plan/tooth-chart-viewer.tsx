// components/ui/tooth-chart-viewer.tsx
import { useState } from 'react';
import Image from 'next/image';
// import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/button';

interface ToothChartViewerProps {
  toothNumber: string;
  onToothSelect?: (toothNumber: string) => void;
}

export default function ToothChartViewer({
  toothNumber,
  onToothSelect,
}: ToothChartViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(toothNumber || '');

  // Sample tooth data - you can expand this based on your needs
  const toothNumbers = {
    upper: {
      right: ['18', '17', '16', '15', '14', '13', '12', '11'],
      left: ['21', '22', '23', '24', '25', '26', '27', '28'],
    },
    lower: {
      right: ['48', '47', '46', '45', '44', '43', '42', '41'],
      left: ['31', '32', '33', '34', '35', '36', '37', '38'],
    },
  };

  const handleToothClick = (toothNum: string) => {
    setSelectedTooth(toothNum);
    if (onToothSelect) {
      onToothSelect(toothNum);
    }
    // Optionally close the viewer after selection
    // setIsOpen(false);
  };

  const ToothGrid = ({ teeth, label }: { teeth: string[]; label: string }) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{label}</h4>
      <div className="grid grid-cols-8 gap-1">
        {teeth.map((tooth) => (
          <button
            key={tooth}
            onClick={() => handleToothClick(tooth)}
            className={`
              p-2 text-xs font-medium rounded border transition-all duration-200
              ${
                selectedTooth === tooth
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-gray-200 hover:border-primary hover:bg-gray-50'
              }
            `}
          >
            {tooth}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Viewer trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-1 text-gray-400 hover:text-primary transition-colors duration-200"
        title="View tooth chart"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>

      {/* Modal/Viewer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl p-6">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {/* <XMarkIcon className="w-6 h-6" /> */}
              icon
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">Tooth Chart</h3>
              <p className="text-sm text-gray-500">
                Click on a tooth number to select it
              </p>
              {selectedTooth && (
                <p className="text-sm text-primary font-medium mt-1">
                  Selected: Tooth #{selectedTooth}
                </p>
              )}
            </div>

            {/* Tooth Chart */}
            <div className="space-y-6">
              {/* Upper jaw */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Upper Jaw
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ToothGrid teeth={toothNumbers.upper.right} label="Right" />
                  <ToothGrid teeth={toothNumbers.upper.left} label="Left" />
                </div>
              </div>

              {/* Lower jaw */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Lower Jaw
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ToothGrid teeth={toothNumbers.lower.right} label="Right" />
                  <ToothGrid teeth={toothNumbers.lower.left} label="Left" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <Button type="button" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
