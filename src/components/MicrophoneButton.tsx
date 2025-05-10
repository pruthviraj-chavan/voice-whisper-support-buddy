
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  isProcessing,
  onClick,
}) => {
  return (
    <div className="relative">
      {isListening && (
        <div className="absolute inset-0 rounded-full bg-isp-500/30 animate-pulse-ring"></div>
      )}
      <Button
        size="lg"
        disabled={isProcessing}
        variant={isListening ? "destructive" : "default"}
        className={`rounded-full w-16 h-16 flex items-center justify-center p-0 shadow-lg ${
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-isp-500 hover:bg-isp-600"
        }`}
        onClick={onClick}
      >
        {isListening ? (
          <MicOff className="h-7 w-7" />
        ) : (
          <Mic className="h-7 w-7" />
        )}
      </Button>
    </div>
  );
};

export default MicrophoneButton;
