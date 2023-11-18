import { Skill } from "./skill.js";

/**
 * Class for the mining skill.
 * @extends {Skill}
 */
export class Mining extends Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** @type {import("./skill.js").SkillData} */
        const skillData = {
            id: "mining",
            icon: "./assets/icons/skills/mining/mining_icon.png",
            gatheringNodesData: [
                {
                    id: "node_copperRock",
                    actionId: "action_mine",
                    duration: 2000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "mining",
                            skillLevel: 1
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "mining",
                            amount: 5
                        },
                        {
                            type: "item",
                            itemId: "copperOre",
                            amount: 1
                        }
                    ]
                },
                {
                    id: "node_tinRock",
                    actionId: "action_mine",
                    duration: 3000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "mining",
                            skillLevel: 10
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "mining",
                            amount: 10
                        },
                        {
                            type: "item",
                            itemId: "tinOre",
                            amount: 1
                        }
                    ]
                },
                {
                    id: "node_ironRock",
                    actionId: "action_mine",
                    duration: 4000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "mining",
                            skillLevel: 20
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "mining",
                            amount: 20
                        },
                        {
                            type: "item",
                            itemId: "ironOre",
                            amount: 1
                        }
                    ]
                }
            ]
        };
        super(game, skillData);
    }
}