import { Action_Crafting } from "./action_crafting.js";
import { Action_Gathering } from "./action_gathering.js";

/** Manager class for actions that can happen in the game. */
export class Manager_Action {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /**
         * Set of all currently active actions.
         * @type {Set.<import("./action.js").Action>}
         */
        this.activeActions = new Set();
        /** @private The current maximum number of actions that the player can do simultaneously. */
        this._maxActions = 1;
        /** The limit for the max actions. */
        this.maxActionsCap = 5;
    }

    /** The current maximum number of actions that the player can do simultaneously. */
    get maxActions() {
        return this._maxActions;
    }

    /** The string to display the amount of active actions and max actions. */
    get maxActionsString() {
        return "(" + this.activeActions.size + " / " + this._maxActions + ")";
    }

    /** True if the active actions has reached the max actions or false if not. */
    get isFull() {
        return this.activeActions.size >= this.maxActions;
    }

    /**
     * Set the max active actions up to the max action cap.
     * @param {number} amount 
     */
    setMaxActions(amount) {
        if (isNaN(amount) || amount < 1 || amount > this.maxActionsCap) {
            return;
        }

        this._maxActions = amount;
    }

    /** @returns The array of action save for the currently active actions. */
    save() {
        /** @type {import("./action.js").ActionSave[]} */
        const actions = [];

        this.activeActions.forEach((action) => {
            actions.push(action.save());
        })
        return actions;
    }

    /** @param {import("./action.js").ActionSave[]} actionsSave */
    load(actionsSave = []) {
        if (!Array.isArray(actionsSave)) {
            return;
        }
        actionsSave.forEach((actionSave) => {
            const action = this.createAction({type: actionSave.type});
            if (action !== null) {
                action.load(actionSave);
                this.activeActions.add(action);
            }
        });
    }

    /**
     * Get the action with the given id.
     * @param {string} id The unique id of the action.
     * @returns The action if found or null.
     */
    getAction(id) {
        for (const activeAction of this.activeActions) {
            if (activeAction.id === id) {
                return activeAction;
            }
        }
        return null;
    }

    /**
     * Get the gathering action with the given gathering node id.
     * @param {string} id The unique id of the gathering node.
     * @returns The action if found or null.
     */
    getGatheringAction(id) {
        for (const activeAction of this.activeActions) {
            if (activeAction.type === "gathering" && activeAction.gatheringNode.id === id) {
                return activeAction;
            }
        }
        return null;
    }

    /**
     * Get the crafting action with the given crafted item id.
     * @param {string} id The unique id of the crafted item.
     * @returns The action if found or null.
     */
    getCraftingAction(id) {
        for (const activeAction of this.activeActions) {
            if (activeAction.type === "crafting" && activeAction.craftingRecipe.item.id === id) {
                return activeAction;
            }
        }
        return null;
    }

    /** 
     * Start the action, creating it if needed with the given action data.
     * @param {import("./action.js").ActionData} actionData An object containing info about the action.
     */
    startAction(actionData = {}) {
        const action = this.createAction(actionData);
        if (action !== null) {
            action.start(actionData);
        }
    }

    /**
     * Create a new action with the given action data.
     * @param {import("./action.js").ActionData} actionData An object containing info about the action.
     */
    createAction(actionData = {}) {
        if (actionData.type === "gathering") {
            return new Action_Gathering(this.game);
        }
        if (actionData.type === "crafting") {
            return new Action_Crafting(this.game);
        }
        return null;
    }

    /**
     * Add the given action to the active actions.
     * @param {?import("./action.js").Action} action The action to add.
     */
    addAction(action) {
        if (action === null) {
            return;
        }
        this.activeActions.add(action);
    }

    /**
     * Remove the given action from the active actions.
     * @param {import("./action.js").Action} action The action to remove.
     */
    removeAction(action) {
        this.activeActions.delete(action);
    }
}