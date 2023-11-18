import { Fishing } from "./fishing.js";
import { Mining } from "./mining.js";
import { Woodcutting } from "./woodcutting.js";
import { Smithing } from "./smithing.js";
import { Carpentering } from "./carpentering.js";
import { Cooking } from "./cooking.js";

/** Manager class for all skills in the game. */
export class Manager_Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** Boolean set to true when the skills are fully loaded. */
        this.skillsLoaded = false;
        /** The game instance. */
        this.game = game;
        /** 
         * Array containing all the skills. 
         * @type {import("../skills/skill.js").Skill[]}
         */
        this.skills = [
            new Fishing(game),
            new Mining(game),
            new Woodcutting(game),
            new Cooking(game),
            new Smithing(game),
            new Carpentering(game)
        ];

        if (game.languages.isLanguageLoaded === true) {
            this.languageLoaded();
        }
        document.addEventListener("languageLoaded", (e) => { this.languageLoaded(e); });
    }

    languageLoaded(e) {
        this.skillsLoaded = false;
        this.skills.forEach((skill) => {
            skill.name = this.game.languages.getString(skill.id);
        });
        this.skillsLoaded = true;
        this.game.events.dispatch("skillsLoaded", e.eventData);
    }

    /** @returns {import("./skill.js").SkillSave[]} An array of skills save. */
    save() {
        const skills = [];
        this.skills.forEach((skill) => {
            skills.push(skill.save());
        });
        return skills;
    }

    /**
     * Load the given skill save array into the skills class.
     * @param {import("./skill.js").SkillSave[]} skills The array of skill save to load.
     */
    load(skills = []) {
        if (!Array.isArray(skills)) {
            return;
        }
        skills.forEach((skill) => { this.getSkill(skill.id).load(skill); });
    }

    /**
     * Get a skill with a given id.
     * @param {string} id The unique id of the Skill. 
     * @returns The Skill if it exists or the error skill.
     */
    getSkill(id = "error") {
        for (const skill of this.skills) {
            if (skill.id === id) {
                return skill;
            }
        }
        return this.game.errors.skill;
    }

    /** @returns An array of all skills in the game. */
    getSkills() {
        return this.skills;
    }
}