import { Modal_Generic } from "./modal_generic.js";
import { createGenericButton, createGenericElement, removeChildren } from "../../helpers/helpers_html.js";
import { toPercent } from "../../helpers/format_string.js";

/**
 * Class for the equipment modal.
 * @extends {Modal_Generic}
 */
export class Modal_Equipment extends Modal_Generic {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the modal.
     */
    constructor(game, parent) {
        super(parent, "modal-equipment", "modal-lg");
        this.game = game;
        const root = createGenericElement(this.modalBody, {className: "row"});
 
        this.description = createGenericElement(root, {className: "col-12 mb-2"});
        this.multipliersRoot = createGenericElement(root, {className: "col-12"});

        this.unequipButton = createGenericButton(this.modalFooter, {
            className: "col btn btn-primary",
            innerHTML: game.languages.getString("unequip"),
            attributes: {"data-bs-dismiss": "modal"}
        });
    }

    /**
     * Update the modal with a given equipment slot.
     * @param {import("../../items/manager_equipment.js").EquipmentSlot} slot The equipment slot to associate with the modal.
     */
    update(slot) {
        const item = slot.item;
        this.modalTitle.innerHTML = item.name;
        this.description.innerHTML = item.description;
        
        removeChildren(this.multipliersRoot);
        for (const [multiplier, value] of Object.entries(item.multipliers)) {
            const multiplierDiv = createGenericElement(this.multipliersRoot, {className: "d-flex"});
            createGenericElement(multiplierDiv, {className: "fs-6", innerHTML: this.game.languages.getString(multiplier)});
            createGenericElement(multiplierDiv, {className: "col text-end fs-6", innerHTML: toPercent(value, 1)});
        }

        this.unequipButton.onclick = () => { slot.unequip(this.game); };
        this.unequipButton.disabled = this.game.inventory.isFull;
    }
}