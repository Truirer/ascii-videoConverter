const canvas = document.getElementById('preview');
const fileInput = document.querySelector('input[type="file"');
const asciiImage = document.getElementById('ascii');

const context = canvas.getContext('2d');

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const getFontRatio = () => {
    const pre = document.createElement('pre');
    pre.style.display = 'inline';
    pre.textContent = ' ';
    document.body.appendChild(pre);
    const { width, height } = pre.getBoundingClientRect();
    document.body.removeChild(pre);
    return height / width;
};

const fontRatio = getFontRatio();

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

const MAXIMUM_WIDTH = 80;
const MAXIMUM_HEIGHT = 80;

const clampDimensions = (width, height) => {
    const rectifiedWidth = Math.floor(getFontRatio() * width);

    if (height > MAXIMUM_HEIGHT) {
        const reducedWidth = Math.floor(rectifiedWidth * MAXIMUM_HEIGHT / height);
        return [reducedWidth, MAXIMUM_HEIGHT];
    }

    if (width > MAXIMUM_WIDTH) {
        const reducedHeight = Math.floor(height * MAXIMUM_WIDTH / rectifiedWidth);
        return [MAXIMUM_WIDTH, reducedHeight];
    }

    return [rectifiedWidth, height];
};
document.querySelector("button").addEventListener("click",(e)=>{
    e.target.innerHTML = video.paused ? "STOP":"PLAY" ;
    video.paused ? video.play():video.pause()
})

function renderAscii (e){
        const [width, height] = clampDimensions(window.innerWidth*2,video.videoHeight);

        canvas.width = window.innerWidth;
        canvas.height = video.videoHeight*2;
        context.drawImage(e, 0, 0, width, height*2);
        const grayScales = convertToGrayScales(context, width, height*2);
        drawAscii(grayScales, width);


};

var video = document.getElementById('video');
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

const grayRamp = '$@0GCLft1i;:..,:;i1tfLCG0 ';
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
