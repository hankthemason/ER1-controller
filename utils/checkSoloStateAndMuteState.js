const maxApi = require("max-api");
const globalParams = require("../configs/globalParams.json");

const checkSoloStateAndMuteState = (muteAndSoloState) => {
  const { solo: soloState, mute: muteState } = muteAndSoloState;
  if (soloState.vco === 79 && soloState.sampleAndAudio === 127) {
    const outlet1Val = 0 | muteState.vco;
    const outlet2Val = 0 | muteState.sampleAndAudio;
    soloVcoNrpn = globalParams.solo.vco;
    soloSampleAndAudioNrpn = globalParams.solo.sampleAndAudio;
    maxApi.outlet("nrpnOut", outlet1Val, soloVcoNrpn);
    maxApi.outlet("nrpnOut", outlet2Val, soloSampleAndAudioNrpn);
  }
};

module.exports = checkSoloStateAndMuteState;
