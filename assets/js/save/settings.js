import { save } from "./save_game.js";

/** Class containing all info about the settings. */
export class Settings {
    constructor() {
        /** The current language the game is set to. */
        this.language = "en";
        /** Time in milliseconds between auto-saves. Set to 0 to disable. */
        this.autoSave = 10000;
    }

    /**
     * Load data into the settings class.
     * @param {*} obj The JavaScript object that was loaded.
     */
    load(obj) {
        if (obj === null) {
            return;
        }

        if (obj.language !== undefined) {
            this.language = obj.language;
        }
        if (obj.autoSave !== undefined) {
            this.autoSave = obj.autoSave;
        }
    }

    /** Save the settings to the localStorage. */
    save() {
        save("Settings", this);
    }

    /**
     * Set the value of a given setting if it exists then save the settings in the localStorage.
     * @param {string} setting The setting to assign a value.
     * @param {*} value The value to assign to the setting.
     */
    setSetting(setting, value) {
        if (this[setting] === undefined) {
            return;
        }
        this[setting] = value;
        this.save();
    }
}