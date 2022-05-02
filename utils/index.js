const checkSoloStateAndMuteState = require("./checkSoloStateAndMuteState");
const getVoiceType = require("./getVoiceType");
const handleIncomingMuteOrSolo = require("./handleEr1Change/handleIncomingMuteOrSolo");
const receiveNrpn = require("./handleEr1Change/receiveNrpn");
const updateState = require("./handleEr1Change/updateState");
const {
  updateMuteAndSoloState,
  findAndSendNrpns,
} = require("./handleUIChange");

module.exports = {
  checkSoloStateAndMuteState,
  getVoiceType,
  handleIncomingMuteOrSolo,
  receiveNrpn,
  updateState,
  updateMuteAndSoloState,
  findAndSendNrpns,
};
