const form = document.getElementById('uploadForm');
const output = document.getElementById('output');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imgObj;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const res = await fetch('/remove-bg', {
    method: 'POST',
    body: formData
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  output.innerHTML = `<img id="resultImage" src="${url}" />`;
  document.getElementById('edit-options').style.display = 'block';

  const img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.style.display = 'none';
    imgObj = img;
  };
  img.src = url;
});

// Rotate image
function rotate(degrees) {
  const tmpCanvas = document.createElement('canvas');
  const tmpCtx = tmpCanvas.getContext('2d');

  if (degrees === 90 || degrees === -90) {
    tmpCanvas.width = canvas.height;
    tmpCanvas.height = canvas.width;
  } else {
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
  }

  tmpCtx.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
  tmpCtx.rotate((degrees * Math.PI) / 180);
  tmpCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  canvas.width = tmpCanvas.width;
  canvas.height = tmpCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tmpCanvas, 0, 0);

  updateImage();
}

// Crop center square
function cropImage() {
  const cropSize = Math.min(canvas.width, canvas.height);
  const x = (canvas.width - cropSize) / 2;
  const y = (canvas.height - cropSize) / 2;

  const imageData = ctx.getImageData(x, y, cropSize, cropSize);
  canvas.width = cropSize;
  canvas.height = cropSize;
  ctx.putImageData(imageData, 0, 0);

  updateImage();
}

// Update image after edit
function updateImage() {
  const resultImage = document.getElementById('resultImage');
  resultImage.src = canvas.toDataURL('image/png');
}

// Download with compression
function downloadImage() {
  const quality = parseInt(document.getElementById('qualitySlider').value) / 100;
  const link = document.createElement('a');
  link.download = 'edited.png';
  link.href = canvas.toDataURL('image/jpeg', quality);
  link.click();
}
