/**
 * @typedef actionsLoaded
 * @prop {string} language The language that was loaded.
 */

/**
 * @typedef itemsLoaded
 * @prop {string} language The language that was loaded.
 */

/**
 * @typedef skillsLoaded
 * @prop {string} language The language that was loaded.
 */

/**
 * @typedef languageLoaded
 * @prop {string} language The language that was loaded.
 */

/**
 * @typedef xpAdded
 * @prop {import("../skills/skill.js").Skill} skill The skill that the xp was added.
 * @prop {number} amount The amount of xp that was added.
 */

/**
 * @typedef leveledUp
 * @prop {import("../skills/skill.js").Skill} skill The skill that leveled up.
 */

/**
 * @typedef itemAdded
 * @prop {import("../items/manager_inventory.js").InventorySlot} slot The inventory slot containing the item that was added.
 * @prop {number} amount The amount of item added.
 * @prop {boolean} wasCreated True when the inventory slot was created by the addItem function or false when the slot amount was updated.
 */

/**
 * @typedef itemRemoved
 * @prop {import("../items/manager_inventory.js").InventorySlot} slot The inventory slot containing the item that was removed.
 * @prop {number} amount The amount of item removed.
 * @prop {boolean} wasDeleted True when the inventory slot was deleted by the addItem function or false when the slot amount was updated.
 */

/**
 * @typedef itemEquipped
 * @prop {import("../items/manager_equipment.js").EquipmentSlot} slot The equipment slot of the item that was equipped.
 * @prop {import("../items/item.js").Item} item The item that the player equipped.
 */

/**
 * @typedef itemUnequipped
 * @prop {import("../items/manager_equipment.js").EquipmentSlot} slot The equipment slot of the item that was unequipped.
 * @prop {import("../items/item.js").Item} item The item that the player unequipped.
 */

/**
 * @typedef actionStarted
 * @prop {import("../actions/action.js").Action} action The action that was started.
 */

/**
 * @typedef actionEnded
 * @prop {import("../actions/action.js").Action} action The action that ended.
 */

/**
 * @typedef actionStopped
 * @prop {import("../actions/action.js").Action} action The action that was stopped.
 */

/** Manager class for the events. */
export class Manager_Event {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /** 
         * Database of all events in the game.
         * @type {Object.<string, Event>}
         */
        this.db = {
            actionsLoaded: new Event("actionsLoaded"),
            itemsLoaded: new Event("itemsLoaded"),
            skillsLoaded: new Event("skillsLoaded"),
            languageLoaded: new Event("languageLoaded"),
            multipliersApplied: new Event("multipliersApplied"),
            xpAdded: new Event("xpAdded"),
            leveledUp: new Event("leveledUp"),
            itemAdded: new Event("itemAdded"),
            itemRemoved: new Event("itemRemoved"),
            itemEquipped: new Event("itemEquipped"),
            itemUnequipped: new Event("itemUnequipped"),
            actionStarted: new Event("actionStarted"),
            actionEnded: new Event("actionEnded"),
            actionStopped: new Event("actionStopped")
        };
    }

    /**
     * Dispatch a given event if found.
     * @param {string} eventName The name of the event to dispatch.
     * @param {*} [eventData] Optional data object to pass along with the event.
     */
    dispatch(eventName, eventData = {}) {
        const event = this.db[eventName];
        if (event === undefined) {
            return;
        }
        event.eventData = eventData;
        document.dispatchEvent(event);
    }
}