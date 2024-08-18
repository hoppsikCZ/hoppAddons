import constants from './utils/constants';
import Settings from './settings';
import { editGui } from './utils/gui';

register('command', (commandName, ...args) => {
    switch (commandName) {
        case 'blastjegay':
            ChatLib.chat(`${constants.PREFIX} §c§fr fr`);
            break;
        case 'gui':
            editGui.open();
            break;
        default:
            Settings.openGUI();
            break;
    }
}).setName('hoppsikAddons').setAliases('ha');