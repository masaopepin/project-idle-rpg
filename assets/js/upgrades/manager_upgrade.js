import { Upgrade_InventorySize, Upgrade_MultiplierDuration, Upgrade_MultiplierXp, Upgrade_Multitasking } from "./upgrade.js";

/** Manager class for the upgrades the player can buy. */
export class Manager_Upgrade {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /** @type {Set.<import("./upgrade.js").Upgrade} */
        this.upgrades = new Set();
        this.upgrades.add(new Upgrade_InventorySize(game, {id: "inventorySize", levelCap: 90, costs: [{type: "item", itemId: "money", amount: 1000}]}));
        this.upgrades.add(new Upgrade_Multitasking(game, {id: "multitasking", levelCap: 4, costs: [{type:"item", itemId: "money", amount: 5000}]}));
        for (const [id, value] of game.multipliers.getMultipliers()) {
            if (id.endsWith("_xp")) {
                this.upgrades.add(new Upgrade_MultiplierXp(game, {id: id, levelCap: 100, costs: [{type: "item", itemId:"money", amount: 1000}]}));
            }
            else if (id.endsWith("_duration")) {
                this.upgrades.add(new Upgrade_MultiplierDuration(game, {id: id, levelCap: 100, costs: [{type: "item", itemId:"money", amount: 2000}]}));
            }
        }
    }

    /**
     * Save all the upgrades into an array.
     * @returns The array of upgrade save.
     */
    save() {
        /** @type {import("./upgrade.js").UpgradeSave[]} */
        const saves = [];
        this.upgrades.forEach((upgrade) => {
            const save = upgrade.save();
            if (save.id !== undefined) {
                saves.push(save);
            }
        });
        return saves;
    }

    /**
     * Load the given upgrade save array into the class.
     * @param {import("./upgrade.js").UpgradeSave[]} upgradeSaves The array of upgrade save to load.
     */
    load(upgradeSaves = []) {
        if (!Array.isArray(upgradeSaves)) {
            return;
        }

        upgradeSaves.forEach((upgradeSave) => {
            const upgrade = this.getUpgrade(upgradeSave.id);
            if (upgrade !== null) {
                upgrade.load(upgradeSave);
                upgrade.apply(this.game);
            }
        });
    }

    /**
     * @param {string} id The unique id of the upgrade.
     * @returns The upgrade that corresponds to the given unique id or null if not found.
     */
    getUpgrade(id) {
        for (const upgrade of this.upgrades) {
            if (upgrade.id === id) {
                return upgrade;
            }
        }
        return null;
    }
}