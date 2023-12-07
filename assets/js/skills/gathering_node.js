import { createGenericButton, createGenericElement } from "../helpers/helpers_html.js";
import { Duration_Label } from "../ui/labels/icon_label.js";
import { Progressbar } from "../ui/progressbar.js";

/**
 * @typedef GatheringNodeData
 * @prop {string} id The unique id of the node.
 * @prop {string} actionId The unique id of the gathering action.
 * @prop {number} duration The time in milliseconds it takes to complete an action.
 * @prop {import("../misc/condition.js").ConditionData[]} conditionsData The conditions data required to start the action.
 * @prop {import("../misc/reward.js").RewardData[]} rewardsData The rewards data to give at the end of each action.
 */

/**
 * @typedef GatheringSection
 * @prop {Gathering_Node} gatheringNode The gathering node associated with the section.
 * @prop {?import("../actions/action.js").Action} action The action associated with the section.
 * @prop {HTMLElement} conditions The HTMLElement containing the conditions string.
 * @prop {Set.<Icon_Label>} rewards The set of icon label containing the rewards.
 * @prop {Duration_Label} durationLabel The duration label for the action.
 * @prop {Progressbar} actionProgress The progressbar for the elapsed time of the action.
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
        this.conditions = gatheringNodeData.conditionsData === undefined ? game.createConditions() : game.createConditions(gatheringNodeData.conditionsData);
        /** The rewards to give at the end of the action. */
        this.rewards = gatheringNodeData.rewardsData === undefined ? game.createRewards() : game.createRewards(gatheringNodeData.rewardsData);
    }

    /** Start a gathering action for the node. */
    startGathering() {
        this.skill.startGathering(this);
    }

    /**
     * Create a section to display the gathering node.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the section.
     */
    createSection(game, parent) {
        const action = game.actions.getGatheringAction(this.id);
        const actionName = game.languages.getString(this.actionId);
        const nodeName = game.languages.getString(this.id);

        const root = createGenericElement(parent, {className: "col-12 col-sm-6 col-md-4"});
        const border = createGenericElement(root, {className: "d-flex flex-column section h-100 m-0"});

        const button = createGenericButton(border, {className: "btn btn-body rounded-bottom-0 shadow p-0"}, {onclick: () => { this.startGathering(); }});
        createGenericElement(button, {innerHTML: actionName});
        createGenericElement(button, {innerHTML: nodeName});

        const conditions = createGenericElement(border, {className: "px-2 py-1 mx-auto", innerHTML: this.conditions.getConditionsString()});
        const rewardsRoot = createGenericElement(border, {className: "px-2 mt-auto"});
        const rewards = this.rewards.createRewardLabels(rewardsRoot);

        /** @type {GatheringSection} */
        const section = {
            gatheringNode: this,
            action: action,
            conditions: conditions,
            rewards: rewards
        }

        section.durationLabel = new Duration_Label(game, rewardsRoot, {baseDuration: this.baseDuration, skill: this.skill});
        section.actionProgress = new Progressbar(border, actionName + " " + nodeName);
        return section;
    }
}