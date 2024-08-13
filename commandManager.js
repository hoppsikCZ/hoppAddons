import constants from '../constants';



register('command', (commandName, args) => {
    switch (commandName) {
        case 'blastjegay':
            ChatLib.chat(`${constants.PREFIX} §c§fr fr`);
            break;
    }
}).setName('hoppAddons').setAliases('ha');