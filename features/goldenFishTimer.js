import constants from "../utils/constants"

register("step", () => {
    if (Player.getPlayer()) {
        ChatLib.chat(`${constants.PREFIX}&bGolden Fish Timer: &a`)
    }
}).setFps(5)