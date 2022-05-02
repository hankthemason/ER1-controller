const fs = require("fs");
const maxApi = require("max-api");
const voiceMap = require("./configs/voiceMap.json");
const globalParams = require("./configs/globalParams.json");
const { handleIncomingMuteOrSolo } = require("./utils/");

const numVCOs = 4;

const writeChordToDisk = (chords, state) => {
  let chord = {};
  for (let i = 0; i < numVCOs; i++) {
    let note = {};
    const voiceName = "VCO-".concat(i + 1);
    const pitch = state[voiceName].pitch;
    const modDepth = state[voiceName].modDepth;
    note.pitch = pitch;
    note.modDepth = modDepth;
    chord[voiceName] = note;
  }
  chords.push(chord);
  fs.writeFileSync("./configs/chords.json", JSON.stringify(chords));
};

const writeStateToDisk = (state, filePath) => {
  filePath = filePath.slice(13).concat(".json");
  maxApi.post(filePath);
  fs.writeFileSync(filePath, JSON.stringify(state));
};

const readStateFromDisk = (filePath) => {
  const path = filePath.slice(13); //this is due to weird Max path conventions
  const rawData = fs.readFileSync(path);
  const state = JSON.parse(rawData);
  return state;
};

const updateAllAfterRead = (state) => {
  //keys are voices, "global", and "mute"/"solo"
  const stateKeys = Object.keys(state);

  for (let i = 0; i < stateKeys.length; i++) {
    const voiceName = stateKeys[i];
    //check if it is a voice object
    if (voiceMap[voiceName]) {
      const voiceParams = Object.keys(voiceMap[voiceName]);
      for (let j = 0; j < voiceParams.length; j++) {
        const param = voiceParams[j];
        const paramValue = state[voiceName][param];

        //get nrpn to send val to drum machine
        const nrpn = voiceMap[voiceName][param].nrpn;
        maxApi.outlet("nrpnOut", paramValue, nrpn);
        maxApi.outlet("updateUI", voiceName, param, paramValue);
      }
    }
    //'global' key
    else if (voiceName === "global") {
      const globalKeys = Object.keys(state[voiceName]);
      for (let j = 0; j < globalKeys.length; j++) {
        const param = globalKeys[j];
        const paramValue = state[voiceName][param];
        const nrpn = globalParams[param];
        maxApi.outlet("nrpnOut", paramValue, nrpn);
        maxApi.outlet("updateUI", voiceName, param, paramValue);
      }
    }
    //mute/solo state
    else {
      //state[key] returns a 'mute' or 'solo' object
      const muteOrSoloObjectKeys = Object.keys(state[voiceName]);
      for (let j = 0; j < muteOrSoloObjectKeys.length; j++) {
        const type = muteOrSoloObjectKeys[j];

        handleIncomingMuteOrSolo(voiceName, type, state[voiceName][type]);
      }
    }
  }
};

module.exports = {
  writeChordToDisk,
  updateAllAfterRead,
  writeStateToDisk,
  readStateFromDisk,
};
