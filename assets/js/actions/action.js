import { toPercent } from "../helpers/format_string.js";

/**
 * @typedef ActionData
 * @prop {string} id The unique id of the action.
 * @prop {string} type The type of the action. 
 * @prop {number} [duration] Optional time in milliseconds it takes to complete an action.
 * @prop {number} [loop] Optional number of time the action should complete. Defaults to 0 which means loop until stop().
 * @prop {number} [loopCount] Optional number of time the action has completed since last start().
 * @prop {import("../misc/reward.js").Rewards} [rewards] Optional rewards to give to the player at the end of an action.
 * @prop {import("../misc/condition.js").Conditions} [conditions] Optional conditions that must be met to start the action.
 * @prop {import("../skills/gathering_node.js").Gathering_Node} [gatheringNode] Optional gathering node associated with the action.
 * @prop {import("../skills/crafting_recipe.js").Crafting_Recipe} [craftingRecipe] Optional crafting recipe associated with the action.
 */

/**
 * @typedef ActionSave
 * @prop {number} startTime The date time in milliseconds of when the action started.
 * @prop {string} id The unique id of the action.
 * @prop {string} type The type of the action.
 * @prop {number} loop The number of time the action should complete. Defaults to 0 which means loop until stop().
 * @prop {number} loopCount The number of time the action has completed since last start().
 * @prop {string} [gatheringNodeId] Optional unique id of the gathering node associated with the action.
 * @prop {string} [craftingRecipeId] Optional unique id of the crafting recipe associated with the action.
 * @prop {string} [skillId] Optional unique id of the skill associated with the action.
 */

/** Base class for actions with a start time and an end time. */
export class Action {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /** The date time in milliseconds of when the action started. */
        this.startTime = 0;
        /** The unique id of the action. */
        this.id = "";
        /** The type of the action. */
        this.type = "";
        /** The base duration of the action without speed multipliers applied. */
        this.baseDuration = 0;
        /** Number of time the action should complete. */
        this.loop = 0;
        /** Number of time the action has completed since last start(). */
        this.loopCount = 0;
        /** Conditions that must be met to start the action. */
        this.conditions = game.errors.conditions;
        /** Rewards to give to the player at the end of an action. */
        this.rewards = game.errors.rewards;
    }

    /** The duration of the action with speed multipliers applied. */
    get duration() {
        return this.baseDuration;
    }
    /** The action elapsed time percent formatted to 2 digits after the decimal. */
    get elapsedPercent() {
        return toPercent(this.elapsedTime, this.duration);
    }
    /** The action elapsed time. */
    get elapsedTime() {
        return Date.now() - this.startTime;
    }
    /** The time at which the action will end with speed multipliers applied. */
    get endTime() {
        return this.startTime + this.duration;
    }

    /** @returns {ActionSave} An object containing info about the saved action. */
    save() {
        return {
            startTime: this.startTime,
            id: this.id,
            type: this.type,
            loop: this.loop,
            loopCount: this.loopCount,
        }
    }

    /** @param {ActionSave} actionSave An object containing info about the saved action. */
    load(actionSave) {
        this.startTime = actionSave.startTime;
        this.id = actionSave.id;
        this.type = actionSave.type;
        this.loop = actionSave.loop;
        this.loopCount = actionSave.loopCount;
    }

    /**
     * Set the data of the action.
     * @param {ActionData} actionData An object containing info about the action.
     */
    setAction(actionData) {
        this.id = actionData.id === undefined ? "error" : actionData.id;
        this.type = actionData.type === undefined ? "error" : actionData.type;
        this.baseDuration = actionData.duration === undefined ? 0 : actionData.duration;
        this.loop = actionData.loop === undefined ? 0 : actionData.loop;
        this.loopCount = actionData.loopCount === undefined ? 0 : actionData.loopCount;
        this.conditions = actionData.conditions === undefined ? this.game.errors.conditions : actionData.conditions;
        this.rewards = actionData.rewards === undefined ? this.game.errors.rewards : actionData.rewards;
    }

    /** @returns The string to add to the action name when displaying the action. */
    getString() {
        return "";
    }

    /** @returns The string of all conditions of the action. */
    getConditionsString() {
        return this.conditions.getConditionsString();
    }

    /**
     * Start the action or stop it if already started.
     * @param {import("./action.js").ActionData} actionData An object containing info about the action.
     */
    start(actionData) {
        if (actionData.conditions !== undefined && !actionData.conditions.checkConditions()) {
            return;
        }
        if (this.game.actions.activeActions.has(this)) {
            this.stop();
            return;
        }

        this.setAction(actionData);
        this.addAction();
    }

    /**
     * Called every game tick when the action is active.
     * Check if the action has reached the end time.
     * @param {number} deltaTime Milliseconds since last update.
     */
    update(deltaTime) {
        if (Date.now() >= this.endTime) {
            this.end();
        }
    }

    /**
     * Called at the end of every action.
     * Give rewards to the player and restart or stop the action.
     */
    end() {
        this.rewards.giveRewards();
        this.loopCount++;
        this.game.events.dispatch("actionEnded", {action: this});

        if (this.loop <= 0 || this.loopCount < this.loop) {
            this.startTime = Date.now();
            return;
        }

        this.stop();
    }

    /**
     * Called once when stopping an action.
     * Remove the action from the active actions and reset variables.
     */
    stop() {
        this.removeAction();
    }

    /** Add the action to the active actions and dispatch actionStarted event. */
    addAction() {
        this.startTime = Date.now();
        this.game.actions.addAction(this);
        this.game.events.dispatch("actionStarted", {action: this});
    }

    /** Remove the action from the active actions and dispatch actionStopped event. */
    removeAction() {
        this.game.actions.removeAction(this);
        this.loopCount = 0;
        this.game.events.dispatch("actionStopped", {action: this});
    }

    /**
     * Check if the action can be started.
     * @param {ActionData} actionData The action data to check.
     * @returns True if the action passes all conditions or false if any fails.
     */
    canStart(actionData) {
        if (this.game.actions.isFull) {
            this.game.pages.createFailureToast(this.game.languages.getString("error_maxActionsReached"));
            return false;
        } 
        return true;
    }
}