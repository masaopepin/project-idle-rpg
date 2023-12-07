import { Skill } from "./skill.js";

/**
 * Class for the woodcutting skill.
 * @extends {Skill}
 */
export class Woodcutting extends Skill {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** @type {import("./skill.js").SkillData} */
        const skillData = {
            id: "woodcutting",
            icon: "./assets/icons/skills/woodcutting/woodcutting_icon.png",
            gatheringNodesData: [
                {
                    id: "node_deadTree",
                    actionId: "action_cut",
                    duration: 3000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "woodcutting",
                            skillLevel: 1
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "woodcutting",
                            amount: 5
                        },
                        {
                            type: "item",
                            itemId: "deadTreeLog",
                            amount: 1
                        }
                    ]
                },
                {
                    id: "node_oakTree",
                    actionId: "action_cut",
                    duration: 4000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "woodcutting",
                            skillLevel: 10
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "woodcutting",
                            amount: 10
                        },
                        {
                            type: "item",
                            itemId: "oakLog",
                            amount: 1
                        }
                    ]
                },
                {
                    id: "node_mapleTree",
                    actionId: "action_cut",
                    duration: 5000,
                    conditionsData: [
                        {
                            type: "skillLevel",
                            skillId: "woodcutting",
                            skillLevel: 20
                        }
                    ],
                    rewardsData: [
                        {
                            type: "skillXp",
                            skillId: "woodcutting",
                            amount: 20
                        },
                        {
                            type: "item",
                            itemId: "mapleLog",
                            amount: 1
                        }
                    ]
                }
            ]
        };
        super(game, skillData);
    }
}