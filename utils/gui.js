import { guiData } from "../data/data"

export function createText(key, text, offsetX, offsetY, alignRight = false, shadow = true) {
    if (guiData[key] == undefined) {
        guiData[key] = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            scale: 1
        }
        guiData.save();
    }

    let x = guiData[key].x + offsetX * guiData[key].scale;
    let y = guiData[key].y + offsetY * guiData[key].scale;

    let textToDraw = new Text(text, x, y).setShadow(shadow).setScale(guiData[key].scale);
    if (alignRight)
        textToDraw.setAlign('RIGHT');
    textToDraw.draw();

    if (guiData[key].width < textToDraw.getWidth() / guiData[key].scale + offsetX) {
        guiData[key].width = textToDraw.getWidth() / guiData[key].scale + offsetX;
        guiData.save();
    }

    if (guiData[key].height < textToDraw.getHeight() / guiData[key].scale + offsetY) {
        guiData[key].height = textToDraw.getHeight() / guiData[key].scale + offsetY;
        guiData.save();
    }
}

export function setX(key, x) {
    guiData[key].x = x;
    guiData.save();
}

export function setY(key, y) {
    guiData[key].y = y;
    guiData.save();
}

export function setScale(key, scale) {
    guiData[key].scale = scale;
    guiData.save();
}

export default { createText, setX, setY, setScale }