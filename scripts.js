// use strict;
const video = document.querySelector('video');

const constraints = {
    audio: false,
    video :{
        // width: { min: 128, ideal: 128, max: 128 },
        // height: { min: 122, ideal: 122, max: 122 }
        width: { min: 640 }
    }
};

// navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//     video.src = window.URL.createObjectURL(stream);
//     thing = {
//         width: '',
//         height: 0
//     }
//
//     video.play();
//     startDraw();
// });
let videoHeight;
let videoWidth;
let isPortrait;
navigator.webkitGetUserMedia(constraints, (stream) => {
    window.stream = stream;
    video.src = window.URL.createObjectURL(stream);
    video.play();
    startDraw();
    console.log(1);
    setTimeout(() => {
        console.log('harr');
        video.videoHeight;
        videoHeight = video.videoHeight;
        videoWidth = video.videoWidth;
        isPortrait = videoHeight > videoWidth;
    }, 3000);


}, (err) => {
    console.error(err);
});

const canvas1 = document.querySelector('#c1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.querySelector('#c2');
const ctx2 = canvas2.getContext('2d');
const localMediaStream = null;

const height = 122;
const width = 128;
const gbAspect = 122/128;
setTimeout(() => {
    console.log(videoHeight, videoWidth, width);
    const thing = videoHeight/(videoWidth/(width/2));
    console.log(thing);
}, 4000);

function drawFrame() {
    let sourceX = 0;
    let sourceY = 0;
    let offsetX = 0;
    let offsetY = 0;
    if (!isPortrait) {
        let sourceAspect = videoHeight / videoWidth;

        const thing = 96;
        // const thing = videoHeight/(videoWidth/(width/2));

        sourceX = videoWidth * (thing / (height/2) ); //TODO

        offsetX = (videoWidth - sourceX)/2;
    }
    if (isPortrait) {
        let sourceAspect = videoHeight / videoWidth;
        sourceY = videoWidth * (48/61); //TODO

        offsetY = (videoWidth - sourceY)/2;
    }

    ctx1.drawImage(video, -offsetX, sourceY, 640, 480, 0, 0, width, height);

    let frame = ctx1.getImageData(0, 0, width, height);
    let data = frame.data;

    for (var i = 0; i < data.length; i += 4) {
        // first, convert to grayscale
        var avg = (data[i] + data[i +1] + data[i +2]) / 3;

        // TODO
        const contrast = window.cont || 0.5;

        // then convert to gb-scale
        if (avg < 64 * (contrast * 2)) {
            // darkest
            // RGB: 15, 56, 15
            data[i]     = 15; // red
            data[i + 1] = 56; // green
            data[i + 2] = 15; // blue
        }
        else if (avg < 128* (contrast * 2)) {
            // dark
            // RGB: 48, 98, 48
            data[i]     = 48; // red
            data[i + 1] = 98; // green
            data[i + 2] = 48; // blue
        }
        else if (avg < 192* (contrast * 2)) {
            // light
            // RGB: 139, 172, 15
            data[i]     = 139; // red
            data[i + 1] = 172; // green
            data[i + 2] = 15; // blue
        }
        else {
            // lightest
            // RGB: 155, 188, 15
            data[i]     = 155; // red
            data[i + 1] = 188; // green
            data[i + 2] = 15; // blue
        }

    }
    ctx2.putImageData(frame, 0, 0);
}

const fps = 6;
function startDraw() {
    setInterval(drawFrame, 1000/fps);
}

const dial = document.querySelector('#contrast-dial');
dial.addEventListener('change', () => {
    window.cont = (dial.value / 100);
});

const captureButton = document.querySelector('#capture');
captureButton.addEventListener('click', () => {
    document.querySelector('img').src = canvas2.toDataURL();
});
