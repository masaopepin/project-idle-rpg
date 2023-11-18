import { Conditions } from "../misc/condition.js";
import { Costs } from "../misc/cost.js";

/**
 * @typedef ShopItemData
 * @prop {string} id The unique id of the item sold in the shop.
 * @prop {boolean} [canRestock] Optional bool to allow the item to restock. Defaults to true.
 * @prop {number} [baseStock] Optional base amount of item in stock every refresh. Defaults to 1.
 */

/**
 * @typedef ShopData
 * @prop {string} id The unique id of the shop.
 * @prop {ShopItemData[]} itemData The array of items sold in the shop.
 */

/**
 * @typedef ShopItemSave
 * @prop {string} id The unique id of the item sold in the shop.
 * @prop {number} stock The current stock of the item.
 */

/**
 * @typedef ShopSave
 * @prop {string} id The unique id of the shop.
 * @prop {ShopItemSave[]} saves The array of shop item save of the shop.
 */

export class ShopItem {
    /**
     * 
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {ShopItemData} [itemData] An object containing info about the item sold in the shop.
     */
    constructor(game, itemData = {}) {
        this.item = itemData.id === undefined ? game.errors.item : game.items.getItem(itemData.id);
        this.canRestock = itemData.canRestock === undefined ? true : itemData.canRestock;
        /** The base stock of the item. */
        this.baseStock = itemData.baseStock === undefined ? 1 : itemData.baseStock;
        /** @private The current stock of the item. */
        this._stock = this.baseStock;
    }

    /** The current stock of the item. */
    get stock() {
        return this._stock;
    }

    /** @returns {ShopItemSave} The save object for the shop item. */
    save() {
        return {
            id: this.item.id,
            stock: this.stock
        }
    }

    /**
     * Load the given save object into the class.
     * @param {ShopItemSave} save The save object to load.
     */
    load(save = {}) {
        if (save.stock !== undefined) {
            this._stock = save.stock;
        }
    }

    /**
     * Buy a given number of item from the shop item.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {number} amount The number of item to buy.
     */
    buyItem(game, amount) {
        if (game.inventory.isFull) {
            console.log("Failed to buy item " + this.item.name + " because the inventory is full.");
            return;
        }
        if (isNaN(amount) || amount < 1 || amount > this.item.maxStack || this.stock < amount || this.item.buyData.length === 0) {
            console.log("Failed to buy item " + this.item.name + " because the amount is invalid.");
            return;
        }
        amount = Math.floor(amount);
        const costs = new Costs(game, this.item.buyData);
        if (!new Conditions(game, this.item.conditionsData).checkConditions() || !costs.checkCurrencies(amount)) {
            console.log("Failed to buy item " + this.item.name + " because the conditions or costs check failed.");
            return;
        }
        
        game.inventory.addItem(this.item, amount);
        this._stock -= amount;
        costs.removeCurrencies(amount);
    }

    /** Restock the item to the base stock if it can be restocked. */
    restock() {
        if (this.canRestock) {
            this._stock = this.baseStock;
        }
    }
}

export class Shop {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {ShopData} shopData An object containing info about the shop.
     */
    constructor(game, shopData = {}) {
        this.id = shopData.id === undefined ? "error" : shopData.id;
        /** @type {ShopItem[]} */
        this.items = [];
        if (Array.isArray(shopData.itemData)) {
            shopData.itemData.forEach((data) => { this.items.push(new ShopItem(game, data)); });
        }
    }

    /** @returns {ShopSave} The save object for the shop. */
    save() {
        const itemSaves = [];
        this.items.forEach((shopItem) => {
            if (shopItem.stock !== shopItem.baseStock) {
                itemSaves.push(shopItem.save());
            }
        });
        return {id: this.id, saves: itemSaves};
    }

    /**
     * Load the given save object into the class.
     * @param {ShopSave} save The save object to load.
     */
    load(save = {}) {
        if (!Array.isArray(save.saves)) {
            return;
        }
        save.saves.forEach((itemSave) => {
            const shopItem = this.getShopItem(itemSave.id);
            if (shopItem !== null) {
                shopItem.load(itemSave);
            }
        });
    }

    /**
     * Get the shop item with the given id.
     * @param {string} id The unique id of the item.
     * @returns The shop item or null if not found.
     */
    getShopItem(id) {
        for (const shopItem of this.items) {
            if (shopItem.item.id === id) {
                return shopItem;
            }
        }
        return null;
    }
}