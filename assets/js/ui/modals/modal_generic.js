import { createGenericElement, removeChildren } from "../../helpers/helpers_html.js";
import { toPercent } from "../../helpers/format_string.js";

/** Base class for modals. */
export class Modal_Generic {
    /**
     * @param {HTMLElement} parent The parent to append the modal.
     * @param {string} id The unique id of the modal.
     * @param {string} size The size class of the modal.
     */
    constructor(parent, id, size) {
        /** The root element of the modal. */
        this.modal = createGenericElement(parent, {className: "modal fade", attributes: {"id": id, "tabIndex": "-1", "aria-hidden": "true"}});
        this.modalDialog = createGenericElement(this.modal, {className: "modal-dialog modal-dialog-centered modal-dialog-scrollable " + size});
        this.modalContent = createGenericElement(this.modalDialog, {className: "modal-content"});

        this.modalHeader = createGenericElement(this.modalContent, {className: "modal-header"});
        this.modalTitle = createGenericElement(this.modalHeader, {tag: "h1", className: "modal-title fs-5"});
        this.modalCloseButton = createGenericElement(this.modalHeader, {tag: "button", className: "btn-close", attributes: {"data-bs-dismiss": "modal", "aria-label": "Close"}});

        this.modalBody = createGenericElement(this.modalContent, {className: "modal-body"});
        this.modalFooter = createGenericElement(this.modalContent, {className: "modal-footer"});
    }

    /**
     * Create an inner section to display costs.
     * @param {import("../../main.js").Game_Instance} game The game instance. 
     * @param {HTMLElement} parent The HTMLElement to append the section.
     * @param {boolean} split Optional boolean to allow the section to take half the space. Defaults to true.
     * @returns The element to append the costs.
     */
    createCostSection(game, parent, split = true) {
        const border = createGenericElement(parent, {className: split ? "col-12 col-sm-6 p-0 pe-sm-1" : ""});
        const section = this.createInnerSection(border, game.languages.getString("costs"));
        return createGenericElement(section);
    }

    /**
     * Create an inner section to display rewards.
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The HTMLElement to append the section.
     * @param {boolean} split Optional boolean to allow the section to take half the space. Defaults to true.
     * @returns The root element of the section.
     */
    createRewardSection(game, parent, split = true) {
        const border = createGenericElement(parent, {className: split ? "col-12 col-sm-6 p-0 ps-sm-1" : ""});
        return this.createInnerSection(border, game.languages.getString("gives"));
    }
    
    /**
     * Create an inner section with optional title.
     * @param {HTMLElement} parent The HTMLElement to append the section.
     * @param {string} className Optional className to add to the root element.
     * @param {string} innerHTML Optional innerHTML to create the title.
     * @returns The root element of the section.
     */
    createInnerSection(parent, innerHTML = "") {
        const root = createGenericElement(parent, {className: "inner-section"});
        if (innerHTML !== "") {
            createGenericElement(root, {className: "d-flex justify-content-center", innerHTML: innerHTML});
        }
        return root;
    }

    /**
     * Create an inner section to display multipliers if the multiplier object isn't empty.
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The HTMLElement to append the section. 
     * @param {Object.<string, number>} multipliers The object containing the multipliers to display. 
     */
    createMultiplierSection(game, parent, multipliers = {}) {
        removeChildren(parent);
        for (const s in multipliers) {
            const root = this.createInnerSection(parent, game.languages.getString("multipliers"));
            for (const [multiplier, value] of Object.entries(multipliers)) {
                const multiplierDiv = createGenericElement(root, {className: "d-flex fs-6"});
                createGenericElement(multiplierDiv, {innerHTML: game.languages.getString(multiplier)});
                createGenericElement(multiplierDiv, {className: "ms-auto", innerHTML: toPercent(value, 1)});
            }
            return;
        }
    }
}