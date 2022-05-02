const maxApi = require("max-api");
const nrpnMap = require("../../configs/nrpnMap.json");
const sampleAndAudioVoices = require("../../configs/sampleAndAudioVoices.json");
const handleIncomingMuteOrSolo = require("./handleIncomingMuteOrSolo");

const numVCOs = 4;

//update the UI when the ER-1 changes
const receiveNrpn = (val, nrpn) => {
  //get the parameter's name from its NRPN
  const paramName = nrpnMap[nrpn];
  //if the nrpn is not one that we are watching, do nothing
  if (!paramName || paramName === "undefined") {
    return;
  }

  //this covers the ER-1's ability to turn all solo's off by pressing the 'solo' button
  if (paramName === "mute vco" && val === 0) {
    for (let i = 0; i < numVCOs; i++) {
      const targetVoice = "vco" + (i + 1);
      maxApi.outlet("updateUI", paramName.slice(0, 4), targetVoice, 0);
      maxApi.outlet("updateUI", "solo", targetVoice, 0);
    }
    return;
  } else if (paramName === "mute sampleAndAudio" && val === 0) {
    for (let i = 0; i < sampleAndAudioVoices.length; i++) {
      const targetVoice = sampleAndAudioVoices[i];
      maxApi.outlet("updateUI", paramName.slice(0, 4), targetVoice, 0);
      maxApi.outlet("updateUI", "solo", targetVoice, 0);
    }
    return;
  }

  //incoming NRPN's can only be "mute"
  //because "mute" and "solo" use the same NRPN #'s
  if (paramName.slice(0, 4) === "mute") {
    let param = paramName.split(" ")[0];
    const type = paramName.split(" ")[1];
    if (val > 63) {
      param = "solo";
    }
    handleIncomingMuteOrSolo(param, type, val);
  } else {
    const voiceName = paramName.split(" ")[0];
    const param = paramName.split(" ")[1];
    maxApi.outlet("updateUI", voiceName, param, val);
  }
};

module.exports = receiveNrpn;
