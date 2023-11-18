/**
 * Object containing all ItemData in the foods category structured as {itemType: ItemData[]}.
 * @type {Object.<string, import("./item.js").ItemData[]>}
 */
export const FOODS = {
    type_fishes: [
        {
            id: "sardine",
            icon: "./assets/icons/foods/fishes/sardine.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 50
                }
            ]
        },
        {
            id: "trout",
            icon: "./assets/icons/foods/fishes/trout.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 120
                }
            ]
        },
        {
            id: "salmon",
            icon: "./assets/icons/foods/fishes/salmon.png",
            sellData: [
                {
                    type: "item",
                    itemId: "money",
                    amount: 250
                }
            ]
        }
    ],
}