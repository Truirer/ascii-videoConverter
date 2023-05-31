const canvas = document.getElementById('preview');
const fileInput = document.querySelector('input[type="file"');
const asciiImage = document.getElementById('ascii');

const context = canvas.getContext('2d');
const video = document.getElementById('video');

const toGrayScale = (r, g, b) => 0.334 * r + 0.333 * g + 0.333 * b;
let isDark = false;


const convertToGrayScales = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height);

    const grayScales = [];
    let count = 0;
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

document.querySelector("#playButton").addEventListener("click",(e)=>{
    e.target.innerHTML = video.paused ? "STOP":"PLAY" ;
    video.paused ? video.play():video.pause()
})
document.querySelector("#ChangeAscii").addEventListener("click",(e)=>{
  isDark = !isDark
  e.target.innerHTML = isDark ? "Dark Mode":"Balanced Mode" ;
})
let multiplier = 1;
document.querySelector("#resolution").addEventListener("change",(e)=>{
  document.querySelector("pre").style.fontSize= 16 - e.target.value*4+"px"
  multiplier= 4-e.target.value
})

function renderAscii (e){
        const width = Math.floor(window.innerWidth/3/multiplier);
        const horizontalWidth = video.videoHeight/video.videoWidth*width
        const height = horizontalWidth ;

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

const grayRampBalanced = '$@08GCLft1i;:.,:;i1tfLCG0 ';
const grayRampDark = '$@08;:.,:;i1tfLCG0 ';


const getCharacterForGrayScale = (grayScale) => {
  let grayRamP = isDark ? grayRampDark:grayRampBalanced;
  let rampLength = grayRamP.length;
  return grayRamP[Math.ceil((rampLength - 1) * grayScale / 255)]
};

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
