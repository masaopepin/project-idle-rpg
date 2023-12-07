import { Page } from "./page.js";
import { createGenericElement, createGenericButton, removeChildren } from "../helpers/helpers_html.js";
import { Modal_Shop } from "../ui/modals/modal_shop.js";

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
        this.shopModal = null;
    }

    enter() {
        super.enter();

        this.shopModal = new Modal_Shop(this.game, this.game.pages.modalRoot);

        // Nav tabs
        const shopNav = createGenericElement(this.container, {className: "section bg-body rounded-0"});
        for (const shop of this.game.shops.shops) {
            createGenericButton(shopNav, {className: "col-12 col-sm-auto btn btn-body rounded-0", innerHTML: this.game.languages.getString(shop.id)}, {onclick: () => { this.enterShop(shop.id); }});
        }

        // Shop items
        this.shopRoot = createGenericElement(this.container, {className: "row g-3"});
        this.enterShop("type_fishingTools");

        document.addEventListener("itemAdded", (e) => { this.itemAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e); }, {signal: this.abortController.signal});
    }

    exit() {
        super.exit();
        this.shopRoot = null;
        if (this.shopModal !== null) {
            this.shopModal.modal.remove();
            this.shopModal = null;
        }
    }

    itemAdded(e) {
        this.updateModalInputs();
    }

    itemRemoved(e) {
        this.updateModalInputs();
    }

    /** Update the shop modal inputs. */
    updateModalInputs() {
        if (this.shopModal !== null) {
            this.shopModal.updateInputs(this.shopModal.inputs.value);
        }
    }

    /**
     * Enter a shop from it's unique id, exiting the current shop if any.
     * @param {string} id The unique id of the shop.
     */
    enterShop(id) {
        const shop = this.game.shops.getShop(id);
        if (shop === null || this.shopRoot === null || this.shopModal === null) {
            return;
        }

        this.exitShop();
        for (const shopItem of shop.items) {
            shopItem.restock();
            shopItem.createSection(this.game, this.shopRoot, this.shopModal);
        }
    }

    /** Exit the current shop. */
    exitShop() {
        if (this.shopRoot !== null) {
            removeChildren(this.shopRoot);
        }
    }
}