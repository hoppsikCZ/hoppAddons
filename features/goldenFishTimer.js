import constants from "../utils/constants"
import worldData from "../utils/worldData";
import colorUtils from "../utils/colorUtils";
import settings from "../settings";
import { createText } from "../utils/gui";

const key = 'goldenFishTimer';
const display = new Display();
display.hide();
display.addLine("§6§lGolden Fish Timer");
display.addLine("§eSpawn possible: ");
display.addLine("§eCast until:");
display.setRenderLoc(430, 130);
display.setBackgroundColor(Renderer.color(0, 0, 0, 50));
display.setBackground('full');

const spawnTime = 480000;
const timeLimit = 180000; 
const spawnedTimeLimit = 60000;

let fishingStart = -1;
let lastCast = -1;
let casting = false;
let spawned = false;
let active = false;
let timeElapsed, timeSinceCast;
let alertPlayed = false;

register('worldLoad', () => {
    display.hide();
    fishingStart = -1;
    lastCast = -1;
    spawned = false;
});

register("step", () => {
    if (!worldData.skyblock || worldData.island !== "Crimson Isle" || !settings.goldenFishTimer) {
        active = false;
        return;
    }

    if (Player.getPlayer() != null && Player.getPlayer().field_71104_cf != null) {
        active = true;
        alertPlayed = false;

        if (fishingStart == -1) {
            fishingStart = Date.now();
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

    timeElapsed = Date.now() - fishingStart;
    timeSinceCast = Date.now() - lastCast;

    if (timeSinceCast >= timeLimit) {
        active = false;
        fishingStart = -1;
        lastCast = -1;
    }

    if (settings.goldenFishSoundAlert && (timeLimit - timeSinceCast) / 1000 <= settings.goldenFishSoundTime && !alertPlayed) {
        alertPlayed = true;
        World.playSound(settings.alertsSound, settings.alertsVolume, settings.alertsPitch);
    }
}).setFps(5)

register('renderOverlay', () => {
    if (settings.goldenFishTimer && active) {
        createText(key, "§6§lGolden Fish Timer", 0, 0);

        createText(key, `§eSpawn possible:`, 0, 10);
        createText(key, `§eCast until:`, 0, 20);

        if (casting) {
            createText(key, `§a${spawned ? 'Reling in!' : 'Casting!'}`, 130, 20, 'RIGHT');
        }
        else {
            createText(key, `${timeSinceCast < (spawned ? spawnedTimeLimit : timeLimit) / 3 ? '§a' : 
                (timeSinceCast < (spawned ? spawnedTimeLimit : timeLimit) / 3 * 2 ? '§e' : '§c')} ${
                Math.floor(((spawned ? spawnedTimeLimit : timeLimit) - timeSinceCast) / 1000 / 60)}m ${
                Math.floor(((spawned ? spawnedTimeLimit : timeLimit) - timeSinceCast) / 1000 % 60).toString().padStart(2, '0')}s`, 130, 20, 'RIGHT');
        }

        if (spawned) {
            createText(key, `§a§lSPAWNED!`, 130, 10, 'RIGHT');
        } else if (timeElapsed < spawnTime) {
            createText(key, `§6${Math.floor((spawnTime - timeElapsed) / 1000 / 60).toString().padStart(2, ' ')}m ${Math.floor((spawnTime - timeElapsed) / 1000 % 60).toString().padStart(2, '0')}s`, 130, 10, 'RIGHT');
        } else {
            createText(key, `§a§lNOW! §6${Math.round((timeElapsed - spawnTime) / 240000 * 100)}%`, 130, 10, 'RIGHT');
        }
    }
});

register('chat', (rarity) => {
    active = false;
    fishingStart = -1;
    lastCast = -1;
    spawned = false;
}).setChatCriteria('TROPHY FISH! You caught a Golden Fish ${rarity}.');

register('chat', (rarity) => {
    active = false;
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