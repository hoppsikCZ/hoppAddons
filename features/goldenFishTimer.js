import constants from "../utils/constants"

const display = new Display();
display.hide();
display.addLine("§6§lGolden Fish Timer");
display.addLine("§eSpawn possible: ");
display.addLine("§eCast until:");
display.setRenderLoc(500, 100);
display.setBackgroundColor(Renderer.color(0, 0, 0, 50));
display.setBackground('full');
const spawnTime = 900000;
const timeLimit = 180000; 

let fishingStart = -1;
let lastCast = -1;

register("step", () => {
    if (Player.getPlayer() != null && Player.getPlayer().field_71104_cf != null) {
        if (fishingStart == -1) {
            fishingStart = Date.now();
            display.show();
        }

        lastCast = Date.now();
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
        display.setLine(2, `§eCast until:           ${timeSinceCast < timeLimit / 3 ? '§a' : (timeSinceCast < timeLimit / 3 * 2 ? '§e' : '§c')} ${Math.floor((timeLimit - timeSinceCast) / 1000 / 60)}m ${Math.floor((timeLimit - timeSinceCast) / 1000 % 60).toString().padStart(2, '0')}s`);
        display.setLine(1, `§eSpawn possible: §6${Math.floor((spawnTime - timeElapsed) / 1000 / 60).toString().padStart(2, ' ')}m ${Math.floor((spawnTime - timeElapsed) / 1000 % 60).toString().padStart(2, '0')}s`);
    }
}).setFps(5)