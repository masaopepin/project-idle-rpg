/**
 * @typedef RewardData
 * @prop {string} type The type of the reward. Can be "skillXp" or "item".
 * @prop {number} amount The amount of the reward. Can be any positive number.
 * @prop {string} [skillId] Optional unique id of the skill associated with the reward.
 * @prop {string} [itemId] Optional unique id of the item associated with the reward.
 */

import { removeChildren } from "../helpers/helpers_html.js";
import { Icon_Label } from "../ui/labels/icon_label.js";

/** Class that can hold multiple rewards. */
export class Rewards {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {RewardData[]} rewardsData The array of data that will be added to the class.
     */
    constructor(game, rewardsData = []) {
        /**
         * An array of reward to give to the player.
         * @type {Reward[]}
         */
        this.rewards = [];
        rewardsData.forEach((rewardData) => { this.createReward(game, rewardData); });
    }

    /**
     * Create a new reward with the given reward data.
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {RewardData} rewardData An object containing info about the reward.
     */
    createReward(game, rewardData) {
        if (rewardData.type === "skillXp") {
            this.rewards.push(new Reward_Skill_Xp(game, rewardData));
        }
        else if (rewardData.type === "item") {
            this.rewards.push(new Reward_Item(game, rewardData));
        }
        else {
            this.rewards.push(new Reward(game, rewardData));
        }
    }

    /**
     * Give all rewards to the player.
     * @param {number} [amount] Optional number to multiply the reward. Defaults to 1.
     */
    giveRewards(amount) {
        this.rewards.forEach((reward) => { reward.giveReward(amount); });
    }

    /**
     * Create a new set of icon label to display the rewards.
     * @param {HTMLElement} parent The parent to append the icon labels.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     * @returns {Set.<Icon_Label>} The new set of icon labels.
     */
    createRewardLabels(parent, multiplierFunction = () => { return 1;}) {
        removeChildren(parent);
        const labels = new Set();
        this.rewards.forEach((reward) => { labels.add(reward.createRewardLabel(parent, multiplierFunction)); });
        return labels;
    }

    /**
     * Create a new set of icon label to display the total amount of rewards given since creation.
     * @param {HTMLElement} parent The parent to append the icon labels.
     * @returns {Set.<Icon_Label>} The new set of icon labels.
     */
    createTotalLabels(parent) {
        removeChildren(parent);
        const labels = new Set();
        this.rewards.forEach((reward) => { labels.add(reward.createTotalLabel(parent)); });
        return labels;
    }
}

/** Base class for reward that can be given to the player. */
export class Reward {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {RewardData} rewardData An object containing info about the reward.
     */
    constructor(game, rewardData = {}) {
        /** The game instance. */
        this.game = game;
        /** The type of the reward. */
        this.type = rewardData.type === undefined ? "error" : rewardData.type;
        /** The amount of the reward. Can be any positive number. */
        this.amount = rewardData.amount === undefined ? -1 : rewardData.amount;
        /** The total amount of reward given since creation. */
        this.totalAmount = rewardData.totalAmount === undefined ? 0 : rewardData.totalAmount;
    }

    /**
     * Give the reward to the player.
     * @param {number} [amount] Optional number to multiply the reward. Defaults to 1.
     */
    giveReward(amount = 1) {
        console.log("Failed to give reward with reward type: " + this.type);
    }

    /**
     * Create a new icon label to display a reward.
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     * @returns The new icon label.
     */
    createRewardLabel(parent, multiplierFunction = () => { return 1;}) {
        console.log("Failed to create reward label with reward type: " + this.type);
        return new Icon_Label(parent);
    }

    /**
     * Create a new icon label to display the total amount of reward given since creation.
     * @param {HTMLElement} parent The parent to append the icon label.
     */
    createTotalLabel(parent) {
        console.log("Failed to create total label with reward type: " + this.type);
    }
}

/** Class for reward that gives skill xp. */
export class Reward_Skill_Xp extends Reward {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {RewardData} rewardData An object containing info about the reward.
     */
    constructor(game, rewardData = {}) {
        super(game, rewardData);
        /** The skill associated with the reward. */
        this.skill = game.skills.getSkill(rewardData.skillId);
    }

    /** @param {number} amount Optional number to multiply the rewards. Defaults to 1. */
    giveReward(amount = 1) {
        const givenAmount = this.amount * amount * this.skill.xpMultiplier;
        this.skill.addXp(givenAmount);
        this.totalAmount += givenAmount;
    }

    /**
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     */
    createRewardLabel(parent, multiplierFunction = () => { return 1;}) {
        return new Icon_Label(parent, {source: this.skill.icon, tooltip: this.skill.name, updateFunction: () => { return (this.amount * multiplierFunction() * this.skill.xpMultiplier) + " " + this.game.languages.getString("xp"); }});
    }

    /** @param {HTMLElement} parent The parent to append the icon label. */
    createTotalLabel(parent) {
        return new Icon_Label(parent, {source: this.skill.icon, tooltip: this.skill.name, updateFunction: () => { return "+" + Math.floor(this.totalAmount) + " " + this.game.languages.getString("xp"); }});
    }
}

/** Class for reward that gives item. */
export class Reward_Item extends Reward {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {RewardData} rewardData An object containing info about the reward.
     */
    constructor(game, rewardData = {}) {
        super(game, rewardData);
        /** The item associated with the reward. */
        this.item = game.items.getItem(rewardData.itemId);
    }

    /** @param {number} [amount] Optional number to multiply the reward. Defaults to 1. */
    giveReward(amount = 1) {
        const givenAmount = this.amount * amount;
        this.game.inventory.addItem(this.item, givenAmount);
        this.totalAmount += givenAmount;
    }

    /**
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     */
    createRewardLabel(parent, multiplierFunction = () => { return 1;}) {
        return new Icon_Label(parent, {
            source: this.item.icon,
            tooltip: this.item.name,
            updateFunction: () => { return this.amount * multiplierFunction(); }
        });
    }

    createTotalLabel(parent) {
        return new Icon_Label(parent, {
            source: this.item.icon,
            tooltip: this.item.name,
            updateFunction: () => { return "+" + this.totalAmount; }
        });
    }
}