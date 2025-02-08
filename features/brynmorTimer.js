import settings from "../settings";
import { createText } from "../utils/gui";
import PogObject from "PogData";
import constants from "../utils/constants";
import { worldData } from "../utils/worldData";

const key = 'brynmoreTimer';

const itemTimers = new PogObject("hoppsikAddons", {
    "MINING_PUMPKIN": { timeRemaining: 0, displayName: "§aPowder Pumpkin" },
    "FILET_O_FORTUNE": { timeRemaining: 0, displayName: "§9Filet O' Fortune" },
    "CHILLED_PRISTINE_POTATO": { timeRemaining: 0, displayName: "§5Chilled Pristine Potato" }
}, "data/brynmorData.json");

const timerDuration = 3600000; // 1 hour in milliseconds

let paused = false;

let lastSecond = Date.now();

register("clicked", (mouseX, mouseY, button, isButtonDown) => {
    if (button !== 1 || !isButtonDown) return; // Check for right-click

    if (worldData.island === "Catacombs" || worldData.island === "The Rift") return;

    let heldItem = Player.getHeldItem();
    if (heldItem == null) return;

    let tag = heldItem.getNBT().getCompoundTag("tag");
    if (tag == null) return;
    let ExtraAttributes = tag.getCompoundTag("ExtraAttributes");
    if (ExtraAttributes == null) return;
    let id = ExtraAttributes.getString("id");
    if (id == null) return;

    if (itemTimers[id]) {
        itemTimers[id].timeRemaining = timerDuration;
        itemTimers.save();
    }
});

register('step', () => {
    if (!worldData.skyblock || worldData.island === "Catacombs" || worldData.island === "The Rift")
    {
        paused = true;
    }
    else
    {
        paused = false;
    }
});

register('gameUnload', () => {
    itemTimers.save();
    paused = true;
});

register('renderOverlay', () => {
    if (Date.now() - lastSecond >= 1000) {
        lastSecond = Date.now();
        if (!paused) {
            for (let itemId in itemTimers) {
                let timer = itemTimers[itemId];
                if (timer.timeRemaining > 0) {
                    timer.timeRemaining -= 1000;
                }
            }
        }
    }

    if (!settings.brynmorTimer || !worldData.skyblock) return;

    if (settings.brynmorMiningIslandsOnly) {
        if (!worldData) return;
        if (!constants.miningIslands.includes(worldData.island)) return;
    }

    createText(key, "§6§lBrynmor Timer", 0, 0);

    for (let itemId in itemTimers) {
        let timer = itemTimers[itemId];
        let timeRemaining = timer.timeRemaining;
        let minutes = Math.floor(timeRemaining / 60000);
        let seconds = Math.floor((timeRemaining % 60000) / 1000).toString().padStart(2, '0');
        if (timeRemaining <= 0) {
            createText(key, `§e${timer.displayName}: §c§lExpired!`, 0, 10 + Object.keys(itemTimers).indexOf(itemId) * 10);
        } else {
            createText(key, `§e${timer.displayName}: §l${minutes}m ${seconds}s`, 0, 10 + Object.keys(itemTimers).indexOf(itemId) * 10);
        }
    }
});