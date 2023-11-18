/**
 * Object containing all ItemData in the resources category structured as {itemType: ItemData[]}.
 * @type {Object.<string, import("./item.js").ItemData[]>}
 */
export const RESOURCES = {
    type_logs: [
        {
            id: "deadTreeLog",
            icon: "./assets/icons/resources/logs/dead_tree_log.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 20
                }
            ]
        },
        {
            id: "oakLog",
            icon: "./assets/icons/resources/logs/oak_log.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 50
                }
            ]
        },
        {
            id: "mapleLog",
            icon: "./assets/icons/resources/logs/maple_log.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 100
                }
            ]
        }
    ],
    type_ores: [
        {
            id: "copperOre",
            icon: "./assets/icons/resources/ores/copper_ore.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 20
                }
            ]
        },
        {
            id: "tinOre",
            icon: "./assets/icons/resources/ores/tin_ore.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 50
                }
            ]
        },
        {
            id: "ironOre",
            icon: "./assets/icons/resources/ores/iron_ore.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 100
                }
            ]
        }
    ],
    type_rawFishes: [
        {
            id: "rawSardine",
            icon: "./assets/icons/resources/raw_fishes/raw_sardine.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 20
                }
            ]
        },
        {
            id: "rawTrout",
            icon: "./assets/icons/resources/raw_fishes/raw_trout.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 50
                }
            ]
        },
        {
            id: "rawSalmon",
            icon: "./assets/icons/resources/raw_fishes/raw_salmon.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 100
                }
            ]
        }
    ],
};