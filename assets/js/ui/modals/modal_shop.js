import { Modal_Generic } from "./modal_generic.js";
import { createGenericButton, createGenericElement, setButtonDisabled } from "../../helpers/helpers_html.js";
import { Input_Range_Number } from "../inputs/input_range_number.js";

/**
 * Class for the shop modal.
 * @extends {Modal_Generic}
 */
export class Modal_Shop extends Modal_Generic {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the modal.
     */
    constructor(game, parent) {
        super(parent, "modal-shop", "modal-lg");
        this.game = game;
        this.shopItem = null;
        this.item = game.errors.item;
        this.costs = game.errors.costs;
        this.quantityString = game.languages.getString("quantity") + " ";
        this.inventoryFullString = game.languages.getString("error_inventoryFull");
        this.buyString = game.languages.getString("buy");

        this.description = createGenericElement(this.modalBody);

        const stockDiv = createGenericElement(this.modalBody, {className: "d-flex flex-column flex-sm-row"});
        // Stock amount
        const stockAmountDiv = createGenericElement(stockDiv, {className: "d-flex"});
        createGenericElement(stockAmountDiv, {innerHTML: game.languages.getString("inStock")});
        this.stockAmount = createGenericElement(stockAmountDiv, {className: "ms-1", innerHTML: "0"});
        // Inventory amount
        const inventoryAmountDiv = createGenericElement(stockDiv, {className: "d-flex ms-sm-auto"});
        createGenericElement(inventoryAmountDiv, {innerHTML: game.languages.getString("inInventory")});
        this.inventoryAmount = createGenericElement(inventoryAmountDiv, {className: "ms-1", innerHTML: "0"});


        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.costLabels = new Set();
        this.costsRoot = this.createCostSection(game, this.modalBody, false);

        this.inputs = new Input_Range_Number(this.modalBody);
        this.inputs.inputRange.oninput = () => { this.updateInputs(this.inputs.inputRange.value); };
        this.inputs.inputNumber.oninput = () => { this.updateInputs(this.inputs.inputNumber.value); };

        this.buyButton = createGenericButton(this.modalFooter, {className: "btn btn-success w-100", innerHTML: this.buyString, attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the shop modal with a given shop item.
     * @param {import("../../shops/shop.js").ShopItem} shopItem The shop item to associate with the modal.
     * @param {import("../../items/item.js").Item} item The item to associate with the modal.
     * @param {import("../../misc/cost.js").Costs} costs The costs of the item.
     */
    update(shopItem, item, costs) {
        this.shopItem = shopItem;
        this.item = item;
        this.costs = costs;

        this.inputs.setNameAttribute(this.quantityString + item.name);
        this.modalTitle.innerHTML = item.name;
        this.description.innerHTML = item.description;
        this.stockAmount.innerHTML = shopItem.stock;
        this.inventoryAmount.innerHTML = item.amount;

        for (const [multiplier, value] of Object.entries(item.multipliers)) {

        }
        this.costLabels = costs.createOwnedCostLabels(this.costsRoot, () => { return this.inputs.value; });
        this.updateInputs(1);
        this.buyButton.onclick = () => { this.shopItem.buy(this.game, this.inputs.value); };
    }

    /**
     * Update the inputs and action button.
     * @param {string | number} inputValue The new inputs value string.
     */
    updateInputs(inputValue) {
        if (this.shopItem === null) {
            return;
        }
        this.updateMax();
        this.inputs.updateValue(inputValue);
        this.updateCosts();
    }

    /** Update the maximum value of the inputs and action button. */
    updateMax() {
        let max = 0;
        if (this.game.inventory.isFull) {
            this.buyButton.innerHTML = this.inventoryFullString;
        }
        else {
            max = Math.min(this.costs.getMaxAmount(), this.item.maxStack, this.shopItem.stock);
            this.buyButton.innerHTML = this.buyString;
        }
        setButtonDisabled(this.buyButton, max < 1);
        this.inputs.updateMax(max);
    }

    /** Update the cost labels. */
    updateCosts() {
        this.costLabels.forEach((costLabel) => {
            costLabel.update();
        });
    }
}