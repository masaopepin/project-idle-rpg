import { Skill } from "./skill.js";

/**
 * Class for the carpentering skill.
 * @extends {Skill}
 */
export class Carpentering extends Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** @type {import("./skill.js").SkillData} */
        const skillData = {
            id: "carpentering",
            icon: "./assets/icons/skills/carpentering/carpentering_icon.png",
            craftingRecipesData: {
                type_planks: [
                    {
                        id: "deadTreePlank",
                        actionId: "action_saw",
                        duration: 3000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "deadTreeLog",
                                amount: 1
                            },
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "carpentering",
                                skillLevel: 1
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "carpentering",
                                amount: 5
                            },
                            {
                                type: "item",
                                itemId: "deadTreePlank",
                                amount: 1
                            }
                        ]
                    },
                    {
                        id: "oakPlank",
                        actionId: "action_saw",
                        duration: 4000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "oakLog",
                                amount: 1
                            },
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "carpentering",
                                skillLevel: 10
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "carpentering",
                                amount: 10
                            },
                            {
                                type: "item",
                                itemId: "oakPlank",
                                amount: 1
                            }
                        ]
                    },
                    {
                        id: "maplePlank",
                        actionId: "action_saw",
                        duration: 5000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "mapleLog",
                                amount: 1
                            },
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "carpentering",
                                skillLevel: 20
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "carpentering",
                                amount: 20
                            },
                            {
                                type: "item",
                                itemId: "maplePlank",
                                amount: 1
                            }
                        ]
                    }
                ]
            }
        };
        super(game, skillData);
    }
}