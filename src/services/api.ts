
import { toast } from "@/components/ui/use-toast";

const BASE_URL = "http://localhost:5000";

export interface ApiResponse {
  intent: string;
  response: string;
  confidence: number;
}

export const sendVoiceQuery = async (text: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        title: "Error processing your request",
        description: errorData.message || "Something went wrong",
      });
      
      return {
        intent: "intent_unknown",
        response: "Sorry, I'm having trouble understanding your request. Would you like to speak to a human representative?",
        confidence: 0
      };
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    toast({
      variant: "destructive",
      title: "Connection error",
      description: "Couldn't connect to our support system. Please try again later.",
    });
    
    return {
      intent: "intent_unknown",
      response: "I'm having trouble connecting to our support system. Please try again later or call our support line.",
      confidence: 0
    };
  }
};
