import { Item } from "../items/item.js";
import { Costs } from "../misc/cost.js";
import { Conditions } from "../misc/condition.js";
import { Rewards } from "../misc/reward.js";

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
        this.item = recipeData.id === undefined ? new Item() : game.items.getItem(recipeData.id);
        /** The unique id of the crafting action. */
        this.actionId = recipeData.actionId === undefined ? "error" : recipeData.actionId;
        /** The time in milliseconds it takes to complete an action without multipliers applied. */
        this.baseDuration = recipeData.duration === undefined ? 0 : recipeData.duration;
        /** The costs required per action. */
        this.costs = recipeData.costsData === undefined ? new Costs(game) : new Costs(game, recipeData.costsData);
        /** The conditions required to start the action. */
        this.conditions = recipeData.conditionsData === undefined ? new Conditions(game) : new Conditions(game, recipeData.conditionsData);
        /** The rewards to give at the end of each action. */
        this.rewards = recipeData.rewardsData === undefined ? new Rewards(game) : new Rewards(game, recipeData.rewardsData);
    }
}