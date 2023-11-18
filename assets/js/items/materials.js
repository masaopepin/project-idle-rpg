/**
 * Object containing all ItemData in the materials category structured as {itemType: ItemData[]}.
 * @type {Object.<string, import("./item.js").ItemData[]>}
 */
export const MATERIALS = {
    type_ingots: [
        {
            id: "bronzeIngot",
            icon: "./assets/icons/materials/ingots/bronze_ingot.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 50
                }
            ]
        },
        {
            id: "ironIngot",
            icon: "./assets/icons/materials/ingots/iron_ingot.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 120
                }
            ]
        },
        {
            id: "steelIngot",
            icon: "./assets/icons/materials/ingots/steel_ingot.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 250
                }
            ]
        }
    ],
    type_planks: [
        {
            id: "deadTreePlank",
            icon: "./assets/icons/materials/planks/dead_tree_plank.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 50
                }
            ]
        },
        {
            id: "oakPlank",
            icon: "./assets/icons/materials/planks/oak_plank.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 120
                }
            ]
        },
        {
            id: "maplePlank",
            icon: "./assets/icons/materials/planks/maple_plank.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 250
                }
            ]
        }
    ]
}