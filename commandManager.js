import constants from './utils/constants';
import Settings from './settings';
import { editGui } from './utils/gui';

register('command', (commandName, ...args) => {
    switch (commandName) {
        case 'gui':
            editGui.open();
            break;
        default:
            Settings.openGUI();
            break;
    }
}).setName('hoppsikAddons').setAliases('ha');