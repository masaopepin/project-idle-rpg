import { Page } from "./page.js";
import { createGenericElement, createGenericButton, removeChildren, createOpenModalButton } from "../helpers/helpers_html.js";
import { Icon_Label, Duration_Label } from "../ui/labels/icon_label.js";
import { Modal_Crafting } from "../ui/modals/modal_crafting.js";
import { Progressbar } from "../ui/progressbar.js";

/**
 * @typedef Gathering_Section
 * @prop {import("../skills/gathering_node.js").Gathering_Node} gatheringNode The gathering node associated with the section.
 * @prop {import("../actions/action.js").Action} action The action associated with the section.
 * @prop {HTMLElement} conditions The HTMLElement containing the conditions string.
 * @prop {Set.<Icon_Label>} rewards The set of icon label containing the rewards.
 * @prop {Duration_Label} durationLabel The duration label for the action.
 * @prop {Progressbar} actionProgress The progressbar for the elapsed time of the action.
 */

/**
 * Base class for all skill pages.
 * @extends {Page}
 */
export class Page_Skill extends Page {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {import("../skills/skill.js").Skill} skill The skill to associate to the page.
     */
    constructor(game, skill) {
        super(game, skill.id);
        /** The skill associated to the page. */
        this.skill = skill;
        this.levelText = null;
        this.xpBar = null;
        this.xpText = null;
        this.gatheringRoot = null;
        /** @type {Gathering_Section[]} */
        this.sections = [];
        /** @type {Set.<Gathering_Section>} */
        this.activeSections = new Set();

        /** @type {Set.<Icon_Label>} */
        this.craftingLabels = new Set();
        this.craftingNav = null;
        this.craftingRoot = null;
        this.modalCrafting = null;

        this.gatheringNodes = null;
        this.craftingRecipes = null;
    }

