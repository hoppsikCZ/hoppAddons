import constants from './utils/constants';

register('command', (commandName, ...args) => {
    switch (commandName) {
        case 'blastjegay':
            ChatLib.chat(`${constants.PREFIX} §c§fr fr`);
            break;
        default:
            break;
    }
}).setName('hoppsikAddons').setAliases('ha');