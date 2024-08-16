const AreaTest = /(Area:[ ])|(Dungeon:[ ])/g;

class WorldData {
    constructor() {
        this.skyblock = false;
        this.island = undefined;
        this.area = undefined;
        register('worldLoad', this.WorldLoad.bind(this));
        register('step', this.Step.bind(this)).setFps(2);
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
            if (TabList.getNames()) {
                this.island = ChatLib.removeFormatting(TabList.getNames().find(name => AreaTest.test(ChatLib.removeFormatting(name))))?.replace(AreaTest, "");
            }

            if (Scoreboard.getLines()) {
                this.area = ChatLib.removeFormatting(Scoreboard.getLines().find(line => ChatLib.removeFormatting(line).includes(" ⏣ ")))?.replace(" ⏣ ", "");
            }
        }
    }

    PrintInfo() {
        ChatLib.chat(`Skyblock: ${this.skyblock}`);
        ChatLib.chat(`Island: ${this.island}`);
        ChatLib.chat(`Area: ${this.area}`);
    }
}

let worldData = new WorldData();

export default worldData;