import { Action } from "../actions/action.js";
import { Conditions } from "../misc/condition.js";
import { Costs } from "../misc/cost.js";
import { Item } from "../items/item.js";
import { Rewards } from "../misc/reward.js";
import { Crafting_Recipe } from "../skills/crafting_recipe.js";
import { Gathering_Node } from "../skills/gathering_node.js";
import { Skill } from "../skills/skill.js";

/** Manager class for the errors. */
export class Manager_Error {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The item error. */
        this.item = new Item();
        /** The skill error. */
        this.skill = new Skill(game);
        /** The crafting recipe error. */
        this.craftingRecipe = new Crafting_Recipe(game, this.skill);
        /** The gathering node error. */
        this.gatheringNode = new Gathering_Node(game, this.skill);
        /** The action error. */
        this.action = new Action(game);
        /** The conditions error. */
        this.conditions = new Conditions(game);
        /** The costs error. */
        this.costs = new Costs(game);
        /** The rewards error. */
        this.rewards = new Rewards(game);
    }
}