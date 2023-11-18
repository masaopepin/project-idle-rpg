/**
 * @typedef InventorySave
 * @prop {string} id The unique id of the item in the slot.
 * @prop {import("./item.js").ItemSave} save The item save associated with the item.
 */

import { Rewards } from "../misc/reward.js";

/** Class for slots in the player inventory. */
export class InventorySlot {
    /**
     * @param {import("./item.js").Item} item The item in the slot.
     * @param {import("./item.js").ItemSave} [save] Optional item save associated with the item. Defaults to the default item save.
     */
    constructor(item, save = item.createDefaultItemSave()) {
        this.item = item;
        this.save = save;
    }

    /**
     * Add the item in the slot a given number of time.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {number} amount The number of item to add.
     * @returns The remaining amount of item to add.
     */
    addItem(game, amount) {
        const startingSaveAmount = this.save.amount;
        if (isNaN(amount) || amount < 1) {
            console.log("Failed to add item " + this.item.name + " because the amount is invalid.");
            return 0;
        }
        amount = Math.floor(amount);
        const addedAmount = this.save.amount + amount > this.item.maxStack ? this.item.maxStack - this.save.amount : amount;

        if (addedAmount > 0) {
            this.save.amount += addedAmount;
            this.item.amount += addedAmount;
            const createSlot = startingSaveAmount === 0;
            if (createSlot) {
                game.inventory.addSlot(this);
            }
            game.events.dispatch("itemAdded", {slot: this, amount: addedAmount, wasCreated: createSlot});
        }
        return amount - addedAmount;
    }

    /**
     * Remove the item in the slot a given number of time.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {number} amount The number of item to remove.
     * @returns The remaining amount of item to remove.
     */
    removeItem(game, amount) {
        if (isNaN(amount) || amount < 1) {
            console.log("Failed to remove item " + this.item.name + " because the amount is invalid.");
            return 0;
        }
        amount = Math.floor(amount);
        const removedAmount = this.save.amount < amount ? this.save.amount : amount;

        if (removedAmount > 0) {
            this.save.amount -= removedAmount;
            this.item.amount -= removedAmount;
            const deleteSlot = this.save.amount === 0;
            if (deleteSlot) {
                game.inventory.deleteSlot(this);
            }
            game.events.dispatch("itemRemoved", {slot: this, amount: removedAmount, wasDeleted: deleteSlot});
        }
        return amount - removedAmount;
    }

    /**
     * Sell a given number of item from the slot.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {number} amount The number of item to sell.
     */
    sellItem(game, amount) {
        if (isNaN(amount) || amount < 1 || this.save.amount < amount || this.item.sellData.length === 0) {
            console.log("Failed to sell item " + this.item.name + " because the amount is invalid.");
            return;
        }
        amount = Math.floor(amount);
        new Rewards(game, this.item.sellData).giveRewards(amount);
        this.removeItem(game, amount);
    }
}

