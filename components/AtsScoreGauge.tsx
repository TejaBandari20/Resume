
import React from 'react';

interface AtsScoreGaugeProps {
  score: number;
}

const AtsScoreGauge: React.FC<AtsScoreGaugeProps> = ({ score }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s < 40) return 'text-red-500';
    if (s < 75) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getTrackColor = (s: number) => {
    if (s < 40) return 'stroke-red-500';
    if (s < 75) return 'stroke-yellow-500';
    return 'stroke-green-500';
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`transition-all duration-1000 ease-out ${getTrackColor(score)}`}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Score</span>
      </div>
    </div>
  );
};

export default AtsScoreGauge;
