
# ISP Voice/Text Customer Support Assistant

This project demonstrates a voice-enabled customer support assistant for an Internet Service Provider (ISP). It allows users to interact via voice in a browser interface, processes their queries using natural language processing, and provides appropriate responses.

## Features

- Voice recording interface using Web Speech API
- Speech-to-text conversion
- Intent recognition using Wit.ai
- Response generation based on recognized intents
- Text-to-speech for assistant responses
- Fallback handling for unrecognized intents

## Tech Stack

- Frontend: React with TypeScript, Tailwind CSS
- Backend: Python Flask
- NLP: Wit.ai for intent recognition
- Voice: Web Speech API (browser-native)

## Setup Instructions

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the URL shown in the console (typically http://localhost:8080)

### Backend Setup

1. Make sure you have Python 3.7+ installed
2. Install the required Python packages:
   ```
   pip install flask flask-cors requests
   ```
3. Run the Flask server:
   ```
   python app.py
   ```
4. The server will start on http://localhost:5000

## Usage

1. Open the web application in a browser that supports the Web Speech API (Chrome recommended)
2. Click the microphone button to start speaking
3. Ask a question or describe an issue (e.g., "My internet is slow", "How do I pay my bill?")
4. The assistant will process your query and respond with a relevant answer
5. For unrecognized queries, the assistant will offer to connect you with human support

## Supported Intents

The assistant recognizes the following intents:

- `intent_greeting`: General greetings and welcome messages
- `intent_bill_payment`: Questions about paying bills
- `intent_slow_internet`: Issues with slow internet connection
- `intent_contact_support`: Requests to speak with customer support
- `intent_unknown`: Fallback for unrecognized queries

## Development Notes

- The frontend uses the Web Speech API for voice input and output, which may require HTTPS for deployment
- The Wit.ai token is included in the backend code for demonstration purposes
- In a production environment, this token should be stored securely as an environment variable

## Future Enhancements

- Add Twilio integration for phone-based support
- Implement more sophisticated dialog management
- Add user authentication for personalized support
- Expand the range of recognized intents and responses

