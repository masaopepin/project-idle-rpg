import { Skill } from "./skill.js";

/**
 * Class for the fishing skill.
 * @extends {Skill}
 */
export class Fishing extends Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** @type {import("./skill.js").SkillData} */
        const skillData = {
            id: "fishing",
            icon: "./assets/icons/skills/fishing/fishing_icon.png",
            gatheringNodesData: [
                {
                    id: "node_sardineFish",
                    actionId: "action_fish",
                    duration: 2000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "fishing",
                            skillLevel: 1
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "fishing",
                            amount: 5
                        },
                        {
                            type: "item",
                            itemId: "rawSardine",
                            amount: 1,
                        }
                    ]
                },
                {
                    id: "node_troutFish",
                    actionId: "action_fish",
                    duration: 3000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "fishing",
                            skillLevel: 10
                        },
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "fishing",
                            amount: 10
                        },
                        {
                            type: "item",
                            itemId: "rawTrout",
                            amount: 1
                        }
                    ]
                },
                {
                    id: "node_salmonFish",
                    actionId: "action_fish",
                    duration: 4000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "fishing",
                            skillLevel: 20
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "fishing",
                            amount: 20
                        },
                        {
                            type: "item",
                            itemId: "rawSalmon",
                            amount: 1
                        }
                    ]
                }
            ]
        };
        super(game, skillData);
    }
}