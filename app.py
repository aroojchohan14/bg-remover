from flask import Flask, request, send_file, render_template
from rembg import remove
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return 'No image file found', 400

    file = request.files['image']
    input_image = Image.open(file.stream).convert("RGBA")
    output = remove(input_image)

    img_io = io.BytesIO()
    output.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
