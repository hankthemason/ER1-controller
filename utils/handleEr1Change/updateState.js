const nrpnMap = require("../../configs/nrpnMap.json");

const updateState = (val, nrpn, state) => {
  //get the parameter's name from its NRPN
  const paramName = nrpnMap[nrpn];
  //if the nrpn is not one that we are watching, do nothing
  if (!paramName || paramName === "undefined") {
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
    state[param][type] = val;
  } else {
    const voiceName = paramName.split(" ")[0];
    const param = paramName.split(" ")[1];
    state[voiceName][param] = val;
  }
  return state;
};

module.exports = updateState;
