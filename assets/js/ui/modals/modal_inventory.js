import { Modal_Generic } from "./modal_generic.js";
import { createGenericButton, createGenericElement, removeChildren, setButtonDisabled } from "../../helpers/helpers_html.js";
import { Input_Range_Number } from "../inputs/input_range_number.js";
import { toPercent } from "../../helpers/format_string.js";
import { Rewards } from "../../misc/reward.js";
import { Conditions } from "../../misc/condition.js";

/**
 * Class for the inventory modal.
 * @extends {Modal_Generic}
 */
export class Modal_Inventory extends Modal_Generic {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the modal.
     */
    constructor(game, parent) {
        super(parent, "modal-inventory", "modal-lg")
        const root = createGenericElement(this.modalBody, {className: "row"});
        this.game = game;
        this.inventorySlot = null;
        this.conditions = game.errors.conditions;

        this.equipString = game.languages.getString("equip");
        this.sellString = game.languages.getString("sell");
        this.quantityString = game.languages.getString("quantity") + " ";
 
        this.conditionsLabel = createGenericElement(root);
        this.description = createGenericElement(root, {className: "col-12 mb-2"});
        this.multipliersRoot = createGenericElement(root, {className: "col-12"});

        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.rewardsLabel = new Set();
        this.rewardsRoot = createGenericElement(root, {className: "col-12 my-1"});

        this.inputs = new Input_Range_Number(this.modalBody);
        this.inputs.inputRange.oninput = () => { this.updateInputValue(this.inputs.inputRange.value); };
        this.inputs.inputNumber.oninput = () => { this.updateInputValue(this.inputs.inputNumber.value); };

        this.equipButton = createGenericButton(this.modalFooter, {className: "col btn btn-primary", innerHTML: this.equipString, attributes: {"data-bs-dismiss": "modal"}});
        this.sellButton = createGenericButton(this.modalFooter, {className: "col btn btn-success", innerHTML: this.sellString, attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the inventory modal with a given item.
     * @param {import("../../items/manager_inventory.js").InventorySlot} inventorySlot The inventory slot to associate with the modal.
     */
    update(inventorySlot) {
        this.inventorySlot = inventorySlot;
        const item = inventorySlot.item;
        this.inputs.setNameAttribute(this.quantityString + item.name);
        this.modalTitle.innerHTML = item.name;
        this.conditions = new Conditions(this.game, item.conditionsData);
        this.updateConditions();
        this.description.innerHTML = item.description;
        
        // Multipliers
        removeChildren(this.multipliersRoot);
        for (const [multiplier, value] of Object.entries(item.multipliers)) {
            const multiplierDiv = createGenericElement(this.multipliersRoot, {className: "d-flex"});
            createGenericElement(multiplierDiv, {className: "fs-6", innerHTML: this.game.languages.getString(multiplier)});
            createGenericElement(multiplierDiv, {className: "col text-end fs-6", innerHTML: toPercent(value, 1)});
        }
        this.updateInputValue(1);

        this.rewardsLabel = new Rewards(this.game, item.sellData).createRewardsLabel(this.rewardsRoot, () => { return this.inputs.value; });

        // Equip button
        const equipmentSlot = this.game.equipments.getEquipmentSlot(item.typeId);
        if (equipmentSlot === null) {
            this.equipButton.classList.add("d-none");
            this.equipButton.onclick = () => {};
        }
        else {
            this.equipButton.disabled = this.conditionsLabel.innerHTML !== "" || (equipmentSlot.item !== null && this.game.inventory.isFull);
            this.equipButton.onclick = () => { equipmentSlot.equip(this.game, inventorySlot); };
            this.equipButton.classList.remove("d-none");
        }

        // Sell button
        if (item.sellData.length === 0) {
            this.sellButton.onclick = () => {};
            this.sellButton.classList.add("d-none");
            this.inputs.root.classList.add("d-none");
        }
        else {
            this.sellButton.onclick = () => { inventorySlot.sellItem(this.game, this.inputs.value); };
            this.sellButton.classList.remove("d-none");
            this.inputs.root.classList.remove("d-none");
        }
    }

    /** Update the conditions label innerHTML. */
    updateConditions() {
        this.conditionsLabel.innerHTML = this.conditions.getConditionsString();
    }

    /**
     * Update the inputs and action button.
     * @param {string | number} inputValue The new inputs value string.
     */
    updateInputValue(inputValue) {
        this.updateMax();
        this.inputs.updateValue(inputValue);
        this.updateRewards();
    }

    /** Update the maximum value of the inputs and action button. */
    updateMax() {
        const max = this.inventorySlot === null || this.inventorySlot.save.amount < 1 ? 0 : this.inventorySlot.save.amount;
        setButtonDisabled(this.sellButton, max < 1);
        this.inputs.updateMax(max);
    }

    /** Update the rewards label. */
    updateRewards() {
        this.rewardsLabel.forEach((rewardLabel) => {
            rewardLabel.update();
        });
    }
}