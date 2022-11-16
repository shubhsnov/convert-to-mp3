var decodedAudio;

async function onSelectAudioFile() {
    var [audioFileMetadata, ...rest] = document.getElementById("audio-file").files;
    try {
        const audioAsArrBuffer = await loadFileAsArrayBuffer(audioFileMetadata);
        decodedAudio = await decodeAudioDataFromArrayBuffer(audioAsArrBuffer);
        showConvertButton();
    } catch (err) {
        console.log(err);
    }
}

function showConvertButton() {
    const button = document.getElementById("convert-audio");
    button.classList.remove("hidden");
}

function showProcessing() {
    const button = document.getElementById("convert-audio");
    button.classList.add("hidden");

    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");
}

async function initiateConversion() {
    try {
        showProcessing();

        var audioData = {
            channels: Array.apply(null, { length: decodedAudio.numberOfChannels })
                .map(function (currentElement, index) {
                    return decodedAudio.getChannelData(index);
                }),
            sampleRate: decodedAudio.sampleRate,
            length: decodedAudio.length,
            duration: decodedAudio.duration
        };

        const convertedAudioBuffer = await encodeDecodedAudioToMp3(audioData);
        console.log(convertedAudioBuffer);
        var audioBlob = new Blob(convertedAudioBuffer, { type: 'audio/mp3' });
        initiateDownloadFromBlob(audioBlob);
    } catch (err) {
        debugger;
        console.log(err);
    }
}

function initiateDownloadFromBlob(audioBlob) {
    const processedAudio = new window.Audio();
    processedAudio.src = URL.createObjectURL(audioBlob);

    const anchorAudio = document.createElement("a");
    anchorAudio.href = processedAudio.src;


    anchorAudio.download = "output.mp3";
    anchorAudio.click();

    resetContext();
}

function resetContext() {
    document.getElementById("audio-file").value = "";
    const spinner = document.getElementById("spinner");
    spinner.classList.add("hidden"); 
}