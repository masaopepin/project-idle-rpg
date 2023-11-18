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
        this.maxAction = 1;
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
            if (action !== this.game.errors.action) {
                action.load(actionSave);
                this.activeActions.add(action);
            }
        });
    }

    /**
     * Get the action with the given id.
     * @param id The unique id of the action.
     * @returns The action if found or the error action.
     */
    getAction(id = "error") {
        for (const activeAction of this.activeActions) {
            if (activeAction.id === id) {
                return activeAction;
            }
        }
        return this.game.errors.action;
    }

    /** 
     * Start the action creating it if needed with the given action data.
     * @param {import("./action.js").ActionData} actionData An object containing info about the action.
     */
    startAction(actionData = {}) {
        let action = this.getAction(actionData.id);

        if (action === this.game.errors.action) {
            action = this.createAction(actionData);
        }
        action.start(actionData);
    }

    /**
     * Create a new action with the given action data.
     * @param {import("./action.js").ActionData} actionData An object containing info about the action.
     */
    createAction(actionData = {}) {
        if (actionData.type === "gathering") {
            return new Action_Gathering(this.game);
        }
        else if (actionData.type === "crafting") {
            return new Action_Crafting(this.game);
        }
        else {
            return this.game.errors.action;
        }
    }

    /**
     * Add the given action to the active actions.
     * @param {import("./action.js").Action} action The action to add.
     */
    addAction(action) {
        if (action === this.game.errors.action) {
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