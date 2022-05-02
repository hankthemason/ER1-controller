const maxApi = require("max-api");

const presetTemplate = require("../configs/presetTemplate.json");

const {
  checkSoloStateAndMuteState,
  receiveNrpn,
  updateState,
  updateMuteAndSoloState,
  findAndSendNrpns,
  getVoiceType,
} = require("../utils");

const {
  writeChordToDisk,
  updateAllAfterRead,
  writeStateToDisk,
  readStateFromDisk,
} = require("./readAndWrite");

let muteAndSoloState = {
  mute: {
    vco: 0,
    sampleAndAudio: 0,
  },
  solo: {
    vco: 79,
    sampleAndAudio: 127,
  },
};

//number of VCO's
const numVCOs = 4;

let state = JSON.parse(JSON.stringify(presetTemplate));

//listens to changes coming from the UI
//and relays the changed value to the ER-1
maxApi.addHandler("handleUIChange", (voiceName, param, val) => {
  //1. send nrpns to er1
  // - voice/global
  // - mute/solo
  if (param !== "mute" && param !== "solo") {
    findAndSendNrpns(voiceName, param, val);
  } else {
    //to find and send mute/solo nrpns, we first need to update muteAndSoloState
    muteAndSoloState = updateMuteAndSoloState(
      muteAndSoloState,
      voiceName,
      param,
      val
    );
    findAndSendNrpns(voiceName, param, val, muteAndSoloState);
  }
  //2. update state
  //update state
  if (param === "solo" || param === "mute") {
    const voiceType = getVoiceType(voiceName);
    if (param === "mute") {
      state[param][voiceType] = muteAndSoloState.mute;
    } else {
      state[param][voiceType] = muteAndSoloState.solo;
    }
  } else {
    state[voiceName][param] = val;
  }
  //3. check solo/mute state
  //if all solo's are off, let everything be audible again
  checkSoloStateAndMuteState(muteAndSoloState);
});

//HANDLE INCOMING CHANGES FROM THE ER-1
//UPDATE UI
maxApi.addHandler("incomingFromEr1", (val, nrpn) => {
  receiveNrpn(val, nrpn);
  state = { ...updateState(val, nrpn, state) };
});

//READ/WRITE OPERATIONS
maxApi.addHandler("writeStateToDisk", (filePath) => {
  writeStateToDisk(state, filePath);
});

maxApi.addHandler("readStateFromDisk", (filePath) => {
  state = { ...readStateFromDisk(filePath) };
  updateAllAfterRead(state);
  muteAndSoloState = {
    mute: state.mute,
    solo: state.solo,
  };
});
