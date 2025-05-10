
import React from "react";
import ChatInterface from "@/components/ChatInterface";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-isp-800 mb-2">ISP Customer Support</h1>
          <p className="text-gray-600">
            Voice-enabled assistant to help with your internet service needs
          </p>
        </div>
        
        <div className="h-[600px]">
          <ChatInterface />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This is a prototype demonstration of an ISP customer support assistant.
            <br />
            You can ask about internet issues, bill payments, or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
