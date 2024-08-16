import constants from "../utils/constants"
import worldData from "../utils/worldData";
import colorUtils from "../utils/colorUtils";

const display = new Display();
display.hide();
display.addLine("§6§lGolden Fish Timer");
display.addLine("§eSpawn possible: ");
display.addLine("§eCast until:");
display.setRenderLoc(430, 130);
display.setBackgroundColor(Renderer.color(0, 0, 0, 50));
display.setBackground('full');

const spawnTime = 900000;
const timeLimit = 180000; 
const spawnedTimeLimit = 60000;

let fishingStart = -1;
let lastCast = -1;
let casting = false;
let spawned = false;

register('worldLoad', () => {
    display.hide();
    fishingStart = -1;
    lastCast = -1;
    spawned = false;
});

register("step", () => {
    if (!worldData.skyblock || worldData.island !== "Crimson Isle") {
        display.hide();
        return;
    }

    if (Player.getPlayer() != null && Player.getPlayer().field_71104_cf != null) {
        if (fishingStart == -1) {
            fishingStart = Date.now();
            display.show();
        }

        if (!spawned)
            lastCast = Date.now();

        casting = true;
    }
    else {
        casting = false;
    }

    if (fishingStart == -1) {
        return;
    }

    let timeElapsed = Date.now() - fishingStart;
    let timeSinceCast = Date.now() - lastCast;

    if (timeSinceCast >= timeLimit) {
        display.hide();
        fishingStart = -1;
        lastCast = -1;
    } else {
        if (casting) {
            display.setLine(2, `§eCast until:           §a ${spawned ? 'Reling in!' : 'Casting!'}`);
        } else {
            display.setLine(2, `§eCast until:           ${timeSinceCast < (spawned ? spawnedTimeLimit : timeLimit) / 3 ? '§a' : 
                (timeSinceCast < (spawned ? spawnedTimeLimit : timeLimit) / 3 * 2 ? '§e' : '§c')} ${
                Math.floor(((spawned ? spawnedTimeLimit : timeLimit) - timeSinceCast) / 1000 / 60)}m ${
                Math.floor(((spawned ? spawnedTimeLimit : timeLimit) - timeSinceCast) / 1000 % 60).toString().padStart(2, '0')}s`);
        }

        if (spawned) {
            display.setLine(1, `§eSpawn possible: §a§l NOW! (SPAWNED)`);
        } else if (timeElapsed < spawnTime) {
            display.setLine(1, `§eSpawn possible: §6${Math.floor((spawnTime - timeElapsed) / 1000 / 60).toString().padStart(2, ' ')}m ${Math.floor((spawnTime - timeElapsed) / 1000 % 60).toString().padStart(2, '0')}s`);
        } else {
            display.setLine(1, `§eSpawn possible: §a§l NOW! §6(${Math.round((timeElapsed - spawnTime) / 300000 * 100)}%)`);
        }
    }
}).setFps(5)

register('chat', (rarity) => {
    display.hide();
    fishingStart = -1;
    lastCast = -1;
    spawned = false;
}).setChatCriteria('TROPHY FISH! You caught a Golden Fish ${rarity}.');

register('chat', (rarity) => {
    display.hide();
    fishingStart = -1;
    lastCast = -1;
    spawned = false;
}).setChatCriteria('The Golden Fish swims back beneath the lava...');

register("chat", () => {
    spawned = true;
}).setCriteria("You spot a Golden Fish surface from beneath the lava!")

register("chat", () => {
    lastCast = Date.now();
}).setCriteria("The Golden Fish escapes your hook but looks weakened.")

register("chat", () => {
    lastCast = Date.now();
}).setCriteria("The Golden Fish is resisting...")

register("chat", () => {
    lastCast = Date.now();
}).setCriteria("The Golden Fish is weak!")