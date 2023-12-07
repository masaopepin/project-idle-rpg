import { save } from "./save_game.js";

/**
 * @typedef SettingSave
 * @prop {string} language The current language the game is set to.
 * @prop {string} theme The current bootstrap theme used.
 * @prop {number} autoSave Time in milliseconds between auto-saves.
 */

/** Class containing all info about the settings. */
export class Settings {
    constructor() {
        /** The array of valid settings. */
        this.settings = ["language", "theme", "autoSave"];
        /** The current language the game is set to. Defaults to "en". */
        this.language = "en";
        /** The current bootstrap theme used. Defaults to "dark". */
        this.theme = "dark";
        /** The array of valid themes. */
        this.themes = ["dark", "light"];
        /** Time in milliseconds between auto-saves. Set to 0 to disable. Defaults to 10000. */
        this.autoSave = 10000;
    }

    /**
     * Load data into the settings class.
     * @param {?SettingSave} obj The JavaScript object that was loaded.
     */
    load(obj) {
        if (obj === null) {
            return;
        }

        if (obj.language !== undefined) {
            this.language = obj.language;
        }
        if (obj.theme !== undefined && this.isValidTheme(obj.theme)) {
            this.theme = obj.theme;
            document.documentElement.setAttribute("data-bs-theme", obj.theme);
        }
        if (obj.autoSave !== undefined) {
            this.autoSave = obj.autoSave;
        }
    }

    /** Save the settings to the localStorage. */
    save() {
        const settingSave = {
            language: this.language,
            theme: this.theme,
            autoSave: this.autoSave
        }
        save("Settings", settingSave);
    }

    /**
     * Set the value of a given setting if it exists then save the settings in the localStorage.
     * @param {string} setting The setting to assign a value.
     * @param {*} value The value to assign to the setting.
     */
    setSetting(setting, value) {
        if (this.isValidSetting(setting)) {
            this[setting] = value;
            this.save();
        }
    }

    /**
     * Check if a given setting exists.
     * @param {string} setting The setting to check.
     * @returns True if the setting exists or false if it doesn't.
     */
    isValidSetting(setting) {
        return this.settings.includes(setting);
    }

    /**
     * Check if a given theme exists.
     * @param {string} theme The theme to check.
     * @returns True if the theme exists or false if it doesn't.
     */
    isValidTheme(theme) {
        return this.themes.includes(theme);
    }
}