
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import MicrophoneButton from "./MicrophoneButton";
import AudioWaves from "./AudioWaves";
import ChatMessage, { MessageProps } from "./ChatMessage";
import speechService from "@/services/speechService";
import { sendVoiceQuery, ApiResponse } from "@/services/api";

const ChatInterface: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState<string>("");
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      content: "Hello! I'm your ISP support assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech service status callback
    speechService.setStatusCallback(setStatus);
    
    // Add welcome message
    const welcomeMessage = "Welcome to our ISP support assistant. You can ask me about internet issues, bill payment, or contact support. Click the microphone to speak.";
    setTimeout(() => {
      speechService.speak(welcomeMessage);
    }, 500);
  }, []);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMicClick = async () => {
    if (status === 'listening') {
      speechService.stopListening();
      return;
    }

    try {
      await speechService.startListening((text) => {
        setTranscript(text);
      });
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast({
        title: "Speech Recognition Error",
        description: "We couldn't access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Process transcript when it's finalized and status changes to processing
  useEffect(() => {
    const processTranscript = async () => {
      if (status === 'processing' && transcript) {
        // Add user message
        setMessages((prev) => [
          ...prev,
          { content: transcript, isUser: true },
        ]);
        
        try {
          // Get response from API
          const response: ApiResponse = await sendVoiceQuery(transcript);
          
          // Add assistant message
          setMessages((prev) => [
            ...prev,
            { 
              content: response.response, 
              isUser: false,
              intent: response.intent,
              confidence: response.confidence
            },
          ]);
          
          // Speak the response
          await speechService.speak(response.response);
          
          // Reset transcript
          setTranscript("");
        } catch (error) {
          console.error("Failed to process query:", error);
          toast({
            title: "Processing Error",
            description: "Failed to process your query. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    processTranscript();
  }, [status, transcript]);

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full border rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-isp-700 text-white p-4">
          <h2 className="text-lg font-medium">ISP Customer Support</h2>
          <p className="text-sm opacity-80">Voice-enabled assistant</p>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-2">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                isUser={message.isUser}
                intent={message.intent}
                confidence={message.confidence}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Voice input area */}
        <div className="p-4 border-t bg-white">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Show transcript when listening */}
            {(status === 'listening' || status === 'processing') && transcript && (
              <div className="w-full p-2 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">"{transcript}"</p>
              </div>
            )}
            
            {/* Audio visualization */}
            <AudioWaves visible={status === 'listening'} />
            
            {/* Status text */}
            <div className="h-6 text-sm text-gray-500">
              {status === 'idle' && "Press the button to speak"}
              {status === 'listening' && "Listening..."}
              {status === 'processing' && "Processing..."}
              {status === 'speaking' && "Speaking..."}
            </div>
            
            {/* Microphone button */}
            <MicrophoneButton
              isListening={status === 'listening'}
              isProcessing={status === 'processing' || status === 'speaking'}
              onClick={handleMicClick}
            />
            
            {/* Contact support button */}
            <Button 
              variant="outline" 
              className="mt-2 text-sm"
              onClick={() => {
                setMessages(prev => [
                  ...prev,
                  { 
                    content: "I'd like to speak with a human representative.", 
                    isUser: true 
                  },
                  { 
                    content: "I'll connect you with one of our support agents. Please hold while I transfer your call.", 
                    isUser: false 
                  }
                ]);
                
                toast({
                  title: "Support Request Initiated",
                  description: "A support agent would be connected in a real implementation.",
                });
              }}
            >
              Contact human support
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
