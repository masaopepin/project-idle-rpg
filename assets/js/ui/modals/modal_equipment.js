import { Modal_Generic } from "./modal_generic.js";
import { createGenericButton, createGenericElement } from "../../helpers/helpers_html.js";

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
        this.unequipString = game.languages.getString("unequip");
        this.inventoryFullString = game.languages.getString("error_inventoryFull");

        this.description = createGenericElement(this.modalBody);
        this.multipliers = createGenericElement(this.modalBody);

        this.unequipButton = createGenericButton(this.modalFooter, {className: "col btn btn-primary", attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the modal with a given equipment slot.
     * @param {import("../../items/manager_equipment.js").EquipmentSlot} slot The equipment slot to associate with the modal.
     */
    update(slot) {
        const item = slot.item;
        this.modalTitle.innerHTML = item.name;
        this.description.innerHTML = item.description;
        this.createMultiplierSection(this.game, this.multipliers, item.multipliers);

        if (this.game.inventory.isFull) {
            this.unequipButton.onclick = () => {};
            this.unequipButton.disabled = true;
            this.unequipButton.innerHTML = this.inventoryFullString;
        }
        else {
            this.unequipButton.onclick = () => { slot.unequip(this.game); };
            this.unequipButton.disabled = false;
            this.unequipButton.innerHTML = this.unequipString;
        }
    }
}