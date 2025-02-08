import { guiData } from "../data/data"

export var editGui = new Gui();

let guiBeingMoved = null;
let relX = 0;
let relY = 0;
let activeGuis = [];

export function createText(key, text, offsetX, offsetY, align = "LEFT", shadow = true) {
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
    textToDraw.setAlign(align);
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
        new Rectangle(Renderer.color(0, 0, 0, 50), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight()).draw();
        new Text('§4Click and drag on a gui element to move it', Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 + 40).setAlign('CENTER').setShadow(true).draw();
        new Text('§4Scroll to change scale', Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 + 60).setAlign('CENTER').setShadow(true).draw();
        new Text('§4Press ESC to exit', Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 + 80).setAlign('CENTER').setShadow(true).draw();
        activeGuis.forEach(key => {
            if (guiData[key] != undefined) {
                let rect = new Rectangle(Renderer.color(0, 0, 0, 70) , guiData[key].x, guiData[key].y, guiData[key].width * guiData[key].scale, guiData[key].height * guiData[key].scale);
                rect.draw();

                let text = new Text(`§f${key} x: ${guiData[key].x} y: ${guiData[key].y} scale: ${guiData[key].scale.toFixed(2)}`, guiData[key].x, guiData[key].y - 10).setShadow(true);
                text.draw();
            }
        });
    }
});

register('guiMouseClick', (x, y, button, gui, event) => {
    if (editGui.isOpen()) {
       activeGuis.forEach(key => {
            if (key != undefined) {
                if (x > guiData[key].x && x < guiData[key].x + guiData[key].width * guiData[key].scale && y > guiData[key].y && y < guiData[key].y + guiData[key].height * guiData[key].scale) {
                    guiBeingMoved = key;
                    relX = x - guiData[key].x;
                    relY = y - guiData[key].y;
                }
            }
        } );
    }
});

register('guiMouseDrag', (x, y, button, gui, event) => {
    if (editGui.isOpen() && guiBeingMoved != null) {
        guiData[guiBeingMoved].x = Math.round(x - relX);
        guiData[guiBeingMoved].y = Math.round(y - relY);
        guiData.save();
    }
});

register('guiMouseRelease', (x, y, button, gui, event) => {
    if (editGui.isOpen())
        guiBeingMoved = null;
});

register('scrolled', (x, y, direction) => {
    if (editGui.isOpen()) {
        activeGuis.forEach(key => {
            if (guiData[key] != undefined) {
                if (x > guiData[key].x && x < guiData[key].x + guiData[key].width * guiData[key].scale && y > guiData[key].y && y < guiData[key].y + guiData[key].height * guiData[key].scale) {
                    guiData[key].scale += Math.round(direction) * 0.1;
                    if (guiData[key].scale < 0.1)
                        guiData[key].scale = 0.1;
                }
            }
        });
        guiData.save();
    }
});

export default { createText, setX, setY, setScale, editGui }