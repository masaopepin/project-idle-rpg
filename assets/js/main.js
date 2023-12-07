import { Player } from "./save/player.js";
import { Settings } from "./save/settings.js";
import { load } from "./save/save_game.js";
import { Manager_Error } from "./events/manager_error.js";
import { Manager_Action } from "./actions/manager_action.js";
import { Manager_Event } from "./events/manager_event.js";
import { Manager_Item } from "./items/manager_item.js";
import { Manager_Language } from "./languages/manager_language.js";
import { Manager_Page } from "./pages/manager_page.js";
import { Manager_Shop } from "./shops/manager_shop.js";
import { Manager_Skill } from "./skills/manager_skill.js";
import { Multipliers } from "./misc/multipliers.js";
import { Manager_Inventory } from "./items/manager_inventory.js";
import { Manager_Equipment } from "./items/manager_equipment.js";
import { Manager_Upgrade } from "./upgrades/manager_upgrade.js";
import { Costs } from "./misc/cost.js";
import { Rewards } from "./misc/reward.js";
import { Conditions } from "./misc/condition.js";
import { Item } from "./items/item.js";

/** Main object of the game. */
export class Game_Instance {
    constructor() {
        /** Class that contains all errors class. */
        this.errors = new Manager_Error(this);
        /** Manager for the events. */
        this.events = new Manager_Event();
        /** Class that contains all info about the settings. */
        this.settings = new Settings();
        this.settings.load(load("Settings"));
        /** Manager for the languages. */
        this.languages = new Manager_Language(this);
        /** Class that contains all multipliers that can modify values. */
        this.multipliers = new Multipliers(this);
        /** Manager for the items. */
        this.items = new Manager_Item(this);
        /** Manager for the inventory. */
        this.inventory = new Manager_Inventory(this);
        /** Manager for the equipments. */
        this.equipments = new Manager_Equipment(this);
        /** Manager for the skills. */
        this.skills = new Manager_Skill(this);
        /** Class that contains all info about the actions. */
        this.actions = new Manager_Action(this);
        /** Manager for the upgrades. */
        this.upgrades = new Manager_Upgrade(this);
        /** Manager for the shops. */
        this.shops = new Manager_Shop(this);
        /** Class that contains all info about the player. */
        this.player = new Player();
        this.player.load(this, load("Player"));
        this.multipliers.applyMultipliers();
        /** Manager for the pages. */
        this.pages = new Manager_Page(this);
    }

    /**
     * Create a new item from the given data.
     * @param {import("./items/item.js").ItemData} itemData The item data to create the item.
     * @returns The new item.
     */
    createItem(itemData = {}) {
        return new Item(itemData);
    }

    /**
     * Create a new conditions from the given data.
     * @param {import("./misc/condition.js").ConditionData[]} conditionsData The array of condition data to create the conditions.
     * @returns The new conditions.
     */
    createConditions(conditionsData = []) {
        return new Conditions(this, conditionsData);
    }

    /**
     * Create a new costs from the given data.
     * @param {import("./misc/cost.js").CostData[]} costsData The array of cost data to create the costs.
     * @returns The new costs.
     */
    createCosts(costsData = []) {
        return new Costs(this, costsData);
    }

    /**
     * Create a new rewards from the given data.
     * @param {import("./misc/reward.js").RewardData[]} rewardsData The array of reward data to create the rewards.
     * @returns The new rewards.
     */
    createRewards(rewardsData = []) {
        return new Rewards(this, rewardsData);
    }
}

/** Main object of the game. */
const GAME_INSTANCE = new Game_Instance();

/** Time between intervals. Set to 30 fps by default. */
const REFRESH_RATE = 1000 / 30;

/** Elapsed time since last auto-save. */
let autoSaveTimer = 0;

/** Last time the game was updated. Used to calculate delta time. */
let lastUpdate = Date.now();

/** The id of the main update interval. */
let updateIntervalId = 0;

/** Start the game at the REFRESH_RATE speed. */
function main() {
    updateIntervalId = setInterval(update, REFRESH_RATE);
}

/** Update all parts of the game that need constant update. */
function update() {
    const time = Date.now();
    const deltaTime = time - lastUpdate;
    lastUpdate = time;

    if (GAME_INSTANCE.settings.autoSave > 0) {
        autoSaveTimer += deltaTime;
        if (autoSaveTimer >= GAME_INSTANCE.settings.autoSave) {
            GAME_INSTANCE.player.save(GAME_INSTANCE);
            autoSaveTimer = 0;
        }
    }
    
    GAME_INSTANCE.pages.update(deltaTime);
    GAME_INSTANCE.actions.activeActions.forEach((action) => {
        action.update(deltaTime);
    });
}

main();