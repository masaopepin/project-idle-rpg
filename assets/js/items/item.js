/**
 * @typedef ItemData
 * @prop {string} id The unique id of the item.
 * @prop {string} categoryId The category id of the item. Is automatically filled by the manager based on the import.
 * @prop {string} typeId The type id of the item. Is automatically filled by the manager based on the import.
 * @prop {string} [icon] Optional icon of the item.
 * @prop {import("../misc/condition.js").ConditionData[]} [conditionsData] Optional array of condition data required to equip the item.
 * @prop {import("../misc/cost.js").CostData[]} [buyData] Optional array of cost data required to buy the item.
 * @prop {import("../misc/reward.js").RewardData[]} [sellData] Optional array of reward data the player get when selling the item.
 * @prop {number} [maxStack] Optional max stack of the item. Defaults to 1.
 * @prop {Object.<string, number>} [multipliers] Optional object containing multipliers that this item gives when equipped. 
 */

/**
 * @typedef ItemSave
 * @prop {number} amount The owned amount of the item.
 */

/** Base class for all items in the game. */
export class Item {
    /** @param {ItemData} item An object containing info about the item. */
    constructor(item = {}) {
        /** The unique id of the item. */
        this.id = item.id === undefined ? "error" : item.id;
        /** The name of the item in the current language. */
        this.name = "";
        /** The unique id of the category of the item. */
        this.categoryId = item.categoryId === undefined ? "error" : item.categoryId;
        /** The category of the item in the current language. */
        this.category = "";
        /** The unique id of the type of the item. */
        this.typeId = item.typeId === undefined ? "error" : item.typeId;
        /** The type of the item in the current language. */
        this.type = "";
        /** The icon of the item. */
        this.icon = item.icon === undefined ? "" : item.icon;
        /** The description of the item in the current language. */
        this.description = "";
        /** The conditions data required to equip the item. */
        this.conditionsData = item.conditionsData === undefined ? [] : item.conditionsData;
        /** The item costs data required to buy the item. */
        this.buyData = item.buyData === undefined ? [] : item.buyData;
        /** The rewards data the player get when selling the item. */
        this.sellData = item.sellData === undefined ? [] : item.sellData;
        /** The maximum number of item in a slot. */
        this.maxStack = item.maxStack === undefined ? 999 : item.maxStack;
        /** 
         * Object containing multipliers that this item gives when equipped.
         * @type {Object.<string, number>}
         */
        this.multipliers = item.multipliers === undefined ? {} : item.multipliers;
        /** The total owned amount of the item. */
        this.amount = 0;
    }

    /**
     * Buy a given amount of the item.
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {number} amount The number of item to buy.
     * @returns The number of item bought.
     */
    buy(game, amount) {
        if (game.inventory.isFull) {
            game.pages.createFailureToast(game.languages.getString("error_inventoryFull"));
            return 0;
        }
        if (isNaN(amount) || amount < 1 || amount > this.maxStack || this.buyData.length === 0) {
            console.log("Failed to buy item " + this.name + " because the amount is invalid.");
            return 0;
        }
        amount = Math.floor(amount);
        if (!game.createConditions(this.conditionsData).checkConditions()) {
            game.pages.createFailureToast(game.languages.getString("error_conditionsFailed"));
            return 0;
        }
        const costs = game.createCosts(this.buyData);
        if (!costs.checkCurrencies(amount)) {
            game.pages.createFailureToast(game.languages.getString("error_notEnoughCurrency"));
            return 0;
        }
        
        game.inventory.addItem(this, amount);
        costs.removeCurrencies(amount);
        game.pages.createSuccessToast(game.languages.getString("success_purchaseCompleted"));
        return amount;
    }

    /**
     * Create a new default item save for the item.
     * @returns {ItemSave} The new item save.
     */
    createDefaultItemSave() {
        return {
            amount: 0
        };
    }
}