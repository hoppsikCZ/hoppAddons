import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
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
    }
}

export default new Settings();
