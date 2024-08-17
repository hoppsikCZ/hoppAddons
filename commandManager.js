import constants from './utils/constants';
import Settings from './settings';

register('command', (commandName, ...args) => {
    switch (commandName) {
        case 'blastjegay':
            ChatLib.chat(`${constants.PREFIX} §c§fr fr`);
            break;
        case 'gui':
            ChatLib.chat(`${constants.PREFIX} §c§fComing soon!`);
            break;
        default:
            Settings.openGUI();
            break;
    }
}).setName('hoppsikAddons').setAliases('ha');