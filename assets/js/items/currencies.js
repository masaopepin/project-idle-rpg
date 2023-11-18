/**
 * Object containing all ItemData in the currencies category structured as {itemType: ItemData[]}.
 * @type {Object.<string, import("./item.js").ItemData[]>}
 */
export const CURRENCIES = {
    type_shops: [
        {
            id: "money",
            icon: "./assets/icons/currencies/money.png",
            maxStack: Infinity
        }
    ]
};