export class Manager_Inventory {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        this.game = game;
        /**
         * Set of all inventory slot.
         * @type {Set.<InventorySlot>}
         */
        this.inventory = new Set();
        /** @private The maximum number of slot in the inventory. */
        this._maxSize = 10;
    }

    /** The current number of slot in the inventory. */
    get size() {
        return this.inventory.size;
    }

    /** The maximum number of slot in the inventory. */
    get maxSize() {
        return this._maxSize;
    }

    /** True if the inventory has reached the max inventory size or false if not. */
    get isFull() {
        return this.inventory.size >= this.maxSize;
    }

    /** The amount of space left in the inventory. */
    get spaceLeft() {
        return this.maxSize - this.size;
    }

    /**
     * Save all the inventory slots into an array.
     * @returns The array of inventory save.
     */
    save() {
        /** @type {InventorySave[]} */
        const saves = [];
        for (const slot of this.inventory) {
            saves.push({id: slot.item.id, save: slot.save});
        }
        return saves;
    }

    /**
     * Load the given inventory save array into the class.
     * @param {InventorySave[]} inventorySaves The array of item save to load.
     */
    load(inventorySaves = []) {
        if (!Array.isArray(inventorySaves)) {
            return;
        }
        inventorySaves.forEach((inventorySave) => {
            if (inventorySave.id === undefined || inventorySave.save === undefined) {
                return;
            }
            const item = this.game.items.getItem(inventorySave.id);
            if (item === this.game.errors.item) {
                return;
            }
    
            item.amount += inventorySave.save.amount;
            this.inventory.add(new InventorySlot(item, inventorySave.save));
        });
    }

    /**
     * Get the first inventory slot that matches the item id.
     * @param {string} id The unique id of the item.
     * @returns The inventory slot or null if not found.
     */
    getInventorySlot(id) {
        for (const slot of this.inventory) {
            if (slot.item.id === id) {
                return slot;
            }
        }
        return null;
    }

    /**
     * Get all inventory slot that matches the item id.
     * @param {string} id The unique id of the item.
     * @returns An array of inventory slot.
     */
    getInventorySlots(id) {
        const slots = []
        for (const slot of this.inventory) {
            if (slot.item.id === id) {
                slots.push(slot);
            }
        }
        return slots;
    }

    /**
     * Add an item to the player inventory a given number of time.
     * @param {import("./item.js").Item} item The item to add.
     * @param {number} amount The number of item to add.
     */
    addItem(item, amount) {
        if (item === this.game.errors.item || isNaN(amount) || amount < 1) {
            console.log("Failed to add item with id: " + item.id + " and amount: " + amount);
            return;
        }
        // Try to add to existing slots first
        let remainingAmount = amount;
        if (item.amount > 0) {
            for (const slot of this.inventory) {
                if (slot.item.id === item.id) {
                    remainingAmount = slot.addItem(this.game, remainingAmount);
                    if (remainingAmount === 0) {
                        return;
                    }
                }
            }
        }

        // Create new slots until remaining amount reaches 0
        while (remainingAmount > 0) {
            const newSlot = new InventorySlot(item);
            remainingAmount = newSlot.addItem(this.game, remainingAmount);
            this.inventory.add(newSlot);
        }
    }

    /**
     * Add an item to the player inventory a given number of time.
     * @param {string} id The unique id of the item to add.
     * @param {number} amount The number of item to add.
     */
    addItemById(id, amount) {
        this.addItem(this.game.items.getItem(id), amount);
    }

    /**
     * Remove an item from the player inventory a given number of time.
     * @param {import("./item.js").Item} item The item to remove.
     * @param {number} amount The number of item to remove.
     */
    removeItem(item, amount) {
        if (item === this.game.errors.item || isNaN(amount) || amount < 1 || item.amount < amount) {
            console.log("Failed to remove item with id: " + item.id + " and amount: " + amount);
            return;
        }

        // Remove from slots until the remaining amount reaches 0 or no more item is found.
        let remainingAmount = amount;
        for (const slot of this.inventory) {
            if (slot.item === item) {
                remainingAmount = slot.removeItem(this.game, remainingAmount);
                if (slot.save.amount === 0) {
                    this.inventory.delete(slot);
                }
                if (remainingAmount === 0) {
                    return;
                }
            }
        }
    }

    /**
     * Remove an item from the player inventory a given number of time.
     * @param {string} id The unique id of the item.
     * @param {number} amount The number of item to remove.
     */
    removeItemById(id, amount) {
        this.removeItem(this.game.items.getItem(id), amount);
    }

    /**
     * Add a given inventory slot to the inventory.
     * @param {InventorySlot} slot The inventory slot to add to the inventory.
     */
    addSlot(slot) {
        this.inventory.add(slot);
    }

    /**
     * Delete a given inventory slot from the inventory.
     * @param {InventorySlot} slot The inventory slot to delete from the inventory.
     */
    deleteSlot(slot) {
        this.inventory.delete(slot);
    }
}