import { Crafting_Recipe } from "../skills/crafting_recipe.js";
import { Gathering_Node } from "../skills/gathering_node.js";
import { Skill } from "../skills/skill.js";

/** Manager class for the errors. */
export class Manager_Error {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The item error. */
        this.item = game.createItem();
        /** The conditions error. */
        this.conditions = game.createConditions();
        /** The costs error. */
        this.costs = game.createCosts();
        /** The rewards error. */
        this.rewards = game.createRewards();
        /** The skill error. */
        this.skill = new Skill(game);
        /** The crafting recipe error. */
        this.craftingRecipe = new Crafting_Recipe(game, this.skill);
        /** The gathering node error. */
        this.gatheringNode = new Gathering_Node(game, this.skill);
    }
}