import { Modal_Generic } from "./modal_generic.js";
import { createGenericButton, createGenericElement, setButtonDisabled } from "../../helpers/helpers_html.js";
import { Input_Range_Number } from "../inputs/input_range_number.js";

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
        this.game = game;
        this.inventorySlot = null;
        this.conditions = game.errors.conditions;

        this.equipString = game.languages.getString("equip");
        this.sellString = game.languages.getString("sell");
        this.quantityString = game.languages.getString("quantity") + " ";
 
        this.conditionsLabel = createGenericElement(this.modalBody);
        this.description = createGenericElement(this.modalBody);
        this.multipliers = createGenericElement(this.modalBody);

        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.rewardLabels = new Set();
        this.rewardSection = this.createRewardSection(game, this.modalBody, false);
        this.rewardsRoot = createGenericElement(this.rewardSection);

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
        
        this.conditions = this.game.createConditions(item.conditionsData);
        this.updateConditions();
        this.description.innerHTML = item.description;
        this.createMultiplierSection(this.game, this.multipliers, item.multipliers);

        this.updateInputValue(1);
        this.rewardLabels = this.game.createRewards(item.sellData).createRewardLabels(this.rewardsRoot, () => { return this.inputs.value; });

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
            this.rewardSection.classList.add("d-none");
        }
        else {
            this.sellButton.onclick = () => { inventorySlot.sellItem(this.game, this.inputs.value); };
            this.sellButton.classList.remove("d-none");
            this.inputs.root.classList.remove("d-none");
            this.rewardSection.classList.remove("d-none");
        }
    }

    /** Update the conditions label innerHTML. */
    updateConditions() {
        this.conditionsLabel.innerHTML = this.conditions.getConditionsString();
    }

    /**
     * Update the inputs and sell button.
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

    /** Update the reward labels. */
    updateRewards() {
        this.rewardLabels.forEach((rewardLabel) => {
            rewardLabel.update();
        });
    }
}