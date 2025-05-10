
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface MessageProps {
  content: string;
  isUser: boolean;
  intent?: string;
  confidence?: number;
}

const ChatMessage: React.FC<MessageProps> = ({ 
  content, 
  isUser, 
  intent, 
  confidence 
}) => {
  return (
    <div className={cn("flex w-full", 
      isUser ? "justify-end" : "justify-start"
    )}>
      <Card className={cn(
        "max-w-[80%] p-3 mb-2",
        isUser ? "bg-isp-500 text-white" : "bg-gray-100 text-gray-800"
      )}>
        <p className="text-sm">{content}</p>
        
        {!isUser && intent && confidence && confidence > 0.7 && (
          <p className="text-xs mt-2 text-gray-500">
            Detected intent: {intent.replace('intent_', '')} ({Math.round(confidence * 100)}% confidence)
          </p>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
