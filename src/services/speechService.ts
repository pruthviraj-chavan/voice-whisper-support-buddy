
type SpeechCallback = (transcript: string) => void;
type StatusCallback = (status: 'idle' | 'listening' | 'processing' | 'speaking') => void;

class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesisUtterance | null = null;
  private isListening = false;
  private statusCallback: StatusCallback | null = null;

  constructor() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    // Initialize speech synthesis
    this.speechSynthesis = new SpeechSynthesisUtterance();
  }

  public setStatusCallback(callback: StatusCallback) {
    this.statusCallback = callback;
  }

  private updateStatus(status: 'idle' | 'listening' | 'processing' | 'speaking') {
    if (this.statusCallback) {
      this.statusCallback(status);
    }
  }

  public startListening(callback: SpeechCallback): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not supported');
        return;
      }

      if (this.isListening) {
        this.stopListening();
      }

      let finalTranscript = '';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateStatus('listening');
        console.log('Speech recognition started');
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // If we have interim results, show them
        if (interimTranscript) {
          callback(interimTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.updateStatus('idle');
        console.error('Speech recognition error', event.error);
        reject(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateStatus('processing');
        console.log('Speech recognition ended');
        
        if (finalTranscript) {
          callback(finalTranscript);
          resolve();
        } else {
          reject('No speech detected');
        }
      };

      this.recognition.start();
    });
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.speechSynthesis) {
        this.speechSynthesis = new SpeechSynthesisUtterance();
      }
      
      this.updateStatus('speaking');
      
      this.speechSynthesis.text = text;
      this.speechSynthesis.lang = 'en-US';
      
      this.speechSynthesis.onend = () => {
        this.updateStatus('idle');
        resolve();
      };
      
      window.speechSynthesis.speak(this.speechSynthesis);
    });
  }
}

export default new SpeechService();
