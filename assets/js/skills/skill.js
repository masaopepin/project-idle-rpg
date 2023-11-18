import { toPercent } from "../helpers/format_string.js";
import { Crafting_Recipe } from "./crafting_recipe.js";
import { Gathering_Node } from "./gathering_node.js";

/**
 * @typedef SkillData
 * @prop {string} id The unique id of the skill.
 * @prop {string} icon The icon of the skill.
 * @prop {import("./gathering_node.js").GatheringNodeData[]} gatheringNodesData The data of all gathering nodes of the skill.
 * @prop {Object.<string, import("./crafting_recipe.js").CraftingRecipeData[]>} craftingRecipesData The data of all crafting recipes of the skill.
 */

/**
 * @typedef SkillSave
 * @prop {string} id The unique id of the skill.
 * @prop {number} level The current level of the skill.
 * @prop {number} xp The current xp of the skill.
 */

/** Base class for all skills. */
export class Skill {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {SkillData} skillData An object containing info about the skill.
     */
    constructor(game, skillData = {}) {
        /** The game instance. */
        this.game = game;
        /** The unique id of the skill. */
        this.id = skillData.id === undefined ? "error" : skillData.id;
        /** The display name of the skill. */
        this.name = ""; 
        /** The icon of the skill. */
        this.icon = skillData.icon === undefined ? "" : skillData.icon;
        /** @private The current level of the skill. */
        this._level = 1;
        /** @private The current xp of the skill. */
        this._xp = 0;
        /** An array of all gathering nodes of the skill. */
        this.gatheringNodesData = skillData.gatheringNodesData === undefined ? null : skillData.gatheringNodesData;
        /** An array of all crafting recipes data of the skill. */
        this.craftingRecipesData = skillData.craftingRecipesData === undefined ? null : skillData.craftingRecipesData;
    }

    /** The current level of the skill. */
    get level() {
        return this._level;
    }

    /** The current xp of the skill. */
    get xp() {
        return this._xp;
    }

    /** The max xp for the current level. */
    get maxXp() {
        return Math.pow(this.level * 2, 2);
    }
    /** The xp percent formatted to 2 digits after the decimal. */
    get xpPercent() {
        return toPercent(this.xp, this.maxXp);
    }
    
    /** The current skill xp multiplier. */
    get xpMultiplier() {
        return this.game.multipliers.getMultiplier(this.id + "_xp");
    }

    /** The current skill duration multiplier. */
    get durationMultiplier() {
        return this.game.multipliers.getMultiplier(this.id + "_duration");
    }

    /** @returns {SkillSave} An object containing info about the skill to save. */
    save() {
        return {
            id: this.id,
            level: this.level,
            xp: this.xp
        }
    }

    /**
     * Load the saved skill data into the class.
     * @param {SkillSave} skillSave An object containing info about the saved skill.
     */
    load(skillSave = {}) {
        if (skillSave.level !== undefined && !isNaN(skillSave.level)) {
            this._level = skillSave.level;
        }
        if (skillSave.xp !== undefined && !isNaN(skillSave.xp)) {
            this._xp = skillSave.xp;
        }
    }
    
    /**
     * Start gathering on the given node.
     * @param {Gathering_Node} node Gathering node to start the action.
     */
    startGathering(node) {
        /** @type {import("../actions/action.js").ActionData} */
        const actionData = {
            id: node.actionId,
            type: "gathering",
            gatheringNode: node,
        }
        this.game.actions.startAction(actionData);
    }

    /**
     * Create a gathering node from the given data.
     * @param {import("./gathering_node.js").GatheringNodeData} gatheringNodeData The data to create the gathering node.
     * @returns The gathering node.
     */
    createGatheringNode(gatheringNodeData = {}) {
        return new Gathering_Node(this.game, this, gatheringNodeData);
    }

    /**
     * Create a gathering node from the given id.
     * @param {string} id The unique id of the gathering node.
     * @returns The gathering node.
     */
    createGatheringNodeFromId(id = "error") {
        if (this.gatheringNodesData !== null) {
            for (const data of this.gatheringNodesData) {
                if (data.id === id) {
                    return this.createGatheringNode(data);
                }
            }
        }
        console.log("Failed to create gathering node from id: " + id);
        return this.game.errors.gatheringNode;
    }

    /**
     * Start crafting the given recipe.
     * @param {Crafting_Recipe} recipe Crafting recipe to start the action.
     * @param {number} amount The number of crafting loops.
     */
    startCrafting(recipe, amount = 1) {
        /** @type {import("../actions/action.js").ActionData} */
        const actionData = {
            id: recipe.actionId,
            type: "crafting",
            loop: amount,
            craftingRecipe: recipe,
        }
        this.game.actions.startAction(actionData);
    }

    /**
     * Create a crafting recipe from the given data.
     * @param {import("./crafting_recipe.js").CraftingRecipeData} craftingRecipeData The data to create the crafting recipe.
     * @returns The crafting recipe.
     */
    createCraftingRecipe(craftingRecipeData = {}) {
        return new Crafting_Recipe(this.game, this, craftingRecipeData);
    }

    /**
     * Create a crafting recipe from the given id.
     * @param {string} id The unique id of the crafting recipe.
     * @returns The crafting recipe.
     */
    createCraftingRecipeFromId(id = "error") {
        if (this.craftingRecipesData !== null) {
            for (const recipesData of Object.values(this.craftingRecipesData)) {
                for (const data of recipesData) {
                    if (data.id === id) {
                        return this.createCraftingRecipe(data);
                    }
                }
            }
        }
        console.log("Failed to create crafting recipe from id: " + id);
        return this.game.errors.craftingRecipe;
    }

    /**
     * Add a specified amount of xp, leveling up as needed.
     * @param {number} amount The amount of xp to add.
     */
    addXp(amount) {
        const startAmount = amount;
        let maxXp = this.maxXp;
        while (amount > 0) {
            if (this.xp > maxXp) {
                amount += this.xp - maxXp;
                maxXp = this.levelUp();
            }
            else if (this.xp + amount >= maxXp) {
                amount -= maxXp - this.xp;
                maxXp = this.levelUp();
            }
            else {
                this._xp += amount;
                amount = 0;
            }
        }
        this.game.events.dispatch("xpAdded", {skill: this, amount: startAmount});
    }

    /**
     * Increase the level and reset xp to 0.
     * @returns The new max xp.
     */
    levelUp() {
        this._level += 1;
        this._xp = 0;
        this.game.events.dispatch("leveledUp", {skill: this});
        return this.maxXp;
    }
}