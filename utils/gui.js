import { guiData } from "../data/data"

export var editGui = new Gui();

let guiBeingMoved = null;
let relX = 0;
let relY = 0;
let activeGuis = [];

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

    if (activeGuis.indexOf(key) == -1) {
        activeGuis.push(key);
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

register('renderOverlay', () => {
    if (editGui.isOpen()) {
        activeGuis.forEach(key => {
            if (guiData[key] != undefined) {
                let rect = new Rectangle(Renderer.color(0, 0, 0, 100) , guiData[key].x, guiData[key].y, guiData[key].width, guiData[key].height);
                rect.draw();

                let text = new Text(`§7x: ${guiData[key].x} y: ${guiData[key].y}`, guiData[key].x, guiData[key].y + 10);
                text.draw();
            }
        });
    }
});

register('guiMouseClick', (x, y, button, gui, event) => {
    if (editGui.isOpen() && gui == editGui) {
       activeGuis.forEach(key => {
            if (key != undefined) {
                if (x > guiData[key].x && x < guiData[key].x + guiData[key].width && y > guiData[key].y && y < guiData[key].y + guiData[key].height) {
                    guiBeingMoved = key;
                    relX = x - guiData[key].x;
                    relY = y - guiData[key].y;
                }
            }
        } );
    }
});

register('guiMouseDrag', (x, y, button, gui, event) => {
    if (editGui.isOpen() && gui == editGui && guiBeingMoved != null) {
        guiData[guiBeingMoved].x = x - relX;
        guiData[guiBeingMoved].y = y - relY;
        guiData.save();
    }
});

register('guiMouseRelease', (x, y, button, gui, event) => {
    if (editGui.isOpen() && gui == editGui)
        guiBeingMoved = null;
});

register('scrolled', (x, y, direction) => {
    if (editGui.isOpen()) {
        activeGuis.forEach(key => {
            if (guiData[key] != undefined) {
                if (x > guiData[key].x && x < guiData[key].x + guiData[key].width && y > guiData[key].y && y < guiData[key].y + guiData[key].height) {
                    guiData[key].scale += Math.round(direction) * 0.1;
                }
            }
        });
        guiData.save();
    }
});

register('guiKey', (char, key, gui, event) => {
    if (editGui.isOpen() && gui == editGui) {
        if (key == Keyboard.KEY_ESCAPE) {
            guiBeingMoved = null;
            editGui.close();
        }
    }
});

export default { createText, setX, setY, setScale, editGui }