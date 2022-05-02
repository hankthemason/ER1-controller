const maxApi = require("max-api");
const globalParams = require("../configs/globalParams.json");
const voiceMap = require("../configs/voiceMap.json");

const numVCOs = 4;

const updateSingleVoice = (voiceName, params) => {
  Object.entries(params).map(([param, value]) => {
    const nrpn = voiceMap[voiceName][param].nrpn;
    maxApi.outlet("nrpnOut", value, nrpn);
  });
};

const updateAllVoices = (params) => {
  for (let i = 0; i < numVCOs; i++) {
    const voiceName = "vco".concat(i + 1);

    Object.entries(params).map(([param, value]) => {
      const nrpn = voiceMap[voiceName][param].nrpn;
      !Array.isArray(value)
        ? maxApi.outlet("nrpnOut", value, nrpn)
        : maxApi.outlet("nrpnOut", value[i], nrpn);
    });
  }
};

const updateMute = (muteState) => {
  const nrpnPair = Object.entries(globalParams.mute).map(([, value]) => value);
  maxApi.outlet("nrpnOut", muteState.vco, nrpnPair[0]);
  maxApi.outlet("nrpnOut", muteState.sampleAndAudio, nrpnPair[1]);
};

const updateSolo = (soloState) => {
  const nrpnPair = Object.entries(globalParams.solo).map(([, value]) => value);
  maxApi.outlet("nrpnOut", soloState.vco, nrpnPair[0]);
  maxApi.outlet("nrpnOut", soloState.sampleAndAudio, nrpnPair[1]);
};

const updateGlobalSettings = (params) => {
  Object.entries(params).map(([param, value]) => {
    const nrpn = globalParams[param];
    maxApi.outlet("nrpnOut", value, nrpn);
  });
};

module.exports = {
  updateSingleVoice,
  updateGlobalSettings,
  updateSolo,
  updateMute,
  updateAllVoices,
};
