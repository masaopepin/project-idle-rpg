import { Page } from "./page.js";
import { createGenericElement, createGenericButton, removeChildren, createOpenModalButton, setButtonDisabled, createGenericImage } from "../helpers/helpers_html.js";
import { Icon_Label } from "../ui/labels/icon_label.js";
import { Conditions } from "../misc/condition.js";
import { Modal_Shop } from "../ui/modals/modal_shop.js";
import { Costs } from "../misc/cost.js";

/**
 * Page for the shop.
 * @extends {Page}
 */
export class Page_Shop extends Page {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        super(game, "shop");
        /**
         * The currently open shop root element.
         * @type {?HTMLElement}
         */
        this.shopRoot = null;
        /** The buy button string in the current language. */
        this.buyString = "";
        /** @type {Set.<Icon_Label>} */
        this.buyButtons = new Set();
        this.shopModal = null;
    }

    enter() {
        super.enter();

        this.buyString = this.game.languages.getString("buy");
        this.shopModal = new Modal_Shop(this.game, this.game.pages.modalRoot, this.buyString);
        const shopNav = createGenericElement(this.container, {className: "section bg-dark p-1"});
        for (const shop of this.game.shops.shops) {
            createGenericButton(shopNav, {className: "col-12 col-sm-auto btn btn-dark", innerHTML: this.game.languages.getString(shop.id)}, {onclick: () => { this.enterShop(shop.id); }});
        }

        this.shopRoot = createGenericElement(this.container, {className: "row section"});
        this.enterShop("type_fishingTools");

        document.addEventListener("leveledUp", (e) => { this.leveledUp(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemAdded", (e) => { this.itemAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e); }, {signal: this.abortController.signal});
    }

    exit() {
        super.exit();
        this.shopRoot = null;
        this.buyButtons.clear();
        if (this.shopModal !== null) {
            this.shopModal.modal.remove();
            this.shopModal = null;
        }
    }
    
    leveledUp(e) {

    }

    itemAdded(e) {
        if (this.shopModal === null) {
            return;
        }
        this.shopModal.updateInputValue(this.shopModal.inputs.value);
    }

    itemRemoved(e) {
        if (this.shopModal === null) {
            return;
        }
        this.shopModal.updateInputValue(this.shopModal.inputs.value);
    }

    /**
     * Enter a shop by it's unique id.
     * @param {string} id The unique id of the shop.
     */
    enterShop(id) {
        const shop = this.game.shops.getShop(id);
        if (shop === null) {
            return;
        }

        this.exitShop();
        for (const shopItem of shop.items) {
            this.createShopItem(shopItem);
        }
    }

    /** Exit the current shop. */
    exitShop() {
        if (this.shopRoot === null) {
            return;
        }

        this.buyButtons.clear();
        removeChildren(this.shopRoot);
    }

    /**
     * Create a shop element for the given shop item.
     * @param {import("../shops/shop.js").ShopItem} shopItem The shop item to create the element.
     */
    createShopItem(shopItem) {
        const item = shopItem.item;
        const itemRoot = createGenericElement(this.shopRoot, {className: "col-12 col-md-6 p-2"});
        const itemBg = createGenericElement(itemRoot, {className: "d-flex flex-column bg-dark rounded p-2 h-100"});

        const itemDiv = createGenericElement(itemBg, {className: "d-flex flex-column flex-lg-row h-100"});
        const itemIcon = createGenericImage(itemDiv, {className: "item-icon m-auto", attributes: {"src": item.icon}});
        const itemInfoDiv = createGenericElement(itemDiv, {className: "d-flex flex-column col ms-2"});
        createGenericElement(itemInfoDiv, {tag: "h5", className: "m-0", innerHTML: item.name});

        const conditions = new Conditions(this.game, item.conditionsData);
        const conditionsString = conditions.getConditionsString();
        createGenericElement(itemInfoDiv, {innerHTML: item.description});
        createGenericElement(itemInfoDiv, {innerHTML: conditionsString});

        const costs = new Costs(this.game, item.buyData);
        const costsRoot = createGenericElement(itemInfoDiv, {className: "d-lg-flex"});
        costs.createCostsLabel(costsRoot);

        const buyButton = createOpenModalButton(itemBg, {className: "btn btn-success mt-1", innerHTML: this.buyString}, {id: "#modal-shop", onclick: (e) => { this.shopModal.update(shopItem, costs); }});

        setButtonDisabled(buyButton, conditionsString !== "");
        this.buyButtons.add(buyButton);
    }
}