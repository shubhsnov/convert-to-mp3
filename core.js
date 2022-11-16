function loadFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function () {
            console.log("Audio Loaded");
            resolve(reader.result);
        }

        reader.onerror = function (error) {
            console.log("Error while reading audio");
            reject(error);
        }

        reader.onabort = function (abort) {
            console.log("Aborted");
            console.log(abort);
            reject(abort);
        }
    });
}

function decodeAudioDataFromArrayBuffer(audioAsArrayBuffer) {
    return new AudioContext().decodeAudioData(audioAsArrayBuffer);
}

function encodeDecodedAudioToMp3(audioData) {
    return new Promise((resolve, reject) => {
        var worker = new Worker('./worker.js');

        worker.onmessage = (event) => {
            console.log(event.data);
            if (event.data != null) {
                resolve(event.data.res);
            }
            else {
                reject(new Error("Couldn't convert audio file"));
            }
        };

        worker.postMessage({ 'audioData': audioData });
        console.log(audioData);
    });
}