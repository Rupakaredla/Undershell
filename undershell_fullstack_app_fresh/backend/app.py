from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# In-memory user and personal details store
users = []
personal_details = {}
fcm_tokens = {}  # key: email or phone, value: FCM token

FCM_SERVER_KEY = "YOUR_FCM_SERVER_KEY"  # Replace with your Firebase Cloud Messaging server key

@app.route('/')
def home():
    return "Backend is Running Successfully 🚀"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    if not all([name, email, phone, password]):
        return jsonify({'message': 'Missing fields'}), 400
    if any(u['email'] == email or u['phone'] == phone for u in users):
        return jsonify({'message': 'User already exists'}), 400
    users.append({'name': name, 'email': email, 'phone': phone, 'password': password})
    return jsonify({'message': 'Registered'}), 201

@app.route('/personal-details', methods=['POST'])
def save_personal_details():
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')
    key = email or phone
    if not key:
        return jsonify({'message': 'Missing user identifier'}), 400
    personal_details[key] = {
        'father': data.get('father'),
        'mother': data.get('mother'),
        'sister': data.get('sister'),
        'brother': data.get('brother'),
        'friend': data.get('friend')
    }
    return jsonify({'message': 'Personal details saved'}), 201

@app.route('/save-fcm-token', methods=['POST'])
def save_fcm_token():
    data = request.get_json()
    identifier = data.get('identifier')  # email or phone
    token = data.get('token')
    if not identifier or not token:
        return jsonify({'message': 'Missing identifier or token'}), 400
    fcm_tokens[identifier] = token
    return jsonify({'message': 'FCM token saved'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')  # email or phone
    password = data.get('password')
    user = next((u for u in users if (u['email'] == identifier or u['phone'] == identifier) and u['password'] == password), None)
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
    return jsonify({'message': 'Login successful', 'name': user['name'], 'email': user['email'], 'phone': user['phone']})

@app.route('/sos', methods=['POST'])
def sos():
    data = request.get_json()
    identifier = data.get('identifier')
    location = data.get('location')
    message = data.get('message', 'Emergency!')

    # Find user
    user = next((u for u in users if (u['email'] == identifier or u['phone'] == identifier)), None)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Get FCM token for this user
    token = fcm_tokens.get(identifier)
    if not token:
        return jsonify({'message': 'No FCM token found for user'}), 400

    # Compose notification
    lat, lng = location
    location_url = f"https://maps.google.com/?q={lat},{lng}"
    notification = {
        'title': 'SOS Alert!',
        'body': f"{message}\nLocation: {location_url}"
    }

    # Send push notification via FCM
    headers = {
        'Authorization': 'key=' + FCM_SERVER_KEY,
        'Content-Type': 'application/json',
    }
    payload = {
        'to': token,
        'notification': notification
    }
    resp = requests.post('https://fcm.googleapis.com/fcm/send', headers=headers, json=payload)
    print(resp.json())

    return jsonify({'message': 'SOS notification sent'}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
