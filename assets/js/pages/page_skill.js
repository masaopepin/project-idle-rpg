import { Page } from "./page.js";
import { createGenericElement, createGenericButton, removeChildren } from "../helpers/helpers_html.js";
import { Modal_Crafting } from "../ui/modals/modal_crafting.js";
import { Progressbar } from "../ui/progressbar.js";

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
        /** @type {import("../skills/gathering_node.js").GatheringSection[]} */
        this.sections = [];
        /** @type {Set.<import("../skills/gathering_node.js").GatheringSection>} */
        this.activeSections = new Set();

        /** @type {Set.<import("../ui/labels/icon_label.js").Icon_Label>} */
        this.craftingLabels = new Set();
        this.craftingNav = null;
        this.craftingRoot = null;
        this.modalCrafting = null;

        this.gatheringNodes = null;
        this.craftingRecipes = null;
    }

    enter() {
        super.enter();
        const row = createGenericElement(this.container, {className: "row section p-1"});

        this.levelText = createGenericElement(row, {className: "text-center"});
        this.xpBar = new Progressbar(row, this.game.languages.getString("xp") + " " + this.skill.name, "bg-warning");
        this.xpText = createGenericElement(row, {className: "text-center"});
        this.updateLevelText();
        this.updateXpBar();
        this.updateXpText();

        this.createGatheringNodeElements();
        this.createCraftingRecipeElements();

        document.addEventListener("xpAdded", (e) => { this.xpAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("leveledUp", (e) => { this.leveledUp(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemAdded", (e) => { this.itemAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e); }, {signal: this.abortController.signal});
        document.addEventListener("multipliersApplied", (e) => { this.multipliersApplied(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStarted", (e) => { this.actionStarted(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionEnded", (e) => { this.actionEnded(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStopped", (e) => { this.actionStopped(e); }, {signal: this.abortController.signal});
    }

    update() {
        // Update the action progress bars
        this.activeSections.forEach((section) => {
            section.actionProgress.update(section.action.elapsedTime, section.action.duration, section.action.elapsedPercent);
        });
        if (this.modalCrafting !== null) {
            this.modalCrafting.actionRow.updateProgress();
        }
    }

    exit() {
        super.exit();
        this.levelText = null;
        this.xpBar = null;
        this.xpText = null;

        this.gatheringRoot = null;
        this.sections = [];
        this.activeSections.clear();

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

        this.updateXpBar();
        this.updateXpText();
    }

    leveledUp(e) {
        /** @type {import("../events/manager_event.js").leveledUp} */
        const eventData = e.eventData;
        if (eventData.skill !== this.skill) {
            return;
        }

        this.updateLevelText();
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
        const node = eventData.action.gatheringNode;
        if (node === undefined) {
            return;
        }

        for (const section of this.sections) {
            if (node.id === section.gatheringNode.id) {
                section.action = eventData.action;
                this.activeSections.add(section);
                return;
            }
        }
    }

    actionEnded(e) {
        /** @type {import("../events/manager_event.js").actionEnded} */
        const eventData = e.eventData;
        if (this.modalCrafting !== null && eventData.action === this.modalCrafting.actionRow.action) {
            this.modalCrafting.actionRow.update();
        }
    }

    actionStopped(e) {
        /** @type {import("../events/manager_event.js").actionStopped} */
        const eventData = e.eventData;
        if (this.modalCrafting !== null && eventData.action === this.modalCrafting.actionRow.action) {
            this.modalCrafting.hideActionRow();
            return;
        }

        if (eventData.action.type === "gathering") {
            for (const activeSection of this.activeSections) {
                if (eventData.action === activeSection.action) {
                    this.activeSections.delete(activeSection);
                    activeSection.actionProgress.update(0, 0, "0%");
                    return;
                }
            }
        }
    }

    /** Update the level text with the current level string. */
    updateLevelText() {
        if (this.levelText !== null) {
            this.levelText.innerHTML = this.skill.levelString;
        }
    }

    /** Update the xp bar with the current xp values. */
    updateXpBar() {
        if (this.xpBar !== null) {
            if (this.skill.isMaxLevel) {
                this.xpBar.update(1, 1, "100%");
            }
            else {
                this.xpBar.update(this.skill.xp, this.skill.maxXp, this.skill.xpPercent);
            }
        }
    }

    /** Update the xp text with the current xp string. */
    updateXpText() {
        if (this.xpText !== null) {
            this.xpText.innerHTML = this.skill.xpString;
        }
    }

    /** Create all the gathering node elements for the skill. */
    createGatheringNodeElements() {
        if (this.skill.gatheringNodesData === null) {
            return;
        }
        this.gatheringRoot = createGenericElement(this.container, {className: "row g-3"});
        for (const nodeData of this.skill.gatheringNodesData) {
            const section = this.skill.createGatheringNode(nodeData).createSection(this.game, this.gatheringRoot);
            this.sections.push(section);
            if (section.action !== null) {
                this.activeSections.add(section);
            }
        }
    }

    /** Create all the crafting recipe elements for the skill. */
    createCraftingRecipeElements() {
        if (this.skill.craftingRecipesData === null) {
            return;
        }
        const recipesType = Object.keys(this.skill.craftingRecipesData);
        if (recipesType.length === 0) {
            return;
        }
        const section = this.createSectionTitle(this.container);
        this.craftingNav = this.createSectionTopRow(section);
        this.craftingRoot = createGenericElement(section, {className: "row g-1 p-2"});
        this.modalCrafting = new Modal_Crafting(this.game, this.game.pages.modalRoot, this.skill);
        this.switchCraftingPage(recipesType[0]);

        recipesType.forEach((recipeType) => {
            createGenericButton(this.craftingNav, {className: "col-auto btn btn-body rounded-0", innerHTML: this.game.languages.getString(recipeType)}, {onclick: () => { this.switchCraftingPage(recipeType); }});
        });
    }

    /**
     * Create all the crafting recipe buttons for the given recipe type.
     * @param {string} recipeType The type of the recipe.
     */
    switchCraftingPage(recipeType) {
        const recipesData = this.skill.craftingRecipesData[recipeType];
        if (this.craftingRoot === null || recipesData === undefined) {
            return;
        }

        this.craftingLabels.clear();
        removeChildren(this.craftingRoot);
        recipesData.forEach((recipeData) => { this.craftingLabels.add(this.skill.createCraftingRecipe(recipeData).createButton(this.craftingRoot, this.modalCrafting)); });
    }
}