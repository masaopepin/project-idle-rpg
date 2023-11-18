/**
 * @typedef ConditionData
 * @prop {string} type The type of the condition. Can be "skillLevel".
 * @prop {string} [skillId] Optional unique id of the required skill.
 * @prop {number} [skillLevel] Optional skill level required.
 */

/** Class that can hold multiple conditions. */
export class Conditions {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {ConditionData[]} conditionsData The array of data that will be added to the class.
     */
    constructor(game, conditionsData = []) {
        /** 
         * An array of condition that must be met to do something.
         * @type {Condition[]}
         */
        this.conditions = [];
        conditionsData.forEach((conditionData) => { this.createCondition(game, conditionData); });
    }

    /** 
     * Create a new condition with the given condition data.
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {ConditionData} conditionData An object containing info about the condition. */
    createCondition(game, conditionData = {}) {
        if (conditionData.type === "skillLevel") {
            this.conditions.push(new Condition_Skill_Level(game, conditionData));
        }
        else {
            this.conditions.push(new Condition(game, conditionData))
        }
    }

    /**
     * Check if the player meet the conditions.
     * @returns True if the player meet all conditions or false if any condition fails.
     */
    checkConditions() {
        for (const condition of this.conditions) {
            if (!condition.checkCondition()) {
                return false;
            }
        }
        return true;
    }

    /** @returns The condition string of all conditions as a single string. */
    getConditionsString() {
        let s = "";

        for (const condition of this.conditions) {
            s += condition.getConditionString();
        }

        return s;
    }
}

/** Class for condition that must be met to do something. */
export class Condition {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {ConditionData} conditionData An object containing info about the condition.
     */
    constructor(game, conditionData = {}) {
        this.game = game;
        /** The condition type. */
        this.type = conditionData.type === undefined ? "error" : conditionData.type;
    }

    /**
     * Check if the player meet the condition.
     * @returns True if the player meet the condition or false if the condition fails.
     */
    checkCondition() {
        console.log("Error checking condition with type: " + this.type);
        return false;
    }

    /** Get the string to display the condition. */
    getConditionString() {
        console.log("Error getting condition string with type: " + this.type);
        return "";
    }
}

/** Condition that requires a given skill level. */
export class Condition_Skill_Level extends Condition {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {ConditionData} conditionData An object containing info about the condition.
     */
    constructor(game, conditionData = {}) {
        super(game, conditionData);
        /** The required skill. */
        this.skill = game.skills.getSkill(conditionData.skillId);
        /** The required skill level. */
        this.skillLevel = conditionData.skillLevel === undefined ? Infinity : conditionData.skillLevel;
    }

    checkCondition() {
        if (this.skill.level >= this.skillLevel) {
            console.log("Condition skill level passed.");
            return true;
        }
        console.log("Condition skill level failed.");
        return false;
    }

    getConditionString() {
        if (this.checkCondition()) {
            return "";
        }
        return "<div class='d-flex align-items-center'><small class='text-danger'>" +
            this.game.languages.getString("condition_skillLevel") + this.skillLevel + "</small><img src='" +
            this.skill.icon + "' class='img-fluid ms-1' width='25px'></div>";
    }
}