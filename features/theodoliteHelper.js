import RenderLib from "../../RenderLib/index.js";
import constants from "../utils/constants.js";
import settings from "../settings";

let theodoliteUsed = false;
let blocks = 0;
let direction = '';
let angle = 0;

let x, y, z, radiusMin, radiusMax;

register('renderWorld', () => {
    if (theodoliteUsed && settings.theodoliteHelper) {
        RenderLib.drawDisk(x, y - 2.5, z, radiusMin, radiusMax, 20, 1, -90, 0, 0, 0, 0, 1, 1, true, true);
        RenderLib.drawDisk(x, y + 3.5, z, radiusMin, radiusMax, 20, 1, -90, 0, 0, 0 , 1, 0, 1, false, true);
    }
});

register('chat', (blocksArg, directionArg, angleArg) => {
    if (!settings.theodoliteHelper)
        return;

    if (angleArg == 0) {
        ChatLib.chat(`${constants.PREFIX} §aYou are too far away! Try moving closer before using the ability again!`);
        return;
    }

    blocks = blocksArg;
    direction = directionArg;
    angle = angleArg;

    x = Player.getX();
    y = Player.getY() + (direction === 'below' ? -blocks : +blocks);
    z = Player.getZ();

    radiusMin = Math.tan((90 - angle - 1.8 > 0 ? 90 - angle - 1.8 : 0) * Math.PI / 180) * blocks;
    radiusMax = Math.tan((90 - angle + 2.8 < 90 ? 90 - angle + 2.8 : 90) * Math.PI / 180) * blocks;

    theodoliteUsed = true;
}).setCriteria('The target is around ${blocksArg} blocks ${directionArg}, at a ${angleArg} degrees angle!');

register('chat', () => {
    theodoliteUsed = false;
}).setCriteria('Return to the Trapper soon to get a new animal to hunt!');

register('worldUnload' , () => {
    theodoliteUsed = false;
});

register('chat', (event) => {
    if (!settings.theodoliteHelper)
        return;

    cancel(event);
    ChatLib.chat(`${constants.PREFIX} §aYou are at the exact height! Try moving up or down before using the ability again!`);
}).setCriteria('You are at the exact height!');