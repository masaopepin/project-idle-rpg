/**
 * @typedef UpgradeData
 * @prop {string} id The unique id of the upgrade.
 * @prop {number} levelCap The maximum level of the upgrade. Defaults to 1.
 * @prop {import("../misc/cost.js").CostData[]} costs The currency costs of the upgrade.
 */

/**
 * @typedef UpgradeSave
 * @prop {string} id The unique id of the upgrade.
 * @prop {number} level The current level of the upgrade.
 */

/** Base class for upgrades that the player can buy. */
export class Upgrade {
    /**
     * 
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {UpgradeData} upgradeData An object containing info about the upgrade.
     */
    constructor(game, upgradeData = {}) {
        /** The unique id of the upgrade. */
        this.id = upgradeData.id === undefined ? "error" : upgradeData.id;
        /** The currency costs of the upgrade. */
        this.costs = upgradeData.costs === undefined ? game.errors.costs : game.createCosts(upgradeData.costs);
        /** @private The current level of the upgrade. */
        this._level = 0;
        /** The maximum level of the upgrade. */
        this.levelCap = upgradeData.levelCap === undefined ? 1 : upgradeData.levelCap;
    }

    /** The current level of the upgrade. */
    get level() {
        return this._level;
    }

    get cappedLevel() {

    }

    /** @returns The save object for the upgrade. */
    save() {
        /** @type {UpgradeSave} */
        const upgradeSave = {};
        if (this.level > 0) {
            upgradeSave.id = this.id;
            upgradeSave.level = this.level;
        }
        return upgradeSave;
    }

    /**
     * Load a given save object into the class.
     * @param {UpgradeSave} upgradeSave The save object to load.
     */
    load(upgradeSave = {}) {
        if (upgradeSave.level !== undefined) {
            this._level = upgradeSave.level;
        }
    }

    /**
     * Buy levels for the upgrade a given number of time.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {number} amount The number of levels to buy.
     */
    buyLevel(game, amount) {
        if (isNaN(amount) || amount < 1) {
            return;
        }
        amount = Math.floor(amount);
        const newAmount = this.level + amount;
        if (newAmount > this.levelCap) {
            game.pages.createFailureToast(game.languages.getString("error_maxLevelReached"));
            return;
        }
        if (!this.costs.checkCurrencies(amount)) {
            game.pages.createFailureToast(game.languages.getString("error_notEnoughCurrency"));
            return;
        }

        this.unapply(game);
        this._level = newAmount;
        this.costs.removeCurrencies(amount);
        this.apply(game);
        game.pages.createSuccessToast(game.languages.getString("success_purchaseCompleted"));
    }

    /**
     * Apply the upgrade based on the current level.
     * @param {import("../main.js").Game_Instance} game The game instance.
     */
    apply(game) {
        game.events.dispatch("upgradeApplied", {upgrade: this});
    }

    /**
     * Unapply the upgrade based on the current level.
     * @param {import("../main.js").Game_Instance} game The game instance.
     */
    unapply(game) {}
}

/**
 * Upgrade that increases the max inventory size.
 * @extends {Upgrade}
 */
export class Upgrade_InventorySize extends Upgrade {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {UpgradeData} upgradeData An object containing info about the upgrade.
     */
    constructor(game, upgradeData) {
        super(game, upgradeData);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    apply(game) {
        game.inventory.setMaxSize(game.inventory.maxSize + this.level);
        super.apply(game);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    unapply(game) {
        game.inventory.setMaxSize(game.inventory.maxSize - this.level);
    }
}

/**
 * Upgrade that increases the max active actions.
 * @extends {Upgrade}
 */
export class Upgrade_Multitasking extends Upgrade {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {UpgradeData} upgradeData An object containing info about the upgrade.
     */
    constructor(game, upgradeData) {
        super(game, upgradeData);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    apply(game) {
        game.actions.setMaxActions(game.actions.maxActions + this.level);
        super.apply(game);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    unapply(game) {
        game.actions.setMaxActions(game.actions.maxActions - this.level);
    }
}

/**
 * Upgrade that increases a xp multiplier.
 * @extends {Upgrade}
 */
export class Upgrade_MultiplierXp extends Upgrade {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {UpgradeData} upgradeData An object containing info about the upgrade.
     */
    constructor(game, upgradeData) {
        super(game, upgradeData);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    apply(game) {
        game.multipliers.addMultiplier(this.id, this.level * 0.01);
        super.apply(game);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    unapply(game) {
        game.multipliers.addMultiplier(this.id, this.level * -0.01);
    }
}

/**
 * Upgrade that increases a duration multiplier.
 * @extends {Upgrade}
 */
export class Upgrade_MultiplierDuration extends Upgrade {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {UpgradeData} upgradeData An object containing info about the upgrade.
     */
    constructor(game, upgradeData) {
        super(game, upgradeData);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    apply(game) {
        game.multipliers.addMultiplier(this.id, this.level * -0.001);
        super.apply(game);
    }

    /** @param {import("../main.js").Game_Instance} game The game instance. */
    unapply(game) {
        game.multipliers.addMultiplier(this.id, this.level * 0.001);
    }
}
