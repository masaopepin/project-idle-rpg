import { Conditions } from "../misc/condition.js";
import { Rewards } from "../misc/reward.js";

/**
 * @typedef GatheringNodeData
 * @prop {string} id The unique id of the node.
 * @prop {string} actionId The unique id of the gathering action.
 * @prop {number} duration The time in milliseconds it takes to complete an action.
 * @prop {import("../misc/condition.js").ConditionData[]} conditionsData The conditions data required to start the action.
 * @prop {import("../misc/reward.js").RewardData[]} rewardsData The rewards data to give at the end of each action.
 */

/** Class for nodes that the player can gather. */
export class Gathering_Node {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {import("./skill.js").Skill} skill The skill to associate with the gathering node.
     * @param {GatheringNodeData} gatheringNodeData An object containing info about the gathering node.
     */
    constructor(game, skill, gatheringNodeData = {}) {
        /** The skill associated with the node. */
        this.skill = skill;
        /** The unique id of the node. */
        this.id = gatheringNodeData.id === undefined ? "error" : gatheringNodeData.id;
        /** The unique id of the gathering action. */
        this.actionId = gatheringNodeData.actionId === undefined ? "error" : gatheringNodeData.actionId;
        /** The time in milliseconds it takes to complete an action without multipliers applied. */
        this.baseDuration = gatheringNodeData.duration === undefined ? 0 : gatheringNodeData.duration;
        /** The conditions required to start the action. */
        this.conditions = gatheringNodeData.conditionsData === undefined ? new Conditions(game) : new Conditions(game, gatheringNodeData.conditionsData);
        /** The rewards to give at the end of the action. */
        this.rewards = gatheringNodeData.rewardsData === undefined ? new Rewards(game) : new Rewards(game, gatheringNodeData.rewardsData);
    }
}