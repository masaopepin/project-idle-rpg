import { Modal_Generic } from "./modal_generic.js";
import { createGenericElement, setButtonDisabled } from "../../helpers/helpers_html.js";
import { Duration_Label } from "../labels/icon_label.js";
import { Input_Range_Number } from "../inputs/input_range_number.js";
import { Action_Row } from "../action_row.js";

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
        this.inventoryFullString = game.languages.getString("error_inventoryFull");
        this.actionString = "";
 
        this.description = createGenericElement(this.modalBody);

        // Costs
        const costRewardRow = createGenericElement(this.modalBody, {className: "row"});
        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.costLabels = new Set();
        this.costsRoot = this.createCostSection(game, costRewardRow);

        // Rewards
        /** @type {Set.<import("../labels/icon_label.js").Icon_Label>} */
        this.rewardLabels = new Set();
        const rewardSection = this.createRewardSection(game, costRewardRow);
        this.rewardsRoot = createGenericElement(rewardSection);
        this.durationLabel = new Duration_Label(game, rewardSection, {skill: skill});
        
        // Action row
        this.actionRow = new Action_Row(game, this.modalFooter, null, game.languages.getString("stop"));
        this.actionRow.row.classList.add("w-100", "mt-0");

        // Inputs
        this.inputs = new Input_Range_Number(this.modalBody);
        this.inputs.inputRange.oninput = () => { this.updateInput(this.inputs.inputRange.value); };
        this.inputs.inputNumber.oninput = () => { this.updateInput(this.inputs.inputNumber.value); };

        this.actionButton = createGenericElement(this.modalFooter, {tag: "button", className: "btn btn-success w-100", attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the crafting modal with a given crafting recipe.
     * @param {import("../../skills/crafting_recipe.js").Crafting_Recipe} recipe The crafting recipe to associate with the modal.
     */
    update(recipe) {
        this.craftingRecipe = recipe;
        this.actionString = this.game.languages.getString(recipe.actionId);
        this.modalTitle.innerHTML = recipe.item.name;
        this.description.innerHTML = recipe.item.description;
        this.inputs.setNameAttribute(this.quantityString + recipe.item.name);

        this.durationLabel.baseDuration = recipe.baseDuration;
        const action = this.game.actions.getCraftingAction(recipe.item.id);
        if (action === null) {
            this.hideActionRow();
        }
        else {
            this.showActionRow(action);
        }

        this.costLabels = recipe.costs.createOwnedCostLabels(this.costsRoot, () => { return this.inputs.value; });
        this.rewardLabels = recipe.rewards.createRewardLabels(this.rewardsRoot, () => { return this.inputs.value; });
        this.actionButton.onclick = () => { this.craftingRecipe.startCrafting(this.inputs.value); };
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

    /** Update the maximum value of the inputs and the action button. */
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

    /** Update the cost labels. */
    updateCosts() {
        this.costLabels.forEach((costLabel) => { costLabel.update(); });
    }

    /** Update the reward labels. */
    updateRewards() {
        this.rewardLabels.forEach((rewardLabel) => { rewardLabel.update(); });
        this.durationLabel.update(this.inputs.value);
    }

    /**
     * Show the action row and hide the inputs.
     * @param {import("../../actions/action.js").Action} action The action to associate with the row.
     */
    showActionRow(action) {
        this.actionRow.row.classList.remove("d-none");
        this.inputs.root.classList.add("d-none");
        this.actionButton.classList.add("d-none");
        this.actionRow.setAction(this.game, action);
        this.updateInput(1);
    }

    /** Hide the action row and show the inputs. */
    hideActionRow() {
        this.actionRow.row.classList.add("d-none");
        this.inputs.root.classList.remove("d-none");
        this.actionButton.classList.remove("d-none");
        this.updateInput(this.craftingRecipe.costs.getMaxAmount());
    }
}