    enter() {
        super.enter();
        const row = createGenericElement(this.container, {className: "row section bg-dark p-1"});

        this.levelText = new Icon_Label(row, {source: this.skill.icon, tooltip: this.skill.name, updateFunction: () => { return this.skill.level; }});
        this.levelText.root.classList.add("justify-content-center");
        
        const maxXp = this.skill.maxXp;
        this.xpBar = new Progressbar(row, this.game.languages.getString("xp") + " " + this.skill.name);
        this.xpBar.update(this.skill.xp, maxXp, this.skill.xpPercent);
        this.xpText = createGenericElement(row, {className: "text-center", innerHTML: Math.floor(this.skill.xp) + " / " + Math.floor(maxXp)});

        this.createGatheringNodeElements();
        this.createCraftingRecipeElements();

        document.addEventListener("xpAdded", (e) => { this.xpAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("leveledUp", (e) => { this.leveledUp(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemAdded", (e) => { this.itemAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e); }, {signal: this.abortController.signal});
        document.addEventListener("multipliersApplied", (e) => { this.multipliersApplied(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStarted", (e) => { this.actionStarted(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStopped", (e) => { this.actionStopped(e); }, {signal: this.abortController.signal});
    }

    update() {
        // Update the action progress bars
        this.activeSections.forEach((section) => {
            section.actionProgress.update(section.action.elapsedTime, section.action.duration, section.action.elapsedPercent);
        });
    }

    exit() {
        super.exit();
        this.levelText = null;
        this.xpBar = null;
        this.xpText = null;

        this.sections = [];
        this.activeSections.clear();
        this.gatheringRoot = null;

        this.craftingLabels.clear();
        this.craftingNav = null;
        this.craftingRoot = null;
        if (this.modalCrafting !== null) {
            this.modalCrafting.modal.remove();
            this.modalCrafting = null;
        }
    }

    xpAdded(e) {
        /** @type {import("../events/manager_event.js").xpAdded} */
        const eventData = e.eventData;

        if (eventData.skill !== this.skill) {
            return;
        }
        const maxXp = this.skill.maxXp;
        if (this.xpBar !== null) {
            this.xpBar.update(this.skill.xp, maxXp, this.skill.xpPercent);
        }
        if (this.xpText !== null) {
            this.xpText.innerHTML = Math.floor(this.skill.xp) + " / " + Math.floor(maxXp);
        }
    }

    leveledUp(e) {
        if (this.levelText !== null) {
            this.levelText.update();
        }
        for (const section of this.sections) {
            section.conditions.innerHTML = section.gatheringNode.conditions.getConditionsString();
        }
        for (const label of this.craftingLabels) {
            label.update();
        }
    }

    itemAdded(e) {
        if (this.modalCrafting !== null) {
            this.modalCrafting.updateInput(this.modalCrafting.inputs.value);
        }
    }

    itemRemoved(e) {
        if (this.modalCrafting !== null) {
            this.modalCrafting.updateInput(this.modalCrafting.inputs.value);
        }
    }

    multipliersApplied(e) {
        this.sections.forEach((section) => {
            section.rewards.forEach((reward) => { reward.update(); });
            section.durationLabel.update();
        });
    }

    actionStarted(e) {
        /** @type {import("../events/manager_event.js").actionStarted} */
        const eventData = e.eventData;
        if (eventData.action.gatheringNode === undefined) {
            return;
        }
        for (const section of this.sections) {
            if (eventData.action.gatheringNode.id === section.gatheringNode.id) {
                section.action = eventData.action;
                this.activeSections.add(section);
                return;
            }
        }
    }

    actionStopped(e) {
        /** @type {import("../events/manager_event.js").actionStopped} */
        const eventData = e.eventData;
        if (eventData.action.oldGatheringNode === undefined) {
            return;
        }
        for (const activeSection of this.activeSections) {
            if (eventData.action.oldGatheringNode.id === activeSection.gatheringNode.id) {
                this.activeSections.delete(activeSection);
                activeSection.actionProgress.update(0, 0, "0%");
                return;
            }
        }
    }

    createGatheringNodeElements() {
        if (this.skill.gatheringNodesData === null) {
            return;
        }
        this.gatheringRoot = createGenericElement(this.container, {className: "row g-2 pb-2 px-1"});
        this.skill.gatheringNodesData.forEach((gatheringNodeData) => {
            this.createGatheringNodeElement(this.gatheringRoot, gatheringNodeData);
        });
    }

    /**
     * Create an element to display a gathering node.
     * @param {HTMLElement} parent The parent to append the element.
     * @param {import("../skills/gathering_node.js").GatheringNodeData} gatheringNodeData The gatheting node data to create the element.
     */
    createGatheringNodeElement(parent, gatheringNodeData) {
        const gatheringNode = this.skill.createGatheringNode(gatheringNodeData);
        const action = this.game.actions.getAction(gatheringNode.actionId);
        const actionName = this.game.languages.getString(gatheringNode.actionId);
        const nodeName = this.game.languages.getString(gatheringNode.id);
        const root = createGenericElement(parent, {className: "col-12 col-sm-6 col-md-4"});
        const border = createGenericElement(root, {className: "d-flex flex-column section bg-dark border-3 w-100 h-100 p-0 m-0 shadow-lg"});

        const button = createGenericButton(border, {className: "btn btn-primary rounded-top rounded-bottom-0 w-100"}, {onclick: () => { this.skill.startGathering(gatheringNode); }});
        createGenericElement(button, {innerHTML: actionName});
        createGenericElement(button, {innerHTML: nodeName});
        
        const conditionsDiv = createGenericElement(border, {className: "d-flex bg-dark w-100 p-1"});
        const conditions = createGenericElement(conditionsDiv, {className: "mx-auto", innerHTML: gatheringNode.conditions.getConditionsString()});
        const rewardsRoot = createGenericElement(border, {className: "bg-dark w-100 p-1 mt-auto mb-0"});
        const rewards = gatheringNode.rewards.createRewardsLabel(rewardsRoot);

        /** @type {Gathering_Section} */
        const section = {
            gatheringNode: gatheringNode,
            action: action,
            conditions: conditions,
            rewards: rewards
        }

        section.durationLabel = new Duration_Label(this.game, rewardsRoot, {baseDuration: gatheringNode.baseDuration, skill: this.skill});
        section.actionProgress = new Progressbar(border, actionName + " " + nodeName);
        section.actionProgress.root.classList.add("px-2");
        this.sections.push(section);
        if (action.gatheringNode !== undefined && action.gatheringNode.id === gatheringNode.id) {
            this.activeSections.add(section);
        }
    }

    /**
     * Create all the crafting recipe buttons.
     * @param {HTMLElement} parent The parent to append the recipe element.
     * @param {string} recipeType The type of the recipe.
     */
    createCraftingRecipeElements() {
        if (this.skill.craftingRecipesData === null) {
            return;
        }
        for (const recipeType in this.skill.craftingRecipesData) {
            if (this.craftingNav === null) {
                this.craftingNav = createGenericElement(this.container, {className: "section"});
                this.craftingRoot = createGenericElement(this.container, {className: "row section g-1 p-2"});
                this.modalCrafting = new Modal_Crafting(this.game, this.game.pages.modalRoot, this.skill);
                this.switchCraftingPage(recipeType);
            }
            createGenericButton(this.craftingNav, {className: "btn btn-dark", innerHTML: this.game.languages.getString(recipeType)}, {onclick: () => { this.switchCraftingPage(recipeType); }});
        }
    }

    /**
     * Create all the crafting recipe buttons for the given recipe type.
     * @param {string} recipeType The type of the recipe.
     */
    switchCraftingPage(recipeType) {
        if (this.craftingRoot === null) {
            return;
        }
        this.craftingLabels.clear();
        removeChildren(this.craftingRoot);
        for (const recipeData of this.skill.craftingRecipesData[recipeType]) {
            this.createCraftingRecipeElement(this.craftingRoot, this.skill.createCraftingRecipe(recipeData));
        }
    }

    /**
     * Create an element to display a crafting recipe.
     * @param {HTMLElement} parent The parent to append the element.
     * @param {import("../skills/crafting_recipe.js").Crafting_Recipe} craftingRecipe The crafting recipe to create the element.
     */
    createCraftingRecipeElement(parent, craftingRecipe) {
        const root = createGenericElement(parent, {className: "col-12 col-md-6"});
        const modalButton = createOpenModalButton(root, {className: "btn btn-dark w-100"}, {id: "#modal-crafting", onclick:  () => { this.modalCrafting.update(this.game, craftingRecipe); }})

        this.craftingLabels.add(new Icon_Label(modalButton, {
            source: craftingRecipe.item.icon, 
            updateFunction: () => {
                const conditionsString = craftingRecipe.conditions.getConditionsString();
                if (conditionsString === "") {
                    modalButton.disabled = false;
                    return craftingRecipe.item.name;
                }
                modalButton.disabled = true;
                return conditionsString;
            }
        }));
    }
}