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

@Vigilant('hoppsikAddons', 'hoppsikAddons v1.0.0', {
    getCategoryComparator: () => (a, b) => {
        // By default, categories, subcategories, and properties are sorted alphabetically.
        // You can override this behavior by returning a negative number if a should be sorted before b,
        // or a positive number if b should be sorted before a.

        // In this case, we can put Not general! to be above general.
        const categories = ['General', 'Crimson Isles', 'Mushroom Desert'];

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

    //CRIMSON ISLES

    //Fishing

    @SwitchProperty({
        name: 'Golden fish timer',
        description: 'Toggle the golden fish timer. (better than other mods)',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
    })
    goldenFishTimer = true;

    @SwitchProperty({
        name: '● Golden fish cast alert',
        description: 'Alert x s before you need to cast a rod rod.',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
    })
    goldenFishSoundAlert = true;

    @PercentSliderProperty({
        name: '   volume',
        description: 'Volume of the golden fish sound alert.',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
    })
    goldenFishSoundVolume = 0.5;

    @DecimalSliderProperty({
        name: '   pitch',
        description: 'Pitch of the golden fish sound alert.',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
        minF: 0.5,
        maxF: 2,
        decimalPlaces: 1,
    })
    goldenFishSoundPitch = 1;

    @SliderProperty({
        name: '   time',
        description: 'The time in seconds before the golden fish alert is triggered. (default: 30)',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
        min: 0,
        max: 180,
    })
    goldenFishSoundTime = 30;

    @TextProperty({
        name: '   sound',
        description: 'The sound to play when the golden fish alert is triggered. (default: note.pling)',
        category: 'Crimson Isles',
        subcategory: 'Fishing',
        placeholder: 'note.pling',
        triggerActionOnInitialization: false,
    })
    goldenFishSound = 'note.pling';

    //MUSHROOM DESERT

    //Trapper

    @SwitchProperty({
        name: 'Theodolite helper',
        description: 'Draws disks on the ground to help you find the animal.',
        category: 'Mushroom Desert',
        subcategory: 'Trapper',
    })
    theodoliteHelper = true;

    constructor() {
        this.initialize(this);
        //Crimson Isles
        //Fishing
        this.addDependency('● Golden fish cast alert', 'Golden fish timer');
        this.addDependency('   volume', '● Golden fish cast alert');
        this.addDependency('   sound', '● Golden fish cast alert');
        this.addDependency('   pitch', '● Golden fish cast alert');
        this.addDependency('   time', '● Golden fish cast alert');
    }
}

export default new Settings();
