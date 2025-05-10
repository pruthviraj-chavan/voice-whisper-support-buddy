
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json

app = Flask(__name__)
CORS(app)

# Wit.ai API setup
WIT_AI_TOKEN = 'XWTYNA5Y62FQH3E3KYW7EQEU6VKXPSKS'
WIT_API_URL = 'https://api.wit.ai/message'

# Predefined responses for different intents
RESPONSES = {
    'intent_greeting': 'Hello! How can I help you with your internet service today?',
    'intent_bill_payment': 'You can pay your bill online at our website, through our mobile app, or by calling our automated payment system at 1-800-PAY-BILL. Would you like more details about any of these methods?',
    'intent_slow_internet': 'I\'m sorry to hear about your slow internet. Let\'s troubleshoot: 1. Try restarting your modem and router. 2. Check if other devices have the same issue. 3. Connect via ethernet if possible. If the problem persists, we can run a remote diagnostic. Would you like me to help with that?',
    'intent_contact_support': 'You can reach our support team at 1-800-HELP-ISP. Our support hours are 24/7. Would you like me to connect you with a representative now?',
    'intent_unknown': 'I\'m not sure I understand what you\'re asking. Could you rephrase that, or would you prefer to speak with a human representative?'
}

@app.route('/api/query', methods=['POST'])
def process_query():
    try:
        data = request.json
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400
            
        # Call Wit.ai to get intent
        headers = {'Authorization': f'Bearer {WIT_AI_TOKEN}'}
        params = {'q': query}
        
        wit_response = requests.get(WIT_API_URL, headers=headers, params=params)
        
        if wit_response.status_code != 200:
            print(f"Wit.ai error: {wit_response.text}")
            return jsonify({
                'intent': 'intent_unknown',
                'response': RESPONSES['intent_unknown'],
                'confidence': 0
            })
            
        wit_data = wit_response.json()
        
        # Extract intent with highest confidence
        intents = wit_data.get('intents', [])
        
        if not intents:
            return jsonify({
                'intent': 'intent_unknown',
                'response': RESPONSES['intent_unknown'],
                'confidence': 0
            })
            
        top_intent = intents[0]
        intent_name = top_intent.get('name')
        confidence = top_intent.get('confidence', 0)
        
        # Get appropriate response
        response_text = RESPONSES.get(intent_name, RESPONSES['intent_unknown'])
        
        # Log the interaction
        print(f"Query: {query}")
        print(f"Detected intent: {intent_name} (confidence: {confidence})")
        print(f"Response: {response_text}")
        
        return jsonify({
            'intent': intent_name,
            'response': response_text,
            'confidence': confidence
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
