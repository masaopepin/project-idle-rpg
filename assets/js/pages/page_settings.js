import { Page } from "./page.js";
import { createGenericElement, createGenericInput, createOpenModalButton } from "../helpers/helpers_html.js";
import { Dropdown_Generic } from "../ui/dropdowns/dropdown_generic.js";

/** 
 * Page for the settings.
 * @extends {Page}
 */
export class Page_Settings extends Page {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        super(game, "settings");

        this.languageLabel = null;
        this.languageDropdown = null;
        this.themeLabel = null;
        this.themeDropdown = null;
        this.autoSaveLabel = null;
        this.autoSaveInput = null;
        this.deleteCharaterButtton = null;
        this.restoreSettingsButton = null;
    }
    
    enter() {
        super.enter();

        // Language
        const languageRow = this.createSettingRow(this.container);
        this.languageLabel = this.createSettingLabel(languageRow, this.game.languages.getString("language"), "languageDropdown");
        this.languageDropdown = new Dropdown_Generic(languageRow, "languageDropdown", {
            className: "col",
            itemList: this.game.languages.languages,
            activeItem: this.game.settings.language,
            onclick: (e) => { this.game.languages.setLanguage(this.game, e.currentTarget.innerHTML); }
        });

        // Theme
        const themeRow = this.createSettingRow(this.container);
        this.themeLabel = this.createSettingLabel(themeRow, this.game.languages.getString("theme"), "themeDropdown");
        this.themeDropdown = new Dropdown_Generic(themeRow, "themeDropdown", {className: "col"});
        this.createThemeList();

        // Auto-save
        const autoSaveRow = this.createSettingRow(this.container);
        this.autoSaveLabel = this.createSettingLabel(autoSaveRow, this.game.languages.getString("autoSaveInterval"), "autoSaveInput");

        const autoSaveInputDiv = createGenericElement(autoSaveRow, {className: "col"});
        const startingValue = this.game.settings.autoSave <= 0 ? 0 : this.game.settings.autoSave / 1000;
        this.autoSaveInput = createGenericInput(autoSaveInputDiv, {
            className: "form-control m-auto",
            attributes: {id: "autoSaveInput", type: "number", min: "0", value: startingValue}
        });
        this.autoSaveInput.addEventListener("blur", () => {
            const value = Number(this.autoSaveInput.value);
            if (value !== NaN && value >= 0 && value !== this.game.settings.autoSave) {
                this.game.settings.setSetting("autoSave", value * 1000);
            }
         });

        const saveGameRow = createGenericElement(this.container, {className: "row mt-5"});
        // Delete character
        this.deleteCharaterButtton = createOpenModalButton(saveGameRow, {
            className: "col btn btn-danger rounded-0",
            innerHTML: this.game.languages.getString("deleteCharacter")
        }, {
            id: "#modal-confirm",
            onclick: () => { this.game.pages.modalConfirm.update(this.game, "confirm_deleteCharacter", () => { this.deleteCharacter(); })}
        });

        // Restore settings
        this.restoreSettingsButton = createOpenModalButton(saveGameRow, {
            className: "col btn btn-danger rounded-0",
            innerHTML: this.game.languages.getString("restoreSettings")
        }, {
            id: "#modal-confirm",
            onclick: () => { this.game.pages.modalConfirm.update(this.game, "confirm_restoreSettings", () => { this.restoreSettings(); })}
        });

        document.addEventListener("languageLoaded", (e) => { this.languageLoaded(e); }, {signal: this.abortController.signal});
    }
    
    update() {}
    
    exit () {
        super.exit();
        this.languageLabel = null;
        this.languageDropdown = null;
        this.themeLabel = null;
        this.themeDropdown = null;
        this.autoSaveLabel = null;
        this.autoSaveInput = null;
        this.deleteCharaterButtton = null;
        this.restoreSettingsButton = null;
    }

    languageLoaded(e) {
        /** @type {import("../events/manager_event.js").languageLoaded} */
        const eventData = e.eventData;

        if (this.languageDropdown !== null) {
            this.languageDropdown.setActiveItemFromName(eventData.language);
        }
        if (this.themeDropdown !== null) {
            this.createThemeList();
        }
        if (this.languageLabel !== null) {
            this.languageLabel.innerHTML = this.game.languages.getString("language");
        }
        if (this.themeLabel !== null) {
            this.themeLabel.innerHTML = this.game.languages.getString("theme");
        }
        if (this.autoSaveLabel !== null) {
            this.autoSaveLabel.innerHTML = this.game.languages.getString("autoSaveInterval");
        }
        if (this.deleteCharaterButtton !== null) {
            this.deleteCharaterButtton.innerHTML = this.game.languages.getString("deleteCharacter");
        }
        if (this.restoreSettingsButton !== null) {
            this.restoreSettingsButton.innerHTML = this.game.languages.getString("restoreSettings");
        }
    }

    /**
     * Create a row to display a setting.
     * @param {HTMLElement} parent The HTMLElement to append the row.
     * @returns The row element.
     */
    createSettingRow(parent) {
        return createGenericElement(parent, {className: "row align-items-center section"});
    }

    /**
     * Create a label for a given setting.
     * @param {HTMLElement} parent The HTMLElement to append the label.
     * @param {string} innerHTML The innerHTML of the label.
     * @param {string} forId The unique id of the element associated with the label.
     * @returns The label element.
     */
    createSettingLabel(parent, innerHTML, forId) {
        return createGenericElement(parent, {tag: "label", className: "col col-form-label", innerHTML: innerHTML, attributes: {"for": forId}});
    }

    /** Create the list of valid theme in the current language. */
    createThemeList() {
        if (this.themeDropdown === null) {
            return;
        }
        this.themeDropdown.createItemsFromStringsId(this.game, this.game.settings.themes, {activeItem: this.game.settings.theme, onclick: (e) => {
            const themeId = this.themeDropdown.getItemStringId(e.currentTarget);
            if (this.game.settings.isValidTheme(themeId)) {
                document.documentElement.setAttribute("data-bs-theme", themeId);
                this.game.settings.setSetting("theme", themeId);
                this.themeDropdown.setActiveItem(e.currentTarget);
            }
        }});
    }

    /** Delete the player save from the local storage and reload the page. */
    deleteCharacter() {
        localStorage.removeItem("Player");
        location.reload();
    }

    /** Delete the settings save from the local storage and reload the page. */
    restoreSettings() {
        localStorage.removeItem("Settings");
        location.reload();
    }
}