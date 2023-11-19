import { Action } from "./action.js";

/** 
 * Class for gathering actions with conditions and rewards.
 * @extends {Action}
 */
export class Action_Gathering extends Action {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        super(game);
        /** The gathering node associated with the action. */
        this.gatheringNode = game.errors.gatheringNode;
        /** The last node that was stopped. */
        this.oldGatheringNode = game.errors.gatheringNode;
    }

    get duration() {
        return this.gatheringNode.baseDuration * this.gatheringNode.skill.durationMultiplier;
    }

    save() {
        const actionSave = super.save();
        actionSave.gatheringNodeId = this.gatheringNode.id;
        actionSave.skillId = this.gatheringNode.skill.id;
        return actionSave;
    }

    /** @param {import("./action.js").ActionSave} actionSave An object containing info about the saved action. */
    load(actionSave) {
        super.load(actionSave);
        this.gatheringNode = this.game.skills.getSkill(actionSave.skillId).createGatheringNodeFromId(actionSave.gatheringNodeId);
        this.rewards = this.gatheringNode.rewards;
    }

    getString() {
        return this.game.languages.getString(this.gatheringNode.id);
    }

    getConditionsString() {
        return this.gatheringNode.conditions.getConditionsString();
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    setAction(actionData) {
        const node = actionData.gatheringNode;
        if (node === undefined) {
            this.gatheringNode = this.game.errors.gatheringNode;
            return;
        }
        actionData.rewards = node.rewards;
        this.gatheringNode = node;
        super.setAction(actionData);
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    start(actionData) {
        if (actionData.gatheringNode === undefined) {
            console.log("Failed to start gathering action because the action data is invalid.");
            return;
        }
        const isActionActive = this.game.actions.activeActions.has(this);
        if (isActionActive && actionData.gatheringNode.id === this.gatheringNode.id) {
            this.stop();
            return;
        }
        if (this.game.inventory.isFull) {
            console.log("Failed to start gathering action because the inventory is full.");
            return;
        }
        if (!this.canStart(actionData)) {
            console.log("Failed to start gathering action because the conditions failed.");
            return;
        }
        if (isActionActive) {
            this.stop();
        }

        this.setAction(actionData);
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
        this.oldGatheringNode = this.gatheringNode;
        this.gatheringNode = this.game.errors.gatheringNode;
        this.removeAction();
    }

    /** @param {import("./action.js").ActionData} actionData An object containing info about the action. */
    canStart(actionData) {
        return actionData.gatheringNode.conditions.checkConditions();
    }
}