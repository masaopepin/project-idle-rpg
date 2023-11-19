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
    }
    
    enter() {
        super.enter();

        // Language
        const languageRow = createGenericElement(this.container, {className: "row align-items-center section"});
        this.languageLabel = this.createSettingLabel(languageRow, this.game.languages.getString("language"), "languageDropdown");
        this.languageDropdown = new Dropdown_Generic(languageRow, "languageDropdown", {
            className: "col-12 col-sm-6",
            itemList: this.game.languages.languages,
            activeItem: this.game.settings.language,
            onclick: (e) => { this.game.languages.setLanguage(this.game, e.currentTarget.innerHTML); }
        });

        // Auto-save
        const autoSaveRow = createGenericElement(this.container, {className: "row align-items-center section"});
        this.autoSaveLabel = this.createSettingLabel(autoSaveRow, this.game.languages.getString("autoSaveInterval"), "autoSaveInput");

        const autoSaveInputDiv = createGenericElement(autoSaveRow, {className: "col-12 col-sm-6 m-auto"});
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

        // Delete saves
        const saveGameRow = createGenericElement(this.container, {className: "row section"});
        createOpenModalButton(saveGameRow, {
            className: "col btn btn-dark",
            innerHTML: this.game.languages.getString("deleteCharacter")
        }, {
            id: "#modal-confirm",
            onclick: () => { this.game.pages.modalConfirm.update(this.game, "confirm_deleteCharacter", () => { this.deleteCharacter(); })}
        });
        createOpenModalButton(saveGameRow, {
            className: "col btn btn-dark",
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
    }

    languageLoaded(e) {
        /** @type {import("../events/manager_event.js").languageLoaded} */
        const eventData = e.eventData;

        if (this.languageDropdown !== null) {
            this.languageDropdown.setActiveItemFromName(eventData.language);
        }
        
        this.languageLabel.innerHTML = this.game.languages.getString("language");
        this.autoSaveLabel.innerHTML = this.game.languages.getString("autoSaveInterval");
    }

    /**
     * Create a label for a given setting.
     * @param {HTMLElement} parent Parent to append the label.
     * @param {string} innerHTML The innerHTML of the label.
     * @param {string} forId The unique id of the element associated with the label.
     * @returns The label element.
     */
    createSettingLabel(parent, innerHTML, forId) {
        return createGenericElement(parent, {
            tag: "label",
            className: "col-12 col-sm-6 col-form-label",
            innerHTML: innerHTML,
            attributes: {for: forId}
        });
    }

    deleteCharacter() {
        localStorage.removeItem("Player");
        location.reload();
    }

    restoreSettings() {
        localStorage.removeItem("Settings");
        location.reload();
    }
}