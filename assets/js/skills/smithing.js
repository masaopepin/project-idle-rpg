import { Skill } from "./skill.js";

/**
 * Class for the smithing skill.
 * @extends {Skill}
 */
export class Smithing extends Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** @type {import("./skill.js").SkillData} */
        const skillData = {
            id: "smithing",
            icon: "./assets/icons/skills/smithing/smithing_icon.png",
            craftingRecipesData: {
                type_ingots: [
                    {
                        id: "bronzeIngot",
                        actionId: "action_smelt",
                        duration: 2000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "copperOre",
                                amount: 1
                            },
                            {
                                type: "item",
                                itemId: "tinOre",
                                amount: 1
                            }
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "smithing",
                                skillLevel: 1
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "smithing",
                                amount: 5
                            },
                            {
                                type: "item",
                                itemId: "bronzeIngot",
                                amount: 1
                            }
                        ]
                    },
                    {
                        id: "ironIngot",
                        actionId: "action_smelt",
                        duration: 2000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "ironOre",
                                amount: 2
                            }
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "smithing",
                                skillLevel: 10
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "smithing",
                                amount: 10
                            },
                            {
                                type: "item",
                                itemId: "ironIngot",
                                amount: 1
                            }
                        ]
                    },
                    {
                        id: "steelIngot",
                        actionId: "action_smelt",
                        duration: 2000,
                        costsData: [
                            {
                                type: "item",
                                itemId: "ironOre",
                                amount: 1
                            },
                            {
                                type: "item",
                                itemId: "coalOre",
                                amount: 1
                            }
                        ],
                        conditionsData: [
                            {
                                type: "skillLevel",
                                skillId: "smithing",
                                skillLevel: 20
                            }
                        ],
                        rewardsData: [
                            {
                                type: "skillXp",
                                skillId: "smithing",
                                amount: 20
                            },
                            {
                                type: "item",
                                itemId: "steelIngot",
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