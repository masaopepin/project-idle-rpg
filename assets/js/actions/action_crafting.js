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
        this.rewards = this.craftingRecipe.rewards;
    }

    getString() {
        return this.craftingRecipe.item.name + " (" + this.loopCount + "/" + this.loop + ")";
    }

    getConditionsString() {
        return this.craftingRecipe.conditions.getConditionsString();
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    setAction(actionData) {
        const recipe = actionData.craftingRecipe;
        if (recipe === undefined) {
            this.craftingRecipe = this.game.errors.craftingRecipe;
            return;
        }
        actionData.rewards = recipe.rewards;
        this.craftingRecipe = recipe;
        super.setAction(actionData);
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    start(actionData) {
        if (actionData.craftingRecipe === undefined || actionData.loop === undefined || isNaN(actionData.loop) || actionData.loop < 1) {
            console.log("Failed to start crafting action because the action data is invalid.");
            return;
        }
        const activeAction = this.game.actions.getCraftingAction(actionData.craftingRecipe.item.id);
        if (activeAction !== null) {
            activeAction.stop();
            return;
        }
        if (!this.canStart(actionData)) {
            return;
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
            return;
        }
        super.end();
    }

    stop() {
        // Refund the remaining loop if any
        if (this.loopCount < this.loop) {
            this.craftingRecipe.costs.addCurrencies(this.loop - this.loopCount);
        }
        super.stop();
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    canStart(actionData) {
        if (!super.canStart(actionData)) {
            return false;
        }
        if (!actionData.craftingRecipe.conditions.checkConditions()) {
            this.game.pages.createFailureToast(this.game.languages.getString("error_conditionsFailed"));
            return false;
        }
        if (!actionData.craftingRecipe.costs.checkCurrencies(actionData.loop)) {
            this.game.pages.createFailureToast(this.game.languages.getString("error_notEnoughCurrency"));
            return false;
        }
        if (this.game.inventory.isFull) {
            this.game.pages.createFailureToast(this.game.languages.getString("error_inventoryFull"));
            return false;
        }
        return true;
    }
}