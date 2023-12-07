/** Manager class for the different languages the game can be translated. */
export class Manager_Language {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** Boolean set to true when the language is fully loaded. */
        this.isLanguageLoaded = false;
        /** The array of valid languages. */
        this.languages = ["en", "fr"];
        /** 
         * Database of all strings for the current language.
         * @type {Object.<string, string>}
         */
        this.db = {};

        // Make sure the language to load is valid
        if (!this.isValidLanguage(game.settings.language)) {
            game.settings.setSetting("language", "en");
        }
        this.loadLanguage(game);
    }

    /**
     * Set and load a new language if the language is valid.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {string} language The new language id. Should be present in this.languages array to be valid.
     */
    setLanguage(game, language) {
        if (!this.isValidLanguage(language) || language === game.settings.language) {
            return;
        }

        game.settings.setSetting("language", language);
        this.loadLanguage(game);
    }

    /**
     * Load the language set in settings and dispatch a languageLoaded event when finished.
     * @param {import("../main.js").Game_Instance} game The game instance.
     */
    loadLanguage(game) {
        this.isLanguageLoaded = false;
        import("./language_" + game.settings.language + ".js").then((language) => {
            this.db = language["LANGUAGE_" + game.settings.language.toUpperCase()];
            document.documentElement.setAttribute("lang", game.settings.language);
            console.log("Language loaded: " + game.settings.language);
            this.isLanguageLoaded = true;
            game.events.dispatch("languageLoaded", {language: game.settings.language});
        });
    }

    /** @returns True if the given language has a corresponding language file. */
    isValidLanguage(language) {
        return this.languages.includes(language);
    }

    /**
     * Find a string in the loaded language from it's id.
     * @param {string} id The unique id of the string.
     * @returns The string from the currently loaded language.
     */
    getString(id) {
        const s = this.db[id];
        if (s === undefined) {
            console.log("Couldn't find the string with id: " + id);
            return "";
        }
        return s;
    }
}