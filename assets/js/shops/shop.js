import { createGenericElement, createGenericImage, createOpenModalButton, setButtonDisabled } from "../helpers/helpers_html.js";

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
 * @prop {number} [restockDate] The date in milliseconds for the next restock.
 */

/**
 * @typedef ShopSave
 * @prop {string} id The unique id of the shop.
 * @prop {ShopItemSave[]} saves The array of shop item save of the shop.
 */

/** Class that represents an item sold in the shop. */
export class ShopItem {
    /** @param {ShopItemData} [itemData] An object containing info about the item sold in the shop. */
    constructor(itemData = {}) {
        /** The item associated with the shop item. */
        this.id = itemData.id === undefined ? "error" : itemData.id;
        /** Bool to allow the item to restock. */
        this.canRestock = itemData.canRestock === undefined ? true : itemData.canRestock;
        /** The date in milliseconds for the next restock. */
        this.restockDate = 0;
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
        return {id: this.id, stock: this._stock, restockDate: this.restockDate};
    }

    /**
     * Load the given save object into the class.
     * @param {ShopItemSave} save The save object to load.
     */
    load(save = {}) {
        if (save.stock !== undefined && !isNaN(save.stock)) {
            this._stock = save.stock;
        }
        if (save.restockDate !== undefined && !isNaN(save.restockDate)) {
            this.restockDate = save.restockDate;
        }
    }

    /**
     * Buy a given number of item from the shop item.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {number} amount The number of item to buy.
     */
    buy(game, amount) {
        if (isNaN(amount) || this._stock < amount) {
            console.log("Failed to buy shop item with id " + this.id + " because the amount is invalid.");
            return;
        }
        const boughtAmount = game.items.getItem(this.id).buy(game, amount);
        if (boughtAmount > 0) {
            this._stock -= boughtAmount;
            if (this.canRestock && this.restockDate === 0) {
                this.restockDate = Date.now() + 300000;
            }
        }
    }

    /** Restock the item to the base stock if it can be restocked. */
    restock() {
        if (this.canRestock && Date.now() >= this.restockDate) {
            this._stock = this.baseStock;
            this.restockDate = 0;
        }
    }

    /**
     * Create a section for the shop item.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the section.
     * @param {import("../ui/modals/modal_shop.js").Modal_Shop} modal The modal to open when clicking the buy button.
     */
    createSection(game, parent, modal) {
        const item = game.items.getItem(this.id);
        const itemRoot = createGenericElement(parent, {className: "col-12 col-md-6"});
        const itemBg = createGenericElement(itemRoot, {className: "d-flex flex-column section m-0 p-2 h-100"});

        const itemDiv = createGenericElement(itemBg, {className: "d-flex flex-column flex-lg-row mb-1"});
        createGenericImage(itemDiv, {className: "item-icon mx-auto", attributes: {"src": item.icon}});
        const itemInfoDiv = createGenericElement(itemDiv, {className: "d-flex flex-column col ms-lg-3"});
        createGenericElement(itemInfoDiv, {tag: "h5", className: "m-0", innerHTML: item.name});

        const conditions = game.createConditions(item.conditionsData);
        const conditionsString = conditions.getConditionsString();
        createGenericElement(itemInfoDiv, {className: "fs-6", innerHTML: item.description});
        createGenericElement(itemInfoDiv, {innerHTML: conditionsString});

        const costs = game.createCosts(item.buyData);
        const costsRoot = createGenericElement(itemInfoDiv, {className: "d-lg-flex"});
        costs.createCostLabels(costsRoot);

        const buyButton = createOpenModalButton(itemBg, {className: "btn btn-success p-1 mt-auto", innerHTML: game.languages.getString("buy")}, {id: "#modal-shop", onclick: (e) => { modal.update(this, item, costs); }});
        setButtonDisabled(buyButton, !conditions.checkConditions());
    }
}

/** Class that represents a shop in the game. */
export class Shop {
    /** @param {ShopData} shopData An object containing info about the shop. */
    constructor(shopData = {}) {
        this.id = shopData.id === undefined ? "error" : shopData.id;
        /** @type {ShopItem[]} */
        this.items = [];
        if (Array.isArray(shopData.itemData)) {
            shopData.itemData.forEach((data) => { this.items.push(new ShopItem(data)); });
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
            if (shopItem.id === id) {
                return shopItem;
            }
        }
        return null;
    }
}