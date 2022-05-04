# Virtual ER-1 Controller

This is a Max/MSP patch that can be used as a virtual interface for the Korg Electribe ER-1.

<img width="1000" alt="Screen Shot 2022-05-02 at 1 09 06 PM" src="https://user-images.githubusercontent.com/42900752/166293160-2ad52e3b-cb58-4699-a8ba-2c3fbe659bbf.png">

## Description

You need Max/MSP to run this patch.  The patch was made in Max/MSP, but most of the heavy lifting is done by the Node.js scripts in the `scripts` folder, which are integrated with Max through the [node.script] object.

## Getting Started

### Dependencies

- Max/MSP

### Installing

- Clone this repo or download it as a .zip file

### Executing program

- Make sure your path settings inside Max allow all the files in this directory to be discover-able (Options > File Preferences)
- You can open `er1-controller.maxpat` as a standalone patch, or instantiate it as a subpatch in another patch

### MIDI configuration

- You will need to do some configuration to make sure that your patch is sending MIDI messages to the correct channel
- If your are using the patch as a subpatch inside another patch, you can give it the optional `@midiChan` argument to specify the ER-1's MIDI channel
- If using the patch in standalone mode, open it unlocked in patching mode and give the [nrpnout] object the correct MIDI channel

### read/write configuration

- Read/Write operations should work as-is, but if you want to specify a certain location to read files from, you can enter the location as an argument in the form of an absolute path in the [opendialog] object
- Write operations will save a preset as a `.JSON` file automatically - there is no need to include a file extension

## Help

This version is still beta.  Please create an issue for any requests or bugs and I will try to address them.

## Authors

Hank Mason      
https://hankthemason.com      
[@your_american_cousin](https://instagram.com/your_american_cousin)


## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Cool and exciting facts

I used this patch to make this album: https://voltagecontrolrecords.bandcamp.com/album/memory-buffer

<img width=300 src="https://user-images.githubusercontent.com/42900752/166295407-a00603e8-44e0-4e1c-8692-ed3e6e15e9e8.png">

## One more thing

This patch is free and open-source.  If you use it, like it, and want to support the work I'm doing, please donate here:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate/?business=VDRCT2LS2M7XJ&no_recurring=0&currency_code=USD)
