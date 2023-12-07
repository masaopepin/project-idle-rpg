/** Class that defines all possible multipliers. */
export class Multipliers {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /**
         * Database of all multipliers.
         * @type {Object.<string, number>}
         */
        this.db = {
            fishing_xp: 1,
            fishing_duration: 1,
            mining_xp: 1,
            mining_duration: 1,
            woodcutting_xp: 1,
            woodcutting_duration: 1,
            cooking_xp: 1,
            cooking_duration: 1,
            smithing_xp: 1,
            smithing_duration: 1,
            carpentering_xp: 1,
            carpentering_duration: 1
        };

        document.addEventListener("itemEquipped", (e) => { this.itemEquipped(e); });
        document.addEventListener("itemUnequipped", (e) => { this.itemUnequipped(e); });
    }

    itemEquipped(e) {
        /** @type {import("../events/manager_event.js").itemEquipped} */
        const eventData = e.eventData;

        this.addMultipliers(eventData.item.multipliers);
        this.game.events.dispatch("multipliersApplied", null);
    }

    itemUnequipped(e) {
        /** @type {import("../events/manager_event.js").itemUnequipped} */
        const eventData = e.eventData;

        for (const [id, value] of Object.entries(eventData.item.multipliers)) {
            this.addMultiplier(id, value * -1);
        }
        this.game.events.dispatch("multipliersApplied", null);
    }

    /** Calculate and assign the value of all multipliers. */
    applyMultipliers() {
        for (const slot of this.game.equipments.equipments) {
            if (slot.item !== null) {
                this.addMultipliers(slot.item.multipliers);
            }
        }
        this.game.events.dispatch("multipliersApplied", null);
    }

    /** @returns The entries of all multipliers. */
    getMultipliers() {
        return Object.entries(this.db);
    }

    /**
     * Get the value of a given multiplier.
     * @param {string} multiplierId Unique id of the multiplier.
     * @returns The multiplier value or 1 if the multiplier doesn't exist.
     */
    getMultiplier(multiplierId) {
        const value = this.db[multiplierId];
        if (value === undefined) {
            return 1;
        }
        return value;
    }

    /**
     * Add the amount to a given multiplier.
     * @param {string} multiplierId Unique id of the multiplier.
     * @param {number} amount Amount to add.
     */
    addMultiplier(multiplierId, amount) {
        if (this.db[multiplierId] !== undefined) {
            this.db[multiplierId] += amount;
            this.game.events.dispatch("multipliersApplied", null);
        }
    }

    /**
     * Add the value of each pair of multipliers.
     * @param {Object.<string, number>} multipliers Object containing pairs of multiplierId and values.
     */
    addMultipliers(multipliers) {
        for (const [id, value] of Object.entries(multipliers)) {
            this.addMultiplier(id, value);
        }
    }
}