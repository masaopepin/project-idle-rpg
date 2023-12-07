/**
 * Object containing all ItemData in the tools category structured as {itemType: ItemData[]}.
 * @type {Object.<string, import("./item.js").ItemData[]>}
 */
export const TOOLS = {
    type_fishingTools: [
        {
            id: "bronzeRod",
            icon: "./assets/icons/tools/rods/bronze_rod.png",
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
                    itemId: "rawSardine",
                    amount: 20
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
                },
                {
                    type: "item",
                    itemId: "rawTrout",
                    amount: 50
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
                },
                {
                    type: "item",
                    itemId: "rawSalmon",
                    amount: 100
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
                },
                {
                    type: "item",
                    itemId: "deadTreeLog",
                    amount: 20
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
                },
                {
                    type: "item",
                    itemId: "oakLog",
                    amount: 50
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
                },
                {
                    type: "item",
                    itemId: "mapleLog",
                    amount: 100
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
                },
                {
                    type: "item",
                    itemId: "copperOre",
                    amount: 10
                },
                {
                    type: "item",
                    itemId: "tinOre",
                    amount: 10
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
                },
                {
                    type: "item",
                    itemId: "ironOre",
                    amount: 50
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
                },
                {
                    type: "item",
                    itemId: "coalOre",
                    amount: 100
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
                },
                {
                    type: "item",
                    itemId: "sardine",
                    amount: 20
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
                },
                {
                    type: "item",
                    itemId: "trout",
                    amount: 50
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
                },
                {
                    type: "item",
                    itemId: "salmon",
                    amount: 100
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
                },
                {
                    type: "item",
                    itemId: "bronzeIngot",
                    amount: 20
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
                },
                {
                    type: "item",
                    itemId: "ironIngot",
                    amount: 50
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
                },
                {
                    type: "item",
                    itemId: "steelIngot",
                    amount: 100
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
                },
                {
                    type: "item",
                    itemId: "deadTreePlank",
                    amount: 20
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
                },
                {
                    type: "item",
                    itemId: "oakPlank",
                    amount: 50
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
                },
                {
                    type: "item",
                    itemId: "maplePlank",
                    amount: 100
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