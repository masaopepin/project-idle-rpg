import { Conditions } from "../misc/condition.js";

/**
 * @typedef EquipmentSave
 * @prop {string} id The unique id of the equipment slot.
 * @prop {string} itemId The unique id of the item in the slot.
 * @prop {import("./item.js").ItemSave} save The item save associated with the item.
 */

/** Class for slots of equipped items. */
export class EquipmentSlot {
    /**
     * @param {string} id The unique id of the slot.
     * @param {import("./item.js").Item} [item] Optional item in the slot. Defaults to null.
     * @param {import("./item.js").ItemSave} [save] Optional item save associated with the item. Defaults to null.
     */
    constructor(id, item, save) {
        this.id = id === undefined ? "error" : id;
        this.item = item === undefined ? null : item;
        this.save = save === undefined ? null : save;
    }

    /**
     * Equip an item from inventory to the corresponding equipment slot.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {import("./manager_inventory.js").InventorySlot} inventorySlot The inventory slot containing the item to equip.
     */
    equip(game, inventorySlot) {
        const item = inventorySlot.item;
        if (!new Conditions(game, item.conditionsData).checkConditions()) {
            return;
        }
        if (!this.canEquip(game)) {
            return;
        }
        // Unequip the item in the slot first if any.
        this.unequip(game);

        const newSave = Object.fromEntries(Object.entries(inventorySlot.save));
        newSave.amount = 1;
        this.save = newSave;
        this.item = item;

        inventorySlot.removeItem(game, newSave.amount);
        game.events.dispatch("itemEquipped", { slot: this, item: item});
    }

    /**
     * Determine if it's currently possible to equip an item in the slot.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @returns True if an item could be equipped or false if it couldn't.
     */
    canEquip(game) {
        return this.item === null || !game.inventory.isFull;
    }

    /**
     * Unequip the item in the slot if any.
     * @param {import("../main.js").Game_Instance} game The game instance. 
     */
    unequip(game) {
        if (!this.canUnequip(game)) {
            return;
        }
        const item = this.item;
        game.inventory.addItem(item, this.save.amount);
        this.save = null;
        this.item = null;
        game.events.dispatch("itemUnequipped", { slot: this, item: item});
    }

    /**
     * Determine if it's currently possible to unequip the item in the slot.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @returns True if the item could be unequipped or false if it couldn't.
     */
    canUnequip(game) {
        return this.item !== null && !game.inventory.isFull;
    }
}

export class Manager_Equipment {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /** An array containing all equipments slot unique id. */
        this.slotsId = [
            "type_fishingTools",
            "type_miningTools",
            "type_woodcuttingTools",
            "type_cookingTools",
            "type_smithingTools",
            "type_carpenteringTools"
        ];
        /**
         * The set of all equipment slot.
         * @type {EquipmentSlot[]}
         */
        this.equipments = new Set();
        this.slotsId.forEach((slotId) => { this.equipments.add(new EquipmentSlot(slotId)); });
    }

    /**
     * Save the currently equipped items into an array.
     * @returns The array of equipment save.
     */
    save() {
        /** @type {EquipmentSave[]} */
        const equipmentSaves = [];
        this.equipments.forEach((slot) => {
            if (slot.item !== null && slot.save !== null) {
                equipmentSaves.push({id: slot.id, itemId: slot.item.id, save: slot.save});
            }
        });
        return equipmentSaves;
    }

    /**
     * Load the given equipment save array into the class.
     * @param {EquipmentSave[]} equipmentSaves The array of equipment save to load.
     */
    load(equipmentSaves = []) {
        if (!Array.isArray(equipmentSaves)) {
            return;
        }
        equipmentSaves.forEach((equipmentSave) => {
            const equipmentSlot = this.getEquipmentSlot(equipmentSave.id);
            if (equipmentSlot !== null) {
                const item = this.game.items.getItem(equipmentSave.itemId);
                if (item !== this.game.errors.item) {
                    equipmentSlot.save = equipmentSave.save;
                    equipmentSlot.item = item;
                }
            }
        });
    }

    /**
     * Get the equipment slot corresponding to the given id.
     * @param {string} id The unique id of the slot. 
     * @returns The equipment slot or null if not found.
     */
    getEquipmentSlot(id) {
        for (const slot of this.equipments) {
            if (slot.id === id) {
                return slot;
            }
        }
        return null;
    }
}