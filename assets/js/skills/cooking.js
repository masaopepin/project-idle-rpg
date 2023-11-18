import { Skill } from "./skill.js";

/**
 * Class for the cooking skill.
 * @extends {Skill}
 */
export class Cooking extends Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** @type {import("./skill.js").SkillData} */
        const skillData = {
            id: "cooking",
            icon: "./assets/icons/skills/cooking/cooking_icon.png",
            craftingRecipesData: {
                type_fishes: [
                    {
                        id: "sardine",
                        actionId: "action_cook",
                        duration: 2000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "rawSardine",
                                amount: 1
                            },
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "cooking",
                                skillLevel: 1
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "cooking",
                                amount: 5
                            },
                            {
                                type: "item",
                                itemId: "sardine",
                                amount: 1
                            }
                        ]
                    },
                    {
                        id: "trout",
                        actionId: "action_cook",
                        duration: 2000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "rawTrout",
                                amount: 1
                            },
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "cooking",
                                skillLevel: 10
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "cooking",
                                amount: 10
                            },
                            {
                                type: "item",
                                itemId: "trout",
                                amount: 1
                            }
                        ]
                    },
                    {
                        id: "salmon",
                        actionId: "action_cook",
                        duration: 2000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "rawSalmon",
                                amount: 1
                            },
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "cooking",
                                skillLevel: 20
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "cooking",
                                amount: 20
                            },
                            {
                                type: "item",
                                itemId: "salmon",
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