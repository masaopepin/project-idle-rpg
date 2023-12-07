import { createGenericElement, createGenericImage, createGenericButton, createOpenModalLink } from "../helpers/helpers_html.js";

/** Base class for icons used to display an item with an open modal link. */
export class Item_Icon {
    /**
     * @param {?HTMLElement} parent The parent to append the HTMLElement.
     * @param {string} modalId The unique id of the modal to open when clicking the icon.
     * @param {Function} onclick The function to call when clicking the icon.
     */
    constructor(parent, modalId, onclick) {
        /** The root element of the icon */
        this.root = createGenericElement(parent, {className: "col-auto my-2"});
        /** The section element of the icon. */
        this.section = createGenericButton(this.root, {className: "section item-icon m-0 p-1 bg-body position-relative", attributes: {"data-bs-html": "true", "data-bs-title": "placeholder"}});
        /** The tooltip to be displayed on hover. */
        this.tooltip = bootstrap.Tooltip.getOrCreateInstance(this.section, {"trigger": "hover", "customClass": "tooltip-hover-none"});
        /** The open modal link that opens the modal associated with the icon. */
        this.modalLink = createOpenModalLink(this.section, {}, {id: modalId, onclick: onclick});
        /** The icon element. */
        this.icon = createGenericImage(this.modalLink);
    }

    /** Update the icon with the current item in the slot and the tooltip content. */
    update() {}

    /** Set the string that will be displayed by the item tooltip. */
    setTooltipContent() {}
}

/**
 * Create an inventory icon of size 80px with a label on the bottom.
 * @extends {Item_Icon}
 */
export class Inventory_Icon extends Item_Icon {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {?HTMLElement} parent The parent to append the HTMLElement.
     * @param {import("./modals/modal_inventory.js").Modal_Inventory} modal The modal to open when clicking on the icon.
     * @param {import("../items/manager_inventory.js").InventorySlot} slot The inventory slot to associate with the icon.
     */
    constructor(game, parent, modal, slot) {
        super(parent, "#modal-inventory", () => { modal.update(slot); });
        /** The inventory slot associated with the icon. */
        this.slot = slot;
        this.icon.setAttribute("src", this.slot.item.icon);
        /** The label element on the bottom */
        this.label = createGenericElement(this.modalLink, {className: "section text-center m-0 px-1 position-absolute top-100 start-50 translate-middle", styles: {"fontSize": "14px"}});

        this.setTooltipContent();
        this.update();
    }

    update() {
        this.label.innerHTML = this.slot.save.amount;
    }

    setTooltipContent() {
        this.tooltip.setContent({".tooltip-inner": "<b>" + this.slot.item.name + "</b><br>" + this.slot.item.description});
    }

    filter(category, type, name, allString) {
        const item = this.slot.item;
        if ((category === allString || category === item.category) && (type === allString || type === item.type) && item.name.toLowerCase().includes(name.toLowerCase())) {
            this.root.classList.remove("d-none");
        }
        else {
            this.root.classList.add("d-none");
        }
    }
}

/**
 * Create an equipment icon of size 80px.
 * @extends {Item_Icon}
 */
export class Equipment_Icon extends Item_Icon {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {?HTMLElement} parent Parent to append the HTMLElement.
     * @param {import("./modals/modal_equipment.js").Modal_Equipment} modal The modal to open when clicking on the icon.
     * @param {import("../items/manager_equipment.js").EquipmentSlot} slot The equipment slot to associate with the icon.
     */
    constructor(game, parent, modal, slot) {
        super(parent, "#modal-equipment", () => { modal.update(slot); });
        /** The equipment slot associated with the icon. */
        this.slot = slot;
        /** The name of the equipment slot in the current language. */
        this.slotName = game.languages.getString(slot.id);
        this.update();
    }

    update() {
        this.icon.setAttribute("src", this.slot.item === null ? "" : this.slot.item.icon);
        this.setTooltipContent();
    }

    setTooltipContent() {
        this.tooltip.setContent({".tooltip-inner": this.slot.item === null ? this.slotName : "<b>" + this.slot.item.name + "</b><br>" + this.slot.item.description });
    }
}

