import { useMemo } from 'react';

interface ProgressStepsProps {
  steps: string[];
  current: string;
  labels: Record<string, string>;
}

export default function ProgressSteps({ steps, current, labels }: ProgressStepsProps) {
  const currentIdx = Math.max(0, steps.indexOf(current));
  const percent = useMemo(() => {
    const denom = Math.max(1, steps.length - 1);
    return Math.min(100, Math.max(0, (currentIdx / denom) * 100));
  }, [steps, currentIdx]);

  return (
    <div className="relative w-full py-6 px-2">
      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-lg shadow-blue-500/50"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2">
        <div className="flex justify-between">
          {steps.map((step, idx) => {
            const isReached = idx <= currentIdx;
            return (
              <div key={step} className="relative">
                <div className={`absolute -top-9 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap px-2 py-1 rounded-md transition-colors ${isReached ? 'text-blue-300 bg-blue-500/10' : 'text-gray-500'}`}>
                  {labels[step]}
                </div>
                <div className="relative">
                  <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${isReached ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/50' : 'bg-gray-800 border-gray-600'}`} />
                  {isReached && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


