import { guiData } from "../data/data"

export function createText(key, text, offsetX, offsetY, color, background = false, backgroundColor = Renderer.color(0, 0, 0, 50)) {
    if (guiData[key] == undefined) {
        guiData[key] = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            scale: 1
        }
    }

    let x = guiData[key].x + offsetX * guiData[key].scale;
    let y = guiData[key].y + offsetY * guiData[key].scale;

    let textToDraw = new Text(text, x, y).setScale(gui[key].scale).setColor(color);

    if (guiData[key].width < textToDraw.getWidth()) {
        guiData[key].width = textToDraw.getWidth();
    }

    if (guiData[key].height < textToDraw.getHeight()) {
        guiData[key].height = textToDraw.getHeight();
    }

    if (background) {
        Renderer.drawRect(backgroundColor, x - 2, y - 2, guiData[key].width + 4, guiData[key].height + 4);
    }
 
    textToDraw.draw();
}

export function setX(key, x) {
    guiData[key].x = x;
}

export function setY(key, y) {
    guiData[key].y = y;
}

export function setScale(key, scale) {
    guiData[key].scale = scale;
}

export default { createText, setX, setY, setScale }