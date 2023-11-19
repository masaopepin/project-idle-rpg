/**
 * @typedef CostData
 * @prop {string} type The type of the cost. Can be "item".
 * @prop {number} amount The amount of currency needed. Can be any positive number.
 * @prop {string} [itemId] Optional unique id of the item used as currency.
 */

import { removeChildren } from "../helpers/helpers_html.js";
import { Icon_Label } from "../ui/labels/icon_label.js";

/** Class that can hold multiple cost. */
export class Costs {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {CostData[]} costsData The array of data that will be added to the class.
     */
    constructor(game, costsData = []) {
        /** @type {Cost[]} */
        this.costs = [];
        costsData.forEach((costData) => { this.createCost(game, costData); });
    }

    /**
     * Create a new cost with the given cost data.
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {CostData} costData An object containing info about the cost.
     */
    createCost(game, costData = {}) {
        if (costData.type === "item") {
            this.costs.push(new Item_Cost(game, costData));
        }
        else {
            this.costs.push(new Cost(game, costData));
        }
    }

    /**
     * Create a new set of icon label to display the owned currencies and costs amount.
     * @param {HTMLElement} parent The parent to append the icon labels.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     * @returns {Set.<Icon_Label>} The new set of icon label.
     */
    createOwnedCostLabels(parent, multiplierFunction = () => { return 1;}) {
        removeChildren(parent);
        const labels = new Set();
        this.costs.forEach((cost) => {
            labels.add(cost.createOwnedCostLabel(parent, multiplierFunction));
        });
        return labels;
    }

    /**
     * Create a new set of icon label to display the costs amount.
     * @param {HTMLElement} parent The parent to append the icon labels.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     * @returns {Set.<Icon_Label>} The new set of icon label.
     */
    createCostLabels(parent, multiplierFunction = () => { return 1;}) {
        removeChildren(parent);
        const labels = new Set();
        this.costs.forEach((cost) => {
            labels.add(cost.createCostLabel(parent, multiplierFunction));
        });
        return labels;
    }

    /** @returns The maximum number of time the player can afford the costs. */
    getMaxAmount() {
        let max = Infinity;
        for (const cost of this.costs) {
            const currentMax = cost.getMaxAmount();
            if (currentMax < max) {
                max = currentMax;
            }
        }
        return max === Infinity ? 0 : max;
    }

    /** 
     * Check if the player has enough currencies to afford the costs a number of time.
     * @param {number} [amount] Optional number to multiply the costs. Defaults to 1.
     * @returns True if the player has enough currencies for the given amount.
     */
    checkCurrencies(amount = 1) {
        for (const cost of this.costs) {
            if (!cost.checkCurrency(amount)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Remove the currencies based on the costs.
     * @param {number} [amount] Optional number to multiply the costs. Defaults to 1.
     */
    removeCurrencies(amount = 1) {
        for (const cost of this.costs) {
            cost.removeCurrency(amount);
        }
    }

    /**
     * Add the currencies based on the costs.
     * @param {number} [amount] Optional number to multiply the costs. Defaults to 1.
     */
    addCurrencies(amount = 1) {
        for (const cost of this.costs) {
            cost.addCurrency(amount);
        }
    }
}

/** Base class for the cost of something. */
export class Cost {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {CostData} costData An object containing info about the cost.
     */
    constructor(game, costData = {}) {
        /** The game instance. */
        this.game = game;
        /** The type of the cost. */
        this.type = costData.type === undefined ? "error" : costData.type;
        /** The amount of currency needed. */
        this.amount = costData.amount === undefined ? Infinity : costData.amount;
    }

    /**
     * Create a new icon label to display the owned currency and cost amount.
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     * @returns The new icon label.
     */
    createOwnedCostLabel(parent, multiplierFunction = () => { return 1; }) {
        console.log("Failed to create owned cost label with type: " + this.type);
        return new Icon_Label(parent, {});
    }

    /**
     * Create a new icon label to display the cost amount.
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1.
     * @returns The new icon label.
     */
    createCostLabel(parent, multiplierFunction = () => { return 1; }) {
        console.log("Failed to create cost label with type: " + this.type);
        return new Icon_Label(parent, {});
    }

    /** @returns The maximum number of time the player can afford the cost. */
    getMaxAmount() {
        console.log("Failed to get max amount with type: " + this.type);
        return this.amount;
    }

    /** 
     * Check if the player has enough currency to afford the cost a number of time.
     * @param {number} [amount] Optional number to multiply the cost. Defaults to 1.
     * @returns True if the player has enough currency for the given amount.
     */
    checkCurrency(amount = 1) {
        console.log("Failed to check currency with type: " + this.type);
        return false;
    }

    /**
     * Remove currency based on the cost.
     * @param {number} [amount] Optional number to multiply the costs. Defaults to 1.
     */
    removeCurrency(amount = 1) {
        console.log("Failed to remove currency with type: " + this.type);
    }

    /**
     * Add currency based on the cost.
     * @param {number} [amount] Optional number to multiply the costs. Defaults to 1.
     */
    addCurrency(amount = 1) {
        console.log("Failed to add currency with type: " + this.type);
    }
}

/** Class for cost that use items as currency. */
export class Item_Cost extends Cost {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {CostData} costData An object containing info about the cost.
     */
    constructor(game, costData = {}) {
        super(game, costData);
        /** The item associated with the cost. */
        this.item = costData.itemId === undefined ? game.errors.item : game.items.getItem(costData.itemId);
    }

    /**
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1. 
     */
    createOwnedCostLabel(parent, multiplierFunction = () => { return 1; }) {
        return new Icon_Label(parent, {
            source: this.item.icon,
            tooltip: this.item.name,
            updateFunction: () => { return this.item.amount + " / " + (this.amount * multiplierFunction()); }
        });
    }

    /**
     * @param {HTMLElement} parent The parent to append the icon label.
     * @param {Function} [multiplierFunction] Optional function that returns a number to multiply the cost. Defaults to 1. 
     */
    createCostLabel(parent, multiplierFunction = () => { return 1; }) {
        return new Icon_Label(parent, {
            source: this.item.icon,
            tooltip: this.item.name,
            updateFunction: () => { return this.amount * multiplierFunction(); }
        });
    }

    getMaxAmount() {
        if (this.item.amount < this.amount) {
            return 0;
        }
        return Math.floor(this.item.amount / this.amount);
    }

    /** @param {number} [amount] Optional number to multiply the costs. Defaults to 1. */
    checkCurrency(amount = 1) {
        if (this.item.amount < this.amount * amount) {
            return false;
        }
        return true;
    }

    /** @param {number} [amount] Optional number to multiply the costs. Defaults to 1. */
    removeCurrency(amount = 1) {
        this.game.inventory.removeItem(this.item, this.amount * amount);
    }

    /** @param {number} [amount] Optional number to multiply the costs. Defaults to 1. */
    addCurrency(amount = 1) {
        this.game.inventory.addItem(this.item, this.amount * amount);
    }
}