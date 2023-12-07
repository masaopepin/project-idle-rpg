import { Modal_Generic } from "./modal_generic.js";
import { createGenericButton, createGenericElement, setButtonDisabled } from "../../helpers/helpers_html.js";
import { Input_Range_Number } from "../inputs/input_range_number.js";

/**
 * Class for the upgrade modal.
 * @extends {Modal_Generic}
 */
export class Modal_Upgrade extends Modal_Generic {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the modal.
     */
    constructor(game, parent) {
        super(parent, "modal-upgrade", "modal-lg");
        this.game = game;
        this.upgrade = null;
        this.quantityString = game.languages.getString("quantity") + " ";
        this.buyString = game.languages.getString("buy");
        this.levelString = game.languages.getString("level");

        this.description = createGenericElement(this.modalBody);
        this.level = createGenericElement(this.modalBody);

        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.costLabels = new Set();
        this.costsRoot = this.createCostSection(game, this.modalBody, false);

        this.inputs = new Input_Range_Number(this.modalBody);
        this.inputs.inputRange.oninput = () => { this.updateInputValue(this.inputs.inputRange.value); };
        this.inputs.inputNumber.oninput = () => { this.updateInputValue(this.inputs.inputNumber.value); };

        this.buyButton = createGenericButton(this.modalFooter, {className: "btn btn-success w-100", innerHTML: this.buyString, attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the upgrade modal with a given upgrade.
     * @param {import("../../upgrades/upgrade.js").Upgrade} upgrade The upgrade to associate with the modal.
     */
    update(upgrade) {
        this.upgrade = upgrade;

        const upgradeName = this.game.languages.getString(upgrade.id);
        this.inputs.setNameAttribute(this.quantityString + upgradeName);
        this.modalTitle.innerHTML = upgradeName;
        this.description.innerHTML = this.game.languages.getString(upgrade.id + "_desc");
        this.level.innerHTML = this.levelString + " : " + upgrade.level + " / " + upgrade.levelCap;

        this.costLabels = upgrade.costs.createOwnedCostLabels(this.costsRoot, () => { return this.inputs.value; });
        this.updateInputValue(1);
        this.buyButton.onclick = () => { upgrade.buyLevel(this.game, this.inputs.value); };
    }

    /**
     * Update the inputs and action button.
     * @param {string | number} inputValue The new inputs value string.
     */
    updateInputValue(inputValue) {
        if (this.upgrade === null) {
            return;
        }
        this.updateMax();
        this.inputs.updateValue(inputValue);
        this.updateCosts();
    }

    /** Update the maximum value of the inputs and action button. */
    updateMax() {
        const max = Math.min(this.upgrade.costs.getMaxAmount(), this.upgrade.levelCap - this.upgrade.level);
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