from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from PIL import Image, ImageFilter
import numpy as np
import os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # 8MB limit
app.secret_key = 'your-secret-key-here'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.context_processor
def inject_now():
    return {'now': datetime.now()}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def analyze_image(filepath):
    try:
        img = Image.open(filepath)
        img.verify()
        img = Image.open(filepath)
        
        analysis = {
            'filename': secure_filename(os.path.basename(filepath)),
            'size': img.size,
            'format': img.format,
            'mode': img.mode,
            'created': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Color analysis
        try:
            img_small = img.resize((50, 50))
            pixels = np.array(img_small)
            if len(pixels.shape) == 3:
                dominant_rgb = tuple(np.mean(pixels.reshape(-1, 3), axis=0).astype(int))
                analysis['dominant_color'] = {
                    'rgb': dominant_rgb,
                    'hex': '#{:02x}{:02x}{:02x}'.format(*dominant_rgb)
                }
            else:
                gray_val = int(np.mean(pixels))
                analysis['dominant_color'] = {
                    'rgb': (gray_val, gray_val, gray_val),
                    'hex': '#{:02x}{:02x}{:02x}'.format(gray_val, gray_val, gray_val)
                }
        except Exception as e:
            print(f"Color analysis error: {e}")
            analysis['dominant_color'] = {'rgb': (0, 0, 0), 'hex': '#000000'}

        # Edge detection
        try:
            edges = img.filter(ImageFilter.FIND_EDGES)
            edge_filename = f"edge_{analysis['filename']}"
            edge_path = os.path.join(app.config['UPLOAD_FOLDER'], edge_filename)
            edges.save(edge_path)
            analysis['edge_path'] = edge_filename
        except Exception as e:
            print(f"Edge detection error: {e}")
            analysis['edge_path'] = None

        return analysis

    except Exception as e:
        print(f"Image analysis failed: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyzer')
def analyzer():
    return render_template('analyzer.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        analysis = analyze_image(filepath)
        if analysis:
            return render_template('results.html', analysis=analysis)
    
    return render_template('error.html', 
                         message="Invalid file. Please upload JPG, PNG, or WEBP (max 8MB).")

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)