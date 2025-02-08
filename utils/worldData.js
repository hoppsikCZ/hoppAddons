const AreaTest = /(Area:[ ])|(Dungeon:[ ])/g;
const PetLevelTest = /\[Lvl \d+\]/g;

class Pet {
    constructor(rarity, name, level) {
        this.rarity = rarity;
        this.name = name;
        this.level = level;
        this.equipTime = Date.now();
    }

    toString() {
        return `${this.rarity} ${this.name} (Lvl ${this.level})`;
    }
}

class WorldData {
    constructor() {
        this.skyblock = false;
        this.island = undefined;
        this.area = undefined;
        this.pet = undefined;	
        register('worldLoad', this.WorldLoad.bind(this));
        register('step', this.Step.bind(this)).setFps(2);
        register('chat', this.AutopetCheck.bind(this)).setChatCriteria("Autopet equipped your [Lvl ${level}] ${pet}! VIEW RULE");
    }

    WorldLoad() {
        this.skyblock = false;
        this.island = undefined;
        this.area = undefined;
    }

    Step() {
        this.skyblock = Scoreboard.getTitle()?.removeFormatting().includes("SKYBLOCK") || Scoreboard.getTitle()?.removeFormatting().includes("SKIBLOCK");

        if (!this.skyblock) {
            this.island = undefined;
            this.area = undefined;
            return;
        }

        if (World.isLoaded()) {
            let tabListLines = TabList.getNames();

            if (tabListLines) {
                this.island = ChatLib.removeFormatting(tabListLines.find(name => AreaTest.test(ChatLib.removeFormatting(name))))?.replace(AreaTest, "");
                let petEquip = 0;
                if (this.pet) petEquip = this.pet.equipTime;
                if (Date.now() - petEquip > 1000 * 5) { // don't update pet if it was equipped in the last 5 seconds, because tablist doesn't update immediately after changing
                    if (tabListLines.find(line => ChatLib.removeFormatting(line).includes("Pet:"))) {
                        let petLine = tabListLines[tabListLines.indexOf(tabListLines.find(line => ChatLib.removeFormatting(line).includes("Pet:"))) + 1];
                        let petLevel = ChatLib.removeFormatting(petLine).split(" ")[2].replace("]", "") - 0;
                        let petName = ChatLib.removeFormatting(petLine).split(" ")[3];
                        let petRarity = getRarityFromCode('§' + petLine.split(" ")[3][3]);

                        if (petLevel && petName && petRarity) this.pet = new Pet(petRarity, petName, petLevel);
                    }
                }
            }

            let scoreBoardLines = Scoreboard.getLines();

            if (scoreBoardLines) {
                this.area = ChatLib.removeFormatting(scoreBoardLines.find(line => ChatLib.removeFormatting(line).includes(" ⏣ ")))?.replace(" ⏣ ", "");
            }
        }
    }

    AutopetCheck(level, pet, event) {
        let petRarity = getRarityFromCode('§' + (ChatLib.getChatMessage(event).split(" ")[5][1]));
        this.pet = new Pet(petRarity, pet, level);
    }

    PrintInfo() {
        ChatLib.chat(`Skyblock: ${this.skyblock}`);
        ChatLib.chat(`Island: ${this.island}`);
        ChatLib.chat(`Area: ${this.area}`);
    }
}

export let worldData = new WorldData();

export function getRarityFromCode(code) {
    switch (code) {
        case '§f': return 'Common';
        case '§a': return 'Uncommon';
        case '§9': return 'Rare';
        case '§5': return 'Epic';
        case '§6': return 'Legendary';
        case '§d': return 'Mythic';
        default: return 'Unknown';
    }
}

export default { worldData, getRarityFromCode };