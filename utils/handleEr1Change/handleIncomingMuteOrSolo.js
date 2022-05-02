const maxApi = require("max-api");
const sampleAndAudioVoices = require("../../configs/sampleAndAudioVoices.json");

const numVCOs = 4;

const handleIncomingMuteOrSolo = (voiceName, type, val) => {
  if (voiceName === "mute") {
    if (type === "vco") {
      //loop over mutes and check which are set
      for (var i = 0; i < numVCOs; i++) {
        //construct the mute name's string using i
        const targetVoice = "vco" + (i + 1);

        //either 1 or 0
        const temp = val >> i;
        //if & returns 1, mute is on
        if ((temp & 1) === 1) {
          maxApi.outlet("updateUI", voiceName, targetVoice, 1);
        } else {
          maxApi.outlet("updateUI", voiceName, targetVoice, 0);
        }
      }
    } else {
      //loop over mutes and check which are set
      for (let i = 0; i < sampleAndAudioVoices.length; i++) {
        //construct the mute name's string using i
        const targetVoice = sampleAndAudioVoices[i];
        const temp = val >> i;
        //if & returns 1, mute is on
        if ((temp & 1) === 1) {
          maxApi.outlet("updateUI", voiceName, targetVoice, 1);
        } else {
          maxApi.outlet("updateUI", voiceName, targetVoice, 0);
        }
      }
    }
  }
  //handle solo state
  else {
    if (type === "vco") {
      for (let i = 0; i < numVCOs; i++) {
        //construct the mute name's string using i
        const targetVoice = "vco" + (i + 1);
        if (val < 79) {
          const temp = (val - 64) >> i;
          //if & returns 1, mute is on
          if ((temp & 1) === 1) {
            maxApi.outlet("updateUI", voiceName, targetVoice, 0);
          } else {
            maxApi.outlet("updateUI", voiceName, targetVoice, 1);
          }
        } else {
          maxApi.outlet("updateUI", voiceName, targetVoice, 0);
        }
      }
    } else {
      for (let i = 0; i < sampleAndAudioVoices.length; i++) {
        //construct the mute name's string using i
        const targetVoice = sampleAndAudioVoices[i];

        if (val < 127) {
          const temp = (val - 64) >> i;
          //if & returns 1, mute is on
          if ((temp & 1) === 1) {
            maxApi.outlet("updateUI", voiceName, targetVoice, 0);
          } else {
            maxApi.outlet("updateUI", voiceName, targetVoice, 1);
          }
        } else {
          maxApi.outlet("updateUI", voiceName, targetVoice, 0);
        }
      }
    }
  }
};

module.exports = handleIncomingMuteOrSolo;
