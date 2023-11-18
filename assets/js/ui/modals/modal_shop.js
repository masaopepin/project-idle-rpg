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
     * @param {string} buyString The buy button string in the current language.
     */
    constructor(game, parent, buyString) {
        super(parent, "modal-shop", "modal-lg");
        this.game = game;
        this.costs = game.errors.costs;
        this.shopItem = null;
        this.quantityString = game.languages.getString("quantity") + " ";
        this.inventoryFullString = game.languages.getString("inventoryFull");
        this.buyString = buyString;

        const root = createGenericElement(this.modalBody, {className: "row"});
        this.description = createGenericElement(root, {className: "col-12 mb-2"});

        const stockDiv = createGenericElement(root, {className: "d-flex flex-column flex-sm-row"});
        // Stock amount
        const stockAmountDiv = createGenericElement(stockDiv, {className: "d-flex"});
        createGenericElement(stockAmountDiv, {innerHTML: "In stock :"});
        this.stockAmount = createGenericElement(stockAmountDiv, {className: "ms-1", innerHTML: "0"});
        // Owned amount
        const ownedAmountDiv = createGenericElement(stockDiv, {className: "d-flex ms-sm-auto"});
        createGenericElement(ownedAmountDiv, {innerHTML: "Currently owned :"});
        this.ownedAmount = createGenericElement(ownedAmountDiv, {className: "ms-1", innerHTML: "0"});


        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.costsLabel = new Set();
        this.costsRoot = createGenericElement(root, {className: "col-12 col-sm-6"});

        this.inputs = new Input_Range_Number(this.modalBody);
        this.inputs.inputRange.oninput = () => { this.updateInputValue(this.inputs.inputRange.value); };
        this.inputs.inputNumber.oninput = () => { this.updateInputValue(this.inputs.inputNumber.value); };

        this.buyButton = createGenericButton(this.modalFooter, {className: "btn btn-success w-100", innerHTML: buyString, attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the shop modal with a given item.
     * @param {import("../../shops/shop.js").ShopItem} shopItem The shop item to associate with the modal.
     * @param {import("../../misc/cost.js").Costs} costs The costs of the item.
     */
    update(shopItem, costs) {
        this.shopItem = shopItem;
        this.costs = costs;

        const item = shopItem.item;
        this.inputs.setNameAttribute(this.quantityString + item.name);
        this.modalTitle.innerHTML = item.name;
        this.description.innerHTML = item.description;
        this.stockAmount.innerHTML = shopItem.stock;
        this.ownedAmount.innerHTML = item.amount;

        for (const [multiplier, value] of Object.entries(item.multipliers)) {

        }
        this.costsLabel = costs.createOwnedCostsLabel(this.costsRoot, () => { return this.inputs.value; });
        this.updateInputValue(1);
        this.buyButton.onclick = () => { shopItem.buyItem(this.game, this.inputs.value); };
    }

    /**
     * Update the inputs and action button.
     * @param {string | number} inputValue The new inputs value string.
     */
    updateInputValue(inputValue) {
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
            max = Math.min(this.costs.getMaxAmount(), this.shopItem.item.maxStack, this.shopItem.stock);
            this.buyButton.innerHTML = this.buyString;
        }
        setButtonDisabled(this.buyButton, max < 1);
        this.inputs.updateMax(max);
    }

    /** Update the costs label. */
    updateCosts() {
        this.costsLabel.forEach((costLabel) => {
            costLabel.update();
        });
    }
}