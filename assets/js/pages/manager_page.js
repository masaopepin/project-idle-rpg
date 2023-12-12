import { Page } from "./page.js";
import { Page_Inventory } from "./page_inventory.js";
import { Page_Shop } from "./page_shop.js";
import { Page_Settings } from "./page_settings.js";
import { Page_Summary } from "./page_summary.js";
import { Page_Skill } from "./page_skill.js";

import { createGenericElement } from "../helpers/helpers_html.js";
import { Nav_Button } from "../ui/buttons/nav_button.js";
import { Icon_Label } from "../ui/labels/icon_label.js";
import { Modal_Confirm } from "../ui/modals/modal_confirm.js";
import { Toast_Success } from "../ui/toasts/toast_success.js";
import { Toast_Failure } from "../ui/toasts/toast_failure.js";

/** Manager class for all "pages" in the game. Handles switching and updating pages. */
export class Manager_Page {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        /** The game instance. */
        this.game = game;
        /** The HTMLElement for the title in the top bar. */
        this.pageTitle = document.getElementById("page-title");
        
        const gameRoot = document.getElementById("game-root");
        /** The root element of the game window. */
        this.gameRoot = gameRoot === null ? createGenericElement(document.body) : gameRoot;
        const modalRoot = document.getElementById("modal-root");
        /** The root element for all modals. */
        this.modalRoot = modalRoot === null ? createGenericElement(document.body) : modalRoot;
        this.modalConfirm = new Modal_Confirm(this.modalRoot);
        
        /** 
         * Database containing all pages.
         * @type {Object.<string, Page>}
         */
        this.db = {
            summary: new Page_Summary(game),
            inventory: new Page_Inventory(game),
            shop: new Page_Shop(game),
            settings: new Page_Settings(game)
        }
        game.skills.getSkills().forEach((skill) => { this.db[skill.id] = new Page_Skill(game, skill); });

        /** The page currently displayed in the game root window. */
        this.currentPage = null;

        /** @type {Set.<Nav_Button>} */
        this.navButtons = new Set();

        const middleToastContainer = document.getElementById("middle-toast-container");
        this.middleToastContainer = middleToastContainer === null ? createGenericElement(this.gameRoot) : middleToastContainer;

        // Create the money label
        const money = document.getElementById("money");
        const moneyItem = this.game.items.getItem("money");
        this.moneyLabel = money === null ? new Icon_Label(document.body) : new Icon_Label(money, {source: moneyItem.icon, updateFunction: () => { return moneyItem.amount; }});

        // Create the sidebar character buttons
        this.characterToggle = document.getElementById("character-toggle");
        const characterPages = document.getElementById("character-pages");
        this.navButtons.add(new Nav_Button(this.game, characterPages, "summary", {source: "./assets/icons/misc/stats.png"}));
        this.navButtons.add(new Nav_Button(this.game, characterPages, "inventory", {source: "./assets/icons/misc/inventory.png"}));
        this.navButtons.add(new Nav_Button(this.game, characterPages, "shop", {source: moneyItem.icon}));

        // Create the sidebar skill buttons
        this.skillToggle = document.getElementById("skill-toggle");
        const skillPages = document.getElementById("skill-pages");
        game.skills.getSkills().forEach((skill) => { this.navButtons.add(new Nav_Button(this.game, skillPages, skill.id, {source: skill.icon})); });

        // Create the sidebar more buttons
        this.moreToggle = document.getElementById("more-toggle");
        const morePages = document.getElementById("more-pages");
        this.navButtons.add(new Nav_Button(this.game, morePages, "settings", {source: "./assets/icons/misc/settings.png"}));
        this.navButtons.add(new Nav_Button(this.game, morePages, "help", {iconClass: "bi bi-question-circle", href: "https://github.com/masaopepin/project-idle-rpg/"}));
        this.navButtons.add(new Nav_Button(this.game, morePages, "toggleFullscreen", {iconClass: "bi bi-arrows-fullscreen", onclick: () => { this.toggleFullscreen(); }}));

        if (this.game.languages.isLanguageLoaded === true) {
            this.languageLoaded();
        }
        document.addEventListener("languageLoaded", (e) => { this.languageLoaded(e); });
        document.addEventListener("itemAdded", (e) => { this.itemAdded(e) });
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e) });
    }

    languageLoaded(e) {
        this.characterToggle.innerHTML = this.game.languages.getString("character");
        this.skillToggle.innerHTML = this.game.languages.getString("skills");
        this.moreToggle.innerHTML = this.game.languages.getString("more");

        this.navButtons.forEach((button) => { button.update(this.game); });
        Object.values(this.db).forEach((page) => { page.pageTitle = this.game.languages.getString(page.pageTitleId); });

        if (this.currentPage === null) {
            this.goToPage(this.db.summary);
            return;
        }
        this.updatePageTitle();
    }

    itemAdded(e) {
        /** @type {import("../events/manager_event.js").itemAdded} */
        const eventData = e.eventData;

        if (eventData.slot.item.id === "money") {
            if (this.moneyLabel !== undefined) {
                this.moneyLabel.update();
            }
        }
        //this.createItemToast(eventData.slot.item, eventData.amount);
    }

    itemRemoved(e) {
        /** @type {import("../events/manager_event.js").itemRemoved} */
        const eventData = e.eventData;

        if (eventData.slot.item.id === "money") {
            if (this.moneyLabel !== undefined) {
                this.moneyLabel.update();
            }
        }
    }

    /**
     * Called every game tick. Update the current active page.
     * @param {number} deltaTime Milliseconds since last update.
     */
    update(deltaTime) {
        if (this.currentPage !== null) {
            this.currentPage.update();
        }
    }

    /**
     * Exit the current active page and enter the new one.
     * @param {string} nextPage Name of the page to switch to.
     */
    switchPage(nextPage) {
        const page = this.db[nextPage];
        if (page === undefined || page === this.currentPage) {
            return;
        }
        if (this.currentPage !== null) {
            this.currentPage.exit();
        }
        this.goToPage(page);
    }

    /**
     * Enter a new page.
     * @param {Page} page Page instance to enter.
     */
    goToPage(page) {
        this.currentPage = page;
        this.updatePageTitle();
        page.enter();
    }

    /** Update the page title in the top bar. */
    updatePageTitle() {
        if (this.pageTitle !== null && this.currentPage !== null) {
            this.pageTitle.innerHTML = this.currentPage.pageTitle;
        }
    }

    /**
     * Create a new success toast in the middle of the screen.
     * @param {string} message The success string to display
     */
    createSuccessToast(message = "") {
        new Toast_Success(this.middleToastContainer, message).show();
    }

    /**
     * Create a new failure toast in the middle of the screen.
     * @param {string} message The failure string to display
     */
    createFailureToast(message = "") {
        new Toast_Failure(this.middleToastContainer, message).show();
    }

    /** Enter or exit fullscreen mode if possible. */
    toggleFullscreen() {
        // Exit
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }
        else if (document.webkitFullscreenElement) {
            document.webkitExitFullscreen();
            return;
        }
        else if (document.msFullscreenElement) {
            document.msExitFullscreen();
            return;
        }
        else if (document.mozFullscreenElement) {
            document.mozExitFullscreen();
            return;
        }

        const element = document.documentElement;
        // Enter
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        else if (element.mozRequestFullscreen) {
            element.mozRequestFullscreen();
        }
    }
}