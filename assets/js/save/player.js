import { save } from "./save_game.js";

/**
 * @typedef PlayerSave
 * @prop {number} maxActiveActions
 * @prop {import("../items/manager_inventory.js").InventorySave[]} inventory
 * @prop {import("../items/manager_equipment.js").EquipmentSave[]} equipments
 * @prop {import("../skills/skill.js").SkillSave[]} skills
 * @prop {import("../actions/action.js").ActionSave[]} actions
 * @prop {import("../upgrades/upgrade.js").UpgradeSave[]} upgrades
 * @prop {import("../shops/shop.js").ShopSave[]} shops
 */

/** Class for saving and loading the player data in the localStorage. */
export class Player {
    constructor() {}

    /**
     * Load data into the player class.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {?PlayerSave} obj The JavaScript object that was loaded.
     */
    load(game, obj = {}) {
        if (obj === null) {
            return;
        }

        if (obj.inventory !== undefined) {
            game.inventory.load(obj.inventory);
        }
        if (obj.equipments !== undefined) {
            game.equipments.load(obj.equipments);
        }
        if (obj.skills !== undefined) {
            game.skills.load(obj.skills);
        }
        if (obj.actions !== undefined) {
            game.actions.load(obj.actions);
        }
        if (obj.upgrades !== undefined) {
            game.upgrades.load(obj.upgrades);
        }
        if (obj.shops !== undefined) {
            game.shops.load(obj.shops);
        }
    }

    /**
     * Save the player to the localStorage.
     * @param {import("../main.js").Game_Instance} game The game instance.
     */
    save(game) {
        /** @type {PlayerSave} */
        const playerSave = {
            inventory: game.inventory.save(),
            equipments: game.equipments.save(),
            skills: game.skills.save(),
            actions: game.actions.save(),
            upgrades: game.upgrades.save(),
            shops: game.shops.save(),
        };
        save("Player", playerSave);
    }
}