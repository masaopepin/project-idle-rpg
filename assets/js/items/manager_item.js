import { Item } from "./item.js";
import { CURRENCIES } from "./currencies.js";
import { FOODS } from "./foods.js";
import { MATERIALS } from "./materials.js";
import { RESOURCES } from "./resources.js";
import { TOOLS } from "./tools.js";

/** Manager class for all item in the game. */
export class Manager_Item {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** Boolean set to true when the items are fully loaded. */
        this.itemsLoaded = false;
        /** The game instance. */
        this.game = game;
        /** 
         * Database of all item in the game structured as {item.id: Item}.
         * @type {Object.<string, Item>} 
         */
        this.db = {};
        /** @type {Object.<string, string[]>} */
        this.categories = {};
        this.registerCategory("category_currencies", CURRENCIES);
        this.registerCategory("category_foods", FOODS);
        this.registerCategory("category_materials", MATERIALS);
        this.registerCategory("category_tools", TOOLS);
        this.registerCategory("category_resources", RESOURCES);

        if (game.languages.isLanguageLoaded === true) {
            this.languageLoaded({eventData: {language: game.settings.language}});
        }
        document.addEventListener("languageLoaded", (e) => { this.languageLoaded(e); });
    }

    languageLoaded(e) {
        this.itemsLoaded = false;
        const allString = this.game.languages.getString("all");
        this.categories = {};
        this.categories[allString] = [allString];

        Object.values(this.db).forEach((item) => {
            item.name = this.game.languages.getString(item.id);
            const categoryString = this.game.languages.getString(item.categoryId);
            item.category = categoryString;
            const typeString = this.game.languages.getString(item.typeId);
            item.type = typeString;
            item.description = this.game.languages.getString(item.id + "_desc");

            let category = this.categories[categoryString];
            if (category === undefined) {
                category = this.categories[categoryString] = [allString];
            }
            if (!category.includes(typeString)) {
                this.categories[allString].push(typeString);
                category.push(typeString);
            }
        });
        this.itemsLoaded = true;
        this.game.events.dispatch("itemsLoaded", e.eventData);
    }

    /**
     * Register a given category of items in the database.
     * @param {string} categoryId The unique id of the category.
     * @param {Object.<string, import("./item.js").ItemData[]>} itemsData An object containing all the item data of a category.
     */
    registerCategory(categoryId, categoryItems) {
        for (const [typeId, itemsData] of Object.entries(categoryItems)) {
            itemsData.forEach((itemData) => { this.registerItem(categoryId, typeId, itemData); });
        }
    }

    /**
     * Register an item in the database.
     * @param {string} categoryId The category id of the item.
     * @param {string} typeId The type id of the item.
     * @param {import("./item.js").ItemData} itemData The item data to use to create the item.
     */
    registerItem(categoryId, typeId, itemData) {
        if (this.db[itemData.id] !== undefined) {
            console.log("An item with the id: " + itemData.id + " already exists in the database.");
            return;
        }
        itemData.categoryId = categoryId;
        itemData.typeId = typeId;
        this.db[itemData.id] = new Item(itemData);
    }

    /**
     * Get an item from the database if it exists.
     * @param {string} id The unique id of the item.
     * @returns The item if found or the error item if not found.
     */
    getItem(id) {
        const item = this.db[id];
        if (item === undefined) {
            console.log("Failed to get item with id: " + id);
            return this.game.errors.item;
        }
        return item;
    }
}