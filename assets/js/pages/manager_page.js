import { Page } from "./page.js";
import { Page_Inventory } from "./page_inventory.js";
import { Page_Shop } from "./page_shop.js";
import { Page_Settings } from "./page_settings.js";
import { Page_Summary } from "./page_summary.js";
import { Page_Skill } from "./page_skill.js";

import { createGenericElement } from "../helpers/helpers_html.js";
import { Nav_Button } from "../ui/buttons/nav_button.js";
import { Icon_Label } from "../ui/labels/icon_label.js";
import { Toast_Reward } from "../ui/toasts/toast_reward.js";
import { Modal_Confirm } from "../ui/modals/modal_confirm.js";

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

        // Bottom toast
        /** @type {Set.<Toast_Reward>} */
        //this.activeRewardToasts = new Set();
        /** @type {Set.<Toast_Reward>} */
        /**this.inactiveRewardToasts = new Set();
        this.bottomToastContainer = document.getElementById("bottom-toast-container");
        this.maxToast = 6;
        this.maxToastDelay = 5000;
        for (let i = 0; i < this.maxToast; i++) {
            this.inactiveRewardToasts.add(new Toast_Reward(this.bottomToastContainer, this.maxToastDelay));
        }*/

        // Create the money label
        const money = document.getElementById("money");
        const moneyItem = this.game.items.getItem("money");
        if (money !== null) {
            this.moneyLabel = new Icon_Label(money, {source: moneyItem.icon, updateFunction: () => { return moneyItem.amount; }});
        }

        // Create the sidebar character buttons
        this.characterToggle = document.getElementById("character-toggle");
        const characterPages = document.getElementById("character-pages");
        this.navButtons.add(new Nav_Button(characterPages, "./assets/icons/misc/stats.png", "summary", () => { this.switchPage("summary"); }));
        this.navButtons.add(new Nav_Button(characterPages, "./assets/icons/misc/inventory.png", "inventory", () => { this.switchPage("inventory"); }));
        this.navButtons.add(new Nav_Button(characterPages, moneyItem.icon, "shop", () => { this.switchPage("shop"); }));

        // Create the sidebar skill buttons
        this.skillToggle = document.getElementById("skill-toggle");
        const skillPages = document.getElementById("skill-pages");
        game.skills.getSkills().forEach((skill) => {
            this.navButtons.add(new Nav_Button(skillPages, skill.icon, skill.id, () => { this.switchPage(skill.id); }));
        });

        // Create the sidebar more buttons
        this.moreToggle = document.getElementById("more-toggle");
        const morePages = document.getElementById("more-pages");
        this.navButtons.add(new Nav_Button(morePages, "./assets/icons/misc/settings.png", "settings", () => { this.switchPage("settings"); }));
        this.navButtons.add(new Nav_Button(morePages, "", "toggleFullscreen", () => { this.toggleFullscreen(); }));

        if (this.game.languages.isLanguageLoaded === true) {
            this.languageLoaded();
        }
        document.addEventListener("languageLoaded", (e) => { this.languageLoaded(e); });
        document.addEventListener("itemAdded", (e) => { this.itemAdded(e) });
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e) });
        document.addEventListener("xpAdded", (e) => { this.xpAdded(e) });
    }

    languageLoaded(e) {
        this.characterToggle.innerHTML = this.game.languages.getString("character");
        this.skillToggle.innerHTML = this.game.languages.getString("skills");
        this.moreToggle.innerHTML = this.game.languages.getString("more");

        /*const xpString = this.game.languages.getString("xp");
        for (const toast of this.activeRewardToasts) {
            toast.xpString = xpString;
        }
        for (const toast of this.inactiveRewardToasts) {
            toast.xpString = xpString;
        }*/

        for (const button of this.navButtons) {
            button.iconLabel.label.innerHTML = this.game.languages.getString(button.stringId);
        }

        Object.values(this.db).forEach((page) => {
            page.pageTitle = this.game.languages.getString(page.pageTitleId);
        });

        if (this.currentPage === null) {
            this.goToPage(this.db.summary);
        }
        else {
            this.updatePageTitle();
        }
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
        //this.createItemToast(eventData.slot.item, eventData.amount * -1);
    }

    xpAdded(e) {
        /** @type {import("../events/manager_event.js").xpAdded} */
        const eventData = e.eventData;
        //this.createSkillToast(eventData.skill, eventData.amount);
    }

    /**
     * Called every game tick. Update the current active page.
     * @param {number} deltaTime Milliseconds since last update.
     */
    update(deltaTime) {
        /*for (const activeToast of this.activeRewardToasts) {
            activeToast.timer += deltaTime;
            if (activeToast.timer >= activeToast.maxDelay) {
                activeToast.hide();
                this.activeRewardToasts.delete(activeToast);
                this.inactiveRewardToasts.add(activeToast);
            }
        }*/

        if (this.currentPage !== null) {
            this.currentPage.update();
        }
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

        const elem = document.documentElement;
        // Enter
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
        else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        else if (elem.mozRequestFullscreen) {
            elem.mozRequestFullscreen();
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
     * Create a toast at the bottom of the screen to show added and removed items.
     * @param {import("../items/item.js").Item} item The item to create a toast.
     * @param {number} amount The number of item added or removed.
     */
    createItemToast(item, amount) {
        for (const activeToast of this.activeRewardToasts) {
            if (activeToast.item === item) {
                activeToast.update(item, null, amount);
                return;
            }
        }
        for (const inactiveToast of this.inactiveRewardToasts) {
            inactiveToast.update(item, null, amount);
            this.inactiveRewardToasts.delete(inactiveToast);
            this.activeRewardToasts.add(inactiveToast);
            return;
        }
        for (const activeToast of this.activeRewardToasts) {
            activeToast.update(item, null, amount);
            this.activeRewardToasts.delete(activeToast);
            this.activeRewardToasts.add(activeToast);
            return;
        }
    }

    /**
     * Create a toast at the bottom of the screen to show added xp for skills.
     * @param {import("../skills/skill.js").Skill} skill The skill to create a toast.
     * @param {number} amount The number of xp added.
     */
    createSkillToast(skill, amount) {
        for (const activeToast of this.activeRewardToasts) {
            if (activeToast.skill === skill) {
                activeToast.update(null, skill, amount);
                return;
            }
        }
        for (const inactiveToast of this.inactiveRewardToasts) {
            inactiveToast.update(null, skill, amount);
            this.inactiveRewardToasts.delete(inactiveToast);
            this.activeRewardToasts.add(inactiveToast);
            return;
        }
        for (const activeToast of this.activeRewardToasts) {
            activeToast.update(null, skill, amount);
            this.activeRewardToasts.delete(activeToast);
            this.activeRewardToasts.add(activeToast);
            return;
        }
    }
}