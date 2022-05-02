//takes an input and returns whether that input is a "VCO" or "SAMPLE/AUDIO" voice
const getVoiceType = (voiceName) => {
  if (
    voiceName === "vco1" ||
    voiceName === "vco2" ||
    voiceName === "vco3" ||
    voiceName === "vco4"
  ) {
    return "vco";
  }
  return "sampleAndAudio";
};

module.exports = getVoiceType;
