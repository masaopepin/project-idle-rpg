/**
 * Object containing all ItemData in the tools category structured as {itemType: ItemData[]}.
 * @type {Object.<string, import("./item.js").ItemData[]>}
 */
export const TOOLS = {
    type_fishingTools: [
        {
            id: "bronzeRod",
            icon: "./assets/icons/tools/rods/bronze_rod.png",
            nextUpgrade: "ironRod",
            maxStack: 1,
            multipliers: {
                fishing_xp: 0.25,
                fishing_duration: -0.05
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "fishing",
                    skillLevel: "1"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 1000
                },
                {
                    type: "item",
                    itemId: "sardine",
                    amount: 5
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 500
                }
            ]
        },
        {
            id: "ironRod",
            icon: "./assets/icons/tools/rods/iron_rod.png",
            nextUpgrade: "steelRod",
            maxStack: 1,
            multipliers: {
                fishing_xp: 0.5,
                fishing_duration: -0.1
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "fishing",
                    skillLevel: "10"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 2500
                }
            ]
        },
        {
            id: "steelRod",
            icon: "./assets/icons/tools/rods/steel_rod.png",
            maxStack: 1,
            multipliers: {
                fishing_xp: 0.75,
                fishing_duration: -0.15
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "fishing",
                    skillLevel: "20"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 10000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ]
        }
    ],
    type_woodcuttingTools: [
        {
            id: "bronzeAxe",
            icon: "./assets/icons/tools/axes/bronze_axe.png",
            nextUpgrade: "ironAxe",
            maxStack: 1,
            multipliers: {
                woodcutting_xp: 0.25,
                woodcutting_duration: -0.05
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "woodcutting",
                    skillLevel: "1"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 1000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 500
                }
            ]
        },
        {
            id: "ironAxe",
            icon: "./assets/icons/tools/axes/iron_axe.png",
            nextUpgrade: "steelAxe",
            maxStack: 1,
            multipliers: {
                woodcutting_xp: 0.5,
                woodcutting_duration: -0.1
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "woodcutting",
                    skillLevel: "10"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 2500
                }
            ]
        },
        {
            id: "steelAxe",
            icon: "./assets/icons/tools/axes/steel_axe.png",
            maxStack: 1,
            multipliers: {
                woodcutting_xp: 0.75,
                woodcutting_duration: -0.15
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "woodcutting",
                    skillLevel: "20"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 10000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ]
        }
    ],
    type_miningTools: [
        {
            id: "bronzePickaxe",
            icon: "./assets/icons/tools/pickaxes/bronze_pickaxe.png",
            nextUpgrade: "ironPickaxe",
            maxStack: 1,
            multipliers: {
                mining_xp: 0.25,
                mining_duration: -0.05
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "mining",
                    skillLevel: "1"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 1000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 500
                }
            ]
        },
        {
            id: "ironPickaxe",
            icon: "./assets/icons/tools/pickaxes/iron_pickaxe.png",
            nextUpgrade: "steelPickaxe",
            maxStack: 1,
            multipliers: {
                mining_xp: 0.5,
                mining_duration: -0.1
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "mining",
                    skillLevel: "10"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 2500
                }
            ]
            
        },
        {
            id : "steelPickaxe",
            icon: "./assets/icons/tools/pickaxes/steel_pickaxe.png",
            maxStack: 1,
            multipliers: {
                mining_xp: 0.75,
                mining_duration: -0.15
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "mining",
                    skillLevel: "20"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 10000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ]
        }
    ],
    type_cookingTools: [
        {
            id: "bronzeKnife",
            icon: "./assets/icons/tools/knives/bronze_knife.png",
            nextUpgrade: "ironKnife",
            maxStack: 1,
            multipliers: {
                cooking_xp: 0.25,
                cooking_duration: -0.05
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "cooking",
                    skillLevel: "1"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 1000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 500
                }
            ]
        },
        {
            id: "ironKnife",
            icon: "./assets/icons/tools/knives/iron_knife.png",
            nextUpgrade: "steelKnife",
            maxStack: 1,
            multipliers: {
                cooking_xp: 0.5,
                cooking_duration: -0.1
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "cooking",
                    skillLevel: "10"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 2500
                }
            ]
            
        },
        {
            id : "steelKnife",
            icon: "./assets/icons/tools/knives/steel_knife.png",
            maxStack: 1,
            multipliers: {
                cooking_xp: 0.75,
                cooking_duration: -0.15
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "cooking",
                    skillLevel: "20"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 10000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ]
        }
    ],
    type_smithingTools: [
        {
            id: "bronzeHammer",
            icon: "./assets/icons/tools/hammers/bronze_hammer.png",
            nextUpgrade: "ironHammer",
            maxStack: 1,
            multipliers: {
                smithing_xp: 0.25,
                smithing_duration: -0.05
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "smithing",
                    skillLevel: "1"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 1000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 500
                }
            ]
        },
        {
            id: "ironHammer",
            icon: "./assets/icons/tools/hammers/iron_hammer.png",
            nextUpgrade: "steelHammer",
            maxStack: 1,
            multipliers: {
                smithing_xp: 0.5,
                smithing_duration: -0.1
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "smithing",
                    skillLevel: "10"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 2500
                }
            ]
            
        },
        {
            id : "steelHammer",
            icon: "./assets/icons/tools/hammers/steel_hammer.png",
            maxStack: 1,
            multipliers: {
                smithing_xp: 0.75,
                smithing_duration: -0.15
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "smithing",
                    skillLevel: "20"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 10000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ]
        }
    ],
    type_carpenteringTools: [
        {
            id: "bronzeSaw",
            icon: "./assets/icons/tools/saws/bronze_saw.png",
            nextUpgrade: "ironSaw",
            maxStack: 1,
            multipliers: {
                carpentering_xp: 0.25,
                carpentering_duration: -0.05
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "carpentering",
                    skillLevel: "1"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 1000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 500
                }
            ]
        },
        {
            id: "ironSaw",
            icon: "./assets/icons/tools/saws/iron_saw.png",
            nextUpgrade: "steelSaw",
            maxStack: 1,
            multipliers: {
                carpentering_xp: 0.5,
                carpentering_duration: -0.1
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "carpentering",
                    skillLevel: "10"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 2500
                }
            ]
        },
        {
            id: "steelSaw",
            icon: "./assets/icons/tools/saws/steel_saw.png",
            maxStack: 1,
            multipliers: {
                carpentering_xp: 0.75,
                carpentering_duration: -0.15
            },
            conditionsData: [
                {
                    type: "skillLevel",
                    skillId: "carpentering",
                    skillLevel: "20"
                }
            ],
            buyData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 10000
                }
            ],
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 5000
                }
            ]
        }
    ]
};