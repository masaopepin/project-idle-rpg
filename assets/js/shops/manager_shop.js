import { Shop } from "./shop.js";
import { SHOP_TOOLS } from "./shop_tools.js";

/** Manager class for the shops. */
export class Manager_Shop {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /**
         * Set of all shops in the game.
         * @type {Set.<Shop>}
         */
        this.shops = new Set();
        SHOP_TOOLS.forEach((shopData) => { this.shops.add(new Shop(shopData)); });
    }

    /**
     * Save all the shops into an array.
     * @returns The array of shop save.
     */
    save() {
        /** @type {import("./shop.js").ShopSave[]} */
        const shopSaves = []
        this.shops.forEach((shop) => {
            const save = shop.save();
            if (save.saves.length > 0) {
                shopSaves.push(save);
            }
        });
        return shopSaves;
    }

    /**
     * Load the given shop save array into the class.
     * @param {import("./shop.js").ShopSave[]} shopSaves The array of shop save to load.
     */
    load(shopSaves = []) {
        if (!Array.isArray(shopSaves)) {
            return;
        }
        shopSaves.forEach((shopSave) => {
            const shop = this.getShop(shopSave.id);
            if (shop !== null) {
                shop.load(shopSave);
            }
        })
    }

    /**
     * Get a shop by it's unique id.
     * @param {string} id The unique id of the shop. 
     * @returns The shop if found or null.
     */
    getShop(id) {
        for (const shop of this.shops) {
            if (shop.id === id) {
                return shop;
            }
        }
        return null;
    }
}