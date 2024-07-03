from flask import Flask, render_template, jsonify, request, redirect, url_for, send_from_directory
import os
import psutil

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(app.static_folder, 'music')
app.config['ALLOWED_EXTENSIONS'] = {'mp3', 'wav'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/logo')
def logo():
    return render_template('logo.html')
    
@app.route('/WhatAreYouDoingHere')
def dgame():
    return render_template('huh.html')

@app.route('/weather')
def weather():
    return render_template('weather.html')

@app.route('/vscode')
def vscode():
    return render_template('VSCode.html')

@app.route('/api/programs')
def list_programs():
    programs_dir = os.path.join(app.static_folder, 'Programs')
    programs = [f for f in os.listdir(programs_dir) if f.endswith('.js')]
    return jsonify(programs)

@app.route('/radio')
def radio():
    return render_template('radio.html')

@app.route('/music-list')
def music_list():
    music_folder = app.config['UPLOAD_FOLDER']
    files = [f for f in os.listdir(music_folder) if os.path.isfile(os.path.join(music_folder, f))]
    return jsonify(files)

@app.route('/play/<filename>')
def play(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('radio'))
    return render_template('upload.html')
    
@app.route('/system_info', methods=['GET'])
def system_info():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    memory_used = memory.used / (1024 ** 3)  # in GB
    memory_total = memory.total / (1024 ** 3)  # in GB
    return jsonify({
        'cpu_percent': cpu_percent,
        'memory_used': memory_used,
        'memory_total': memory_total
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
