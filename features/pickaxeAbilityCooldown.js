import { pickaxeAbilityCooldowns } from "../utils/constants";
import { worldData } from "../utils/worldData";
import { createText } from "../utils/gui";
import settings from "../settings";

const key = 'abilityCooldown';

let fuelTank = 1;
let pet = 1;
let bcheese = false;
let skyMall = false;
let skyMallEnabled = true;
let mineshaftMayham = false;

let coolDown = 0;
let lastAbilityUse = Date.now();
let ability = '';
let alertPlayed = true;
let textAlertStart = 0;
let alertsReady = false;

register('step', () => {
    alertsReady = (lastAbilityUse + coolDown - Date.now()) / 1000 <= 0;

    if (settings.abilitySoundAlert && alertsReady && !alertPlayed) {
        alertPlayed = true;
        World.playSound(settings.alertsSound, settings.alertsVolume, settings.alertsPitch);
    }


}).setFps(5);

register('renderOverlay', () => {
    if (!worldData.skyblock || !settings.abilityTimer) return;

    if (ability !== '') {
        let remaining = Math.ceil((lastAbilityUse + coolDown - Date.now()) / 1000);
        if (remaining <= 0) remaining = 'Ready!';
        else remaining += 's';

        createText(key, settings.abilityDisplayFormat.replaceAll("%a", ability).replaceAll("%t", remaining).replaceAll("@", "§"), 0, 0);
    }

    if (settings.abilityTextAlert && alertsReady) {
        if (textAlertStart == 0) textAlertStart = Date.now();
        if (Date.now() - textAlertStart <= 3000) {
            createText("pickaxeAbilityText", `§b§l${ability}`, 0, 0, "CENTER");
        }
    }
});

register('chat', (ab) => {
    ability = ab;
    lastAbilityUse = Date.now();
    let heldItem = Player.getHeldItem();
    if (heldItem != null) {
        let lore = heldItem.getLore()
        bcheese = false;
        fuelTank = 1;
        lore.forEach(line => {
            if (ChatLib.removeFormatting(line) == "Blue Cheese Goblin Omelette Part") 
            {
                bcheese = true;
            }

            if (line.includes("% Pickaxe Ability Cooldown")) {
                let split = line.split(" ");
                fuelTank = 1 - ChatLib.removeFormatting(split[0].replace(/-|%/g, '')) / 100;
            }
        });
    }

    pet = calculatePetMultiplier();
    coolDown = getCooldown(ability);
    alertPlayed = false;
    alertsReady = false;
    textAlertStart = 0;
}).setChatCriteria('You used your ${ab} Pickaxe Ability!');

register('chat', () => {
    mineshaftMayham = true;
}).setChatCriteria('MAYHEM! Your Pickaxe Ability cooldown was reduced from your Mineshaft Mayhem perk!');

register('chat', (buff, event) => {
    if (ChatLib.removeFormatting(ChatLib.getChatMessage(event)) === "New buff: -20% Pickaxe Ability cooldowns.") skyMall = true;
    else skyMall = false;

}).setChatCriteria('New buff: ${buff}');

register('chat', (ab) => {
    ability = ab;
}).setChatCriteria('You selected ${ab} as your Pickaxe Ability. This ability will apply to all of your pickaxes!');

register('chat', () => {
    ability = '';
    skyMall = false;
    skyMallEnabled = true;
}).setChatCriteria('Reset your Heart of the Mountain! Your Perks and Abilities have been reset.');

register('chat', (status) => {
    if (status === 'Enabled') skyMallEnabled = true;
    else if (status === 'Disabled') skyMallEnabled = false;
}).setChatCriteria('${status} Sky Mall');

register('worldLoad', () => {
    mineshaftMayham = false;
    coolDown = 0;
});

function calculatePetMultiplier() {
    let pet = 1
    if (worldData.pet) {
        if (worldData.pet.rarity == 'Legendary' && worldData.pet.name == 'Bal') {
            pet -= 0.001 * worldData.pet.level;
        }
    }

    return pet;
}

function getCooldown(ab) {
    return pickaxeAbilityCooldowns[ab][(settings.noCotm ? 0 : 1) + (bcheese ? 1 : 0)] * pet * fuelTank * ((skyMall && skyMallEnabled) ? 0.8 : 1) * (mineshaftMayham ? 0.75 : 1) * 1000;
}