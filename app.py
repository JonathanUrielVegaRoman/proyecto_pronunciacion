from flask import Flask, request, jsonify, render_template
import librosa
import numpy as np
import os
import time
import datetime
import json
import requests

app = Flask(__name__, static_folder='static', template_folder='.')

# Carpeta donde se almacenarán los audios subidos
UPLOAD_FOLDER = './uploads'
RESULTS_FOLDER = './results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

wit_api_key = 'VGO3EDVN5RAAAVIXVGV57YBPHYYYYNZM'

def analyze_audio(file_path):
    try:
        y, sr = librosa.load(file_path, sr=None)
        pitches, _ = librosa.piptrack(y=y, sr=sr)
        pitches = pitches[pitches > 0]
        if pitches.size == 0:
            raise ValueError("No se pudieron encontrar frecuencias en el audio.")
        meanF0 = np.mean(pitches)
        jitter = np.std(pitches) / meanF0 if meanF0 else 0
        rms = librosa.feature.rms(y=y)[0]
        shimmer = np.std(rms) / np.mean(rms) if np.mean(rms) else 0
        return meanF0, jitter, shimmer
    except Exception as e:
        print(f"Error en el análisis del audio: {e}")
        return None, None, None 

def transcribe_speech(file_path):
    headers = {
        'Authorization': f'Bearer {wit_api_key}',
        'Content-Type': 'audio/wav'
    }
    with open(file_path, 'rb') as f:
        response = requests.post('https://api.wit.ai/speech?v=20201126', headers=headers, data=f)
    data = response.json()
    speech_text = data.get('text', '')

    # Extraer el valor de 'confidence' del token de mayor confianza si está disponible
    speech_confidence = data.get('speech', {}).get('confidence', 0.0)
    if speech_confidence == 0.0:
        tokens = data.get('speech', {}).get('tokens', [])
        if tokens:
            speech_confidence = max([token.get('confidence', 0.0) for token in tokens]) if tokens else 0.0

    return speech_text, speech_confidence, data  # Devolver los datos completos para la verificación de entidades

def get_intent(text):
    headers = {
        'Authorization': f'Bearer {wit_api_key}',
    }
    response = requests.get(f'https://api.wit.ai/message?v=20201126&q={text}', headers=headers)
    data = response.json()
    if 'intents' in data and data['intents']:
        intent_name = data['intents'][0]['name']
        intent_confidence = data['intents'][0]['confidence']
    else:
        intent_name = 'unknown'
        intent_confidence = 0.0
    return intent_name, intent_confidence

# Definir alternativas aceptables para las vocales y otras categorías
valid_options = {
    'a': ['a', 'ah'],
    'e': ['e', 'eh'],
    'i': ['i', 'y'],
    'o': ['o', 'oh'],
    'u': ['u', 'uh'],

    'b': ['b', 've'],
    'c': ['c', 'se', 'ce'],

    'ma': ['ma', 'MA', 'Ma'],
    'me': ['me', 'ME', 'Me'],
    'mi': ['mi', 'MI', 'Mi'],
    'mo': ['mo', 'MO', 'Mo'],
    'mu': ['mu', 'MU', 'Mu'],
    'pa': ['pa', 'PA', 'Pa'],
    'pe': ['pe', 'PE', 'Pe'],
    'pi': ['pi', 'PI', 'Pi'],
    'po': ['po', 'PO', 'Po'],
    'pu': ['pu', 'PU', 'Pu'],

    'amarillo': ['Amarillo', 'amarillo'],
    'rojo': ['Rojo', 'rojo'],
    'azul' : ['Azul', 'azul'],
    'verde' : ['Verde', 'verde'],
    'naranja' : ['Naranja', 'naranja'],

    'circulo' : ['Circulo', 'circulo'],
    'trapecio' : ['Trapecio', 'trapecio'],
    'cuadrado' : ['Cuadrado', 'cuadrado'],

    'uno' : ['Uno', 'uno'],
    'dos' : ['Dos', 'dos'],
    'tres' : ['Tres', 'tres'],
    'cuatro' : ['Cuatro', 'cuatro'],
    'cinco' : ['Cinco', 'cinco'],

    'ardilla' : ['Ardilla', 'ardilla'],
    'ciervo' : ['Ciervo', 'ciervo'],
    'lobo' : ['Lobo', 'lobo'],
    'zorro' : ['Zorro', 'zorro'],
    'camello' : ['Camello', 'camello'],
    'lagartos' : ['Lagartos', 'lagartos'],
    'serpiente' : ['Serpiente', 'serpiente'],
    'cebra' : ['Cebra', 'cebra'],
    'elefante' : ['Elefante', 'elefante'],
    'jirafa' : ['Jirafa', 'jirafa'],
    'rinoceronte' : ['Rinoceronte', 'rinoceronte'],
    'anaconda' : ['Anaconda', 'anaconda'],
    'jaguar' : ['Jaguar', 'jaguar'],
    'mono' : ['Mono', 'mono'],
    'puma' : ['Puma', 'puma']
    

}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({'error': 'No se proporcionó un archivo de audio.'}), 400

    audio = request.files['audio']
    selected_option = request.form.get('option')

    if audio.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo.'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, audio.filename)
    audio.save(file_path)

    start_time = time.time()

    # Inicializar las variables para la intención
    intent_name = "unknown"
    intent_confidence = 0.0

    # Transcribir audio y obtener confianza
    speech_text, speech_confidence, transcribe_data = transcribe_speech(file_path)
    print(f"Transcripción de audio: {speech_text}")
    print(f"Confianza en la transcripción: {speech_confidence}")

    validacion = "INCORRECTO"
    error_message = None

    # Verificar que la transcripción coincida con la opción seleccionada o sus alternativas
    if selected_option.lower() not in valid_options or speech_text.lower() not in valid_options[selected_option.lower()]:
        print(f"Error: La transcripción no coincide con la opción seleccionada. Se esperaba '{selected_option}' pero se recibió '{speech_text}'.")
        error_message = f"La transcripción no coincide con la opción seleccionada. Se esperaba '{selected_option}' pero se recibió '{speech_text}'."
        speech_confidence *= 0.5  # Reducir la confianza si no coincide
    else:
        # Verificar si la entidad reconocida coincide con la opción seleccionada
        entities = transcribe_data.get('entities', {})
        correct_entity = False
        for entity in entities.values():
            for item in entity:
                if item['value'].lower() == selected_option.lower():
                    correct_entity = True
                    break
            if correct_entity:
                break

        if not correct_entity:
            validacion = "INCORRECTO"
            error_message = f"La entidad reconocida no coincide con la opción seleccionada '{selected_option}'."
        else:
            # Obtener intención y confianza solo si la transcripción y la entidad son válidas
            intent_name, intent_confidence = get_intent(speech_text)
            print(f"Intención: {intent_name}, Confianza: {intent_confidence}")

            # Marcar validación como correcta si la confianza de la intención es suficiente
            if intent_confidence >= 0.6:  # Puedes ajustar el umbral de confianza según lo necesites
                validacion = "CORRECTO"
            else:
                error_message = f"La confianza de la intención es baja."

    # Analizar audio para obtener métricas de tono y variación
    meanF0, jitter, shimmer = analyze_audio(file_path)
    print(f"Métricas de audio - meanF0: {meanF0}, jitter: {jitter}, shimmer: {shimmer}")

    if meanF0 is None:
        print("Error: No se pudo analizar el audio.")
        os.remove(file_path)
        return jsonify({'error': 'Error al procesar el audio.'}), 500

    # Calcular la probabilidad usando la fórmula proporcionada pero con intentConfidence
    probabilidad = intent_confidence * speech_confidence * (1 + jitter + shimmer) * 100
    probabilidad = min(probabilidad, 100)

    end_time = time.time()
    execution_time = end_time - start_time

    os.remove(file_path)

    result = {
        'filename': audio.filename,
        'meanF0Hz': float(meanF0),
        'jitter': float(jitter),
        'shimmer': float(shimmer),
        'speechText': speech_text,
        'speechConfidence': speech_confidence,
        'intentName': intent_name,
        'intentConfidence': intent_confidence,
        'probability': round(probabilidad, 2),
        'validation': validacion,
        'executionTime': round(execution_time, 5),
        'error': error_message
    }

    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    result_file = os.path.join(RESULTS_FOLDER, f"result_{timestamp}.json")

    with open(result_file, 'w') as f:
        json.dump(result, f, indent=4)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
