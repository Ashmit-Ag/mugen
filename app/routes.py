from flask import Blueprint, request, jsonify, send_file
from app import mongo, bcrypt
from midi2audio import FluidSynth
from pydub import AudioSegment
import os

from mugen.melodygenerator import MelodyGenerator 
from mugen.preprocess import SEQUENCE_LENGTH



main = Blueprint('main', __name__)

users_collection = mongo.db.users


@main.route('/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({'error': 'Request content type must be application/json'}), 400

    data = request.get_json() 
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({' email': email}): 
        return jsonify({'error': 'Email already exist!'}), 400


    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = {
         'email': email,
        'password': hashed_password,
    }
    mongo.db.users.insert_one(user)
    return jsonify({'message': 'User registered successfully!'}), 201


@main.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({'error': 'Request content type must be application/json'}), 400

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    
    if not email or not password:
        return jsonify({'error': 'Email and password are required!'}), 400


    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found!'}), 404

    # password
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid password!'}), 401


    return jsonify({
        'message': 'Login successful!',
        'user': "user login successfully"
    }), 200


@main.route('/users', methods=['GET'])
def get_users():
    users = users_collection.find()
    users_list = [{
        'id': str(user['_id']),
        'username': user['username'],
        'email': user['email']
    } for user in users]
    return jsonify(users_list), 200


@main.route('/<id>/generate-song', methods=['POST'])
def generate_song(id):
    model_number = request.json.get('model_number')
    seed1 = "67 _ _ 64 _ 65 _ 64 _  _ 62 _ 60 _ _ "#cheerful
    seed2 = "59 _ _ _ 57 _ _ _ 62 _ _ _ 59 _ 55 _ " #sorrow
    seed3 = "66 _ 64 _ 67 _ 66 " #happy
    seed4 = "69 _ _ 67 _ "
    seed5 = "64 _ _ _ _ _ _ 64 _ _ _ 66 _ 67 _ _ _ _ _ _ 66 _ _ _ 67 _ 69 _ _ _ _ _ 71 _ _ _ _ 69 _ _ 67 _ _ _ _ 66 _ _ 67 _ _ _ _ _"

    mg = MelodyGenerator(model_number=model_number)

    melody = mg.generate_melody(seed4, 360, SEQUENCE_LENGTH, 0.3)
    print(melody)

    midi_path = f"generated_melodies{id}.mid"
    mg.save_melody(melody, midi_path)

    wav_path = f"app/generated_melodies{id}.wav"
    fs = FluidSynth('mugen/SalC5Light2.sf2')  
    fs.midi_to_audio(midi_path, wav_path)

    # mp3_path = f"generated_melodies/{id}.mp3"
    # audio = AudioSegment.from_wav(wav_path)
    # audio.export(mp3_path, format="mp3")

    # os.remove(midi_path)
    # os.remove(wav_path)
    file_path = f"generated_melodies{id}.wav"
    return send_file(file_path, as_attachment=True), 200