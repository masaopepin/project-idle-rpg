import { Icon_Label } from "../ui/labels/icon_label.js";
import { createGenericElement, createOpenModalButton } from "../helpers/helpers_html.js";

/**
 * @typedef CraftingRecipeData
 * @prop {string} id The unique id of the crafted item.
 * @prop {string} actionId The unique id of the crafting action.
 * @prop {number} duration The time in milliseconds it takes to complete an action.
 * @prop {import("../misc/cost.js").CostData[]} costsData The costs data required per action.
 * @prop {import("../misc/condition.js").ConditionData[]} conditionsData The conditions data required to start the action.
 * @prop {import("../misc/reward.js").RewardData[]} rewardsData The rewards data to give at the end of each action.
 */

/** Class for crafting recipe that the player can craft. */
export class Crafting_Recipe {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {import("./skill.js").Skill} skill The skill to associate with the crafting recipe.
     * @param {CraftingRecipeData} recipeData An object containing info about the crafting recipe.
     */
    constructor(game, skill, recipeData = {}) {
        /** The skill associated with the recipe. */
        this.skill = skill;
        /** The item crafted by the recipe. */
        this.item = recipeData.id === undefined ? game.createItem() : game.items.getItem(recipeData.id);
        /** The unique id of the crafting action. */
        this.actionId = recipeData.actionId === undefined ? "error" : recipeData.actionId;
        /** The time in milliseconds it takes to complete an action without multipliers applied. */
        this.baseDuration = recipeData.duration === undefined ? 0 : recipeData.duration;
        /** The costs required per action. */
        this.costs = recipeData.costsData === undefined ? game.createCosts() : game.createCosts(recipeData.costsData);
        /** The conditions required to start the action. */
        this.conditions = recipeData.conditionsData === undefined ? game.createConditions() : game.createConditions(recipeData.conditionsData);
        /** The rewards to give at the end of each action. */
        this.rewards = recipeData.rewardsData === undefined ? game.createRewards() : game.createRewards(recipeData.rewardsData);
    }

    /**
     * Start a crafting action for the recipe.
     * @param {number} amount The number of crafting loops.
     */
    startCrafting(amount) {
        this.skill.startCrafting(this, amount);
    }

    /**
     * Create a button to open the crafting modal for the recipe.
     * @param {HTMLElement} parent The parent to append the button.
     * @param {import("../ui/modals/modal_crafting.js").Modal_Crafting} modal The modal to open on click.
     * @returns The icon label inside the button.
     */
    createButton(parent, modal) {
        const root = createGenericElement(parent, {className: "col-12 col-md-6"});
        const modalButton = createOpenModalButton(root, {className: "btn btn-body w-100"}, {id: "#modal-crafting", onclick: () => { modal.update(this); }});
        const label = new Icon_Label(modalButton, {
            source: this.item.icon,
            updateFunction: () => {
                const conditionsString = this.conditions.getConditionsString();
                if (conditionsString === "") {
                    modalButton.disabled = false;
                    return this.item.name;
                }
                modalButton.disabled = true;
                return conditionsString;
            }
        });
        return label;
    }
}