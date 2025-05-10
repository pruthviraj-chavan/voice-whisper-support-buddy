
import React from "react";

interface AudioWavesProps {
  visible: boolean;
}

const AudioWaves: React.FC<AudioWavesProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="flex items-end justify-center h-6 space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1 bg-isp-500 rounded-full animate-wave-${i}`}
          style={{ height: '16px', minWidth: '3px' }}
        ></div>
      ))}
    </div>
  );
};

export default AudioWaves;
