import { Action } from "./action.js";

/** 
 * Class for crafting actions with costs, conditions and rewards.
 * @extends {Action}
 */
export class Action_Crafting extends Action {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        super(game);
        /** The crafting recipe associated with the action. */
        this.craftingRecipe = game.errors.craftingRecipe;
        /** The last crafting recipe that was stopped. */
        this.oldCraftingRecipe = game.errors.craftingRecipe;
    }

    get duration() {
        return this.craftingRecipe.baseDuration * this.craftingRecipe.skill.durationMultiplier;
    }

    save() {
        const actionSave = super.save();
        actionSave.craftingRecipeId = this.craftingRecipe.item.id;
        actionSave.skillId = this.craftingRecipe.skill.id;
        return actionSave;
    }

    /** @param actionSave An object containing info about the saved action. */
    load(actionSave) {
        super.load(actionSave);
        this.craftingRecipe = this.game.skills.getSkill(actionSave.skillId).createCraftingRecipeFromId(actionSave.craftingRecipeId);
    }

    getString() {
        return this.craftingRecipe.item.name + " (" + this.loopCount + "/" + this.loop + ")";
    }

    getConditionsString() {
        return this.craftingRecipe.conditions.getConditionsString();
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    setAction(actionData) {
        super.setAction(actionData);
        this.craftingRecipe = actionData.craftingRecipe === undefined ? this.game.errors.craftingRecipe : actionData.craftingRecipe;
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    start(actionData) {
        if (actionData.craftingRecipe === undefined || actionData.loop === undefined || isNaN(actionData.loop) || actionData.loop < 1) {
            console.log("Failed to start crafting action because the action data is invalid.");
            return;
        }
        const isActionActive = this.game.actions.activeActions.has(this);
        if (isActionActive && actionData.craftingRecipe.item === this.craftingRecipe.item) {
            this.stop();
            return;
        }
        if (this.game.inventory.isFull) {
            console.log("Failed to start crafting action because the inventory is full.");
            return;
        }
        if (!this.canStart(actionData)) {
            console.log("Failed to start crafting action because the conditions or costs failed.");
            return;
        }
        if (isActionActive) {
            this.stop();
        }
        
        this.setAction(actionData);
        this.craftingRecipe.costs.removeCurrencies(this.loop);
        this.addAction();
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    end() {
        if (this.game.inventory.isFull) {
            this.stop();
        }
        else {
            this.craftingRecipe.rewards.giveRewards();
            super.end();
        }
    }

    stop() {
        // Refund the remaining loop if any
        if (this.loopCount < this.loop) {
            this.craftingRecipe.costs.addCurrencies(this.loop - this.loopCount);
        }
        this.oldCraftingRecipe = this.craftingRecipe;
        this.craftingRecipe = this.game.errors.craftingRecipe;
        this.removeAction();
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    canStart(actionData) {
        return actionData.craftingRecipe.conditions.checkConditions() && actionData.craftingRecipe.costs.checkCurrencies(actionData.loop);
    }
}