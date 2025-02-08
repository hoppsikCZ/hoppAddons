import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @SliderProperty,
    @DecimalSliderProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
} from '../Vigilance/index';

// The only parameter that is required is the first, which should be the Module name.
// The other 2 parameters are optional.
// The 2nd parameter is the title of the settings window, seen in the top left above the
// category list.
// The 3rd parameter is an object that determines the sorting order of the categories.

@Vigilant('hoppsikAddons', 'hoppsikAddons v1.1.0', {
    getCategoryComparator: () => (a, b) => {
        // By default, categories, subcategories, and properties are sorted alphabetically.
        // You can override this behavior by returning a negative number if a should be sorted before b,
        // or a positive number if b should be sorted before a.

        // In this case, we can put Not general! to be above general.
        const categories = ['General', 'Crimson Isles', 'Mushroom Desert', "Mining"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
})
class Settings {

    //GENERAL

    @ButtonProperty({
        name: 'Edit GUI',
        description: 'Opens the GUI editor.',
        category: 'General',
        placeholder: 'open',
    })
    editGui() {
        ChatLib.command('ha gui', true);
    }

    @PercentSliderProperty({
        name: 'Alerts volume',
        description: 'Volume of the alert sounds.',
        category: 'General'
    })
    alertsVolume = 0.5;

    @DecimalSliderProperty({
        name: 'Alerts pitch',
        description: 'Pitch of the alert sounds.',
        category: 'General',
        minF: 0.5,
        maxF: 2,
        decimalPlaces: 1,
    })
    alertsPitch = 1;

    @TextProperty({
        name: 'Alerts sound',
        description: 'The sound to play when getting an alert. (default: note.pling)',
        category: 'General',
        placeholder: 'note.pling',
        triggerActionOnInitialization: false,
    })
    alertsSound = 'note.pling';

    //CRIMSON ISLES

    //Fishing

    @SwitchProperty({
        name: 'Golden fish timer',
        description: 'Toggle the golden fish timer.',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
    })
    goldenFishTimer = true;

    @SwitchProperty({
        name: 'Golden fish cast alert',
        description: 'Alert x s before you need to cast a rod rod.',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
    })
    goldenFishSoundAlert = true;

    @SliderProperty({
        name: '● time',
        description: 'The time in seconds before the golden fish alert is triggered. (default: 30)',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
        min: 0,
        max: 180,
    })
    goldenFishSoundTime = 30;

    //MUSHROOM DESERT

    //Trapper

    @SwitchProperty({
        name: 'Theodolite helper',
        description: 'Draws disks on the ground to help you find the animal.',
        category: 'Mushroom Desert',
        subcategory: 'Trapper',
    })
    theodoliteHelper = true;

    //MINING

    //Timers

    @SwitchProperty({
        name: 'Brynmor timer',
        description: 'Toggle the Brynmore timer.',
        category: 'Mining',
        subcategory: 'Timers',
    })
    brynmorTimer = true;

    @SwitchProperty({
        name: '● Brynmor mining islands only',
        description: 'Only show the Brynmore timer on mining islands.',
        category: 'Mining',
        subcategory: 'Timers',
    })
    brynmorMiningIslandsOnly = true;

    @SwitchProperty({
        name: 'Ability timer',
        description: 'Toggle the ability timer.',
        category: 'Mining',
        subcategory: 'Timers',
    })
    abilityTimer = true;

    @SwitchProperty({
        name: '● No CotM Buff',
        description: 'Toggle if you don\'t have at least CotM 2.',
        category: 'Mining',
        subcategory: 'Timers',
    })
    noCotm = false;

    @SwitchProperty({
        name: '● Ability ready sound alert',
        description: 'Toggle the ability ready alert.',
        category: 'Mining',
        subcategory: 'Timers',
    })
    abilitySoundAlert = true;

    @SwitchProperty({
        name: '● Ability ready text alert',
        description: 'Toggle the ability ready alert.',
        category: 'Mining',
        subcategory: 'Timers',
    })
    abilityTextAlert = true;

    @TextProperty({
        name: '● Display format',
        description: 'The format of the ability timer display %a = ability name, %t = time left, @ for color codes.',
        category: 'Mining',
        subcategory: 'Timers',
        placeholder: '@a%a: @e@l%t',
        triggerActionOnInitialization: false,
    })
    abilityDisplayFormat = '@a%a: @e@l%t';

    constructor() {
        this.initialize(this);
        //Crimson Isles
        //Fishing
        this.addDependency('Golden fish cast alert', 'Golden fish timer');

        //Mining
        this.addDependency('● Brynmor mining islands only', 'Brynmor timer');
        this.addDependency('● No CotM Buff', 'Ability timer');
        this.addDependency('● Ability ready sound alert', 'Ability timer');
        this.addDependency('● Ability ready sound alert', 'Ability timer');
        this.addDependency('● Display format', 'Ability timer');
    }
}

export default new Settings();
