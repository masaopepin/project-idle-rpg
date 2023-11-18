import { Modal_Generic } from "./modal_generic.js";
import { createGenericElement, setButtonDisabled } from "../../helpers/helpers_html.js";
import { Duration_Label } from "../labels/icon_label.js";
import { Input_Range_Number } from "../inputs/input_range_number.js";

/**
 * Class for the crafting modal.
 * @extends {Modal_Generic}
 */
export class Modal_Crafting extends Modal_Generic {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the modal.
     * @param {import("../../skills/skill.js").Skill} skill The skill to associate with the duration label.
     */
    constructor(game, parent, skill) {
        super(parent, "modal-crafting", "modal-lg")
        this.game = game;
        this.craftingRecipe = game.errors.craftingRecipe;
        this.quantityString = game.languages.getString("quantity") + " ";
        this.inventoryFullString = game.languages.getString("inventoryFull");
        this.actionString = "";
 
        const root = createGenericElement(this.modalBody, {className: "row"});
        this.description = createGenericElement(root, {className: "col-12 mb-2"});

        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.costsLabel = new Set();
        this.costsRoot = createGenericElement(root, {className: "col-12 col-sm-6"});

        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.rewardsLabel = new Set();
        const rewardsDiv = createGenericElement(root, {className: "col-12 col-sm-6"});
        this.rewardsRoot = createGenericElement(rewardsDiv);
        this.durationLabel = new Duration_Label(game, rewardsDiv, {skill: skill});

        this.inputs = new Input_Range_Number(this.modalBody);
        this.inputs.inputRange.oninput = () => { this.updateInput(this.inputs.inputRange.value); };
        this.inputs.inputNumber.oninput = () => { this.updateInput(this.inputs.inputNumber.value); };

        this.actionButton = createGenericElement(this.modalFooter, {tag: "button", className: "btn btn-success w-100", attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the crafting modal with a given crafting recipe.
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {import("../../skills/crafting_recipe.js").Crafting_Recipe} recipe The crafting recipe to associate with the modal.
     */
    update(game, recipe) {
        this.craftingRecipe = recipe;
        this.actionString = this.game.languages.getString(recipe.actionId);
        this.modalTitle.innerHTML = recipe.item.name;
        this.description.innerHTML = recipe.item.description;
        this.inputs.setNameAttribute(this.quantityString + recipe.item.name);

        this.durationLabel.baseDuration = recipe.baseDuration;
        this.updateInput(recipe.costs.getMaxAmount());

        this.costsLabel = recipe.costs.createOwnedCostsLabel(this.costsRoot, () => { return this.inputs.value; });
        this.rewardsLabel = recipe.rewards.createRewardsLabel(this.rewardsRoot, () => { return this.inputs.value; });

        this.actionButton.onclick = () => { recipe.skill.startCrafting(recipe, this.inputs.value); };
    }

    /**
     * Update the inputs, costs, rewards and the action button.
     * @param {string | number} inputValue The new inputs value string.
     */
    updateInput(inputValue) {
        this.updateMax();
        this.inputs.updateValue(inputValue);
        this.updateCosts();
        this.updateRewards();
    }

    /** Update the maximum value of the inputs and action button. */
    updateMax() {
        let max = 0;
        if (this.game.inventory.isFull) {
            this.actionButton.innerHTML = this.inventoryFullString;
        }
        else {
            max = this.craftingRecipe.costs.getMaxAmount();
            this.actionButton.innerHTML = this.actionString;
        }
        setButtonDisabled(this.actionButton, max < 1);
        this.inputs.updateMax(max);
    }

    /** Update the costs label. */
    updateCosts() {
        this.costsLabel.forEach((costLabel) => {
            costLabel.update();
        });
    }

    /** Update the rewards label. */
    updateRewards() {
        this.rewardsLabel.forEach((rewardLabel) => {
            rewardLabel.update();
        });
        this.durationLabel.update(this.inputs.value);
    }
}