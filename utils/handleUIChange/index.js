const voiceMap = require("../../configs/voiceMap.json");
const getVoiceType = require("../../utils/getVoiceType");
const sampleAndAudioVoices = require("../../configs/sampleAndAudioVoices.json");

const ER1 = require("../../ER1");

const findAndSendNrpns = (voiceName, param, val, muteAndSoloState = null) => {
  let outputVal;
  let params;
  if (voiceName !== "global" && voiceMap[voiceName][param]) {
    nrpn = voiceMap[voiceName][param].nrpn;
    if (param === "wave" && val === 1) {
      //wave toggles between values of 0 & 127
      outputVal = 127;
    } else {
      outputVal = val;
    }
    params = { [param]: outputVal };
    ER1.updateSingleVoice(voiceName, params);
  } else {
    if (param === "mute" || param === "solo") {
      if (param === "mute") {
        ER1.updateMute(muteAndSoloState.mute);
        ER1.updateSolo(muteAndSoloState.solo);
      } else if (param === "solo") {
        ER1.updateSolo(muteAndSoloState.solo);
      }
    } else {
      if (param === "ringMod1" || param === "ringMod2") {
        nrpn = globalParams[param];
        outputVal = val === 1 ? 127 : 0;
      } else {
        outputVal = val;
        nrpn = globalParams[param];
      }
      params = { [param]: outputVal };
      ER1.updateGlobalSettings(params);
    }
  }
};

const updateMuteAndSoloState = (muteAndSoloState, voiceName, param, val) => {
  const type = getVoiceType(voiceName);
  let { mute: muteState, solo: soloState } = muteAndSoloState;
  if (param === "mute") {
    //which bit do we need to change?
    const voiceNum =
      type === "vco"
        ? voiceName.slice(voiceName.length - 1)
        : sampleAndAudioVoices.indexOf(voiceName) + 1;

    //which muteState are we changing?
    let muteStateToChange = muteState[type];
    //which bit are we turning on/off?
    if (val === 1) {
      const bitwise = Math.pow(2, voiceNum) >> 1;
      muteStateToChange = muteStateToChange | bitwise;
    } else {
      muteStateToChange = muteStateToChange & ~(1 << (voiceNum - 1));
    }

    //update global mute state
    muteState[type] = muteStateToChange;
  } else {
    //which bit do we need to change?
    const voiceNum =
      type === "vco"
        ? voiceName.slice(voiceName.length - 1)
        : sampleAndAudioVoices.indexOf(voiceName) + 1;

    //solo values are expressed as 7 bit numbers
    //the first 3 bits are always >= 64 (bn100)
    const addToSolo = 64;

    let soloStateToChange = soloState[type];

    if (val === 1) {
      //turn on every bit except for voiceNum
      soloStateToChange = soloStateToChange & ~(1 << (voiceNum - 1));
    } else {
      const bitwise = (Math.pow(2, voiceNum) >> 1) + addToSolo;
      soloStateToChange = soloStateToChange | bitwise;
    }

    const soloKeys = Object.keys(soloState);

    for (let i = 0; i < soloKeys.length; i++) {
      const key = soloKeys[i];
      if (key === type) {
        soloState[key] =
          muteState[key] > 0
            ? soloStateToChange | muteState[key]
            : soloStateToChange;
      }
    }
  }
  return { mute: muteState, solo: soloState };
};

module.exports = { updateMuteAndSoloState, findAndSendNrpns };
