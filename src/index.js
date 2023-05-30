const canvas = document.getElementById('preview');
const fileInput = document.querySelector('input[type="file"');
const asciiImage = document.getElementById('ascii');

const context = canvas.getContext('2d');
const video = document.getElementById('video');

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;



const convertToGrayScales = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height);

    const grayScales = [];

    for (let i = 0 ; i < imageData.data.length ; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

        grayScales.push(grayScale);
    }

    context.putImageData(imageData, 0, 0);

    return grayScales;
};

document.querySelector("button").addEventListener("click",(e)=>{
    e.target.innerHTML = video.paused ? "STOP":"PLAY" ;
    video.paused ? video.play():video.pause()
})

function renderAscii (e){
        const width = Math.floor(window.innerWidth/3);
        const height = video.videoHeight/video.videoWidth*width;

        canvas.width = window.innerWidth;
        canvas.height = video.videoHeight;
        context.drawImage(e, 0, 0, width, height);
        const grayScales = convertToGrayScales(context, width, height);
        drawAscii(grayScales, width);
};

document.getElementById("input").addEventListener("change", function() {
    var media = URL.createObjectURL(this.files[0]);
    document.querySelector("button").innerHTML = "PLAY"
    video.src = media;
    video.pause()
});
// set canvas size = video size when known
video.addEventListener('loadedmetadata', function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight*2;
});

video.addEventListener('play', function() {
  var $this = this; //cache
  (function loop() {
    if (!$this.paused && !$this.ended) {
      renderAscii($this)
      setTimeout(loop, (1000 / 60)); // drawing at 60fps
    }
  })();
});

const grayRamp = '$@0GCLft1i;:..,:;i1tfL ';
const rampLength = grayRamp.length;

const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];

const drawAscii = (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);
        if ((index + 1) % width === 0) {
            nextChars += '\n';
        }

        return asciiImage + nextChars;
    }, '');

    asciiImage.textContent = ascii;
};
