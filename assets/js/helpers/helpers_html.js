/**
 * @typedef GenericElementData
 * @prop {string} [tag] Optional tag of the element.
 * @prop {string} [className] Optional className of the element.
 * @prop {string} [innerHTML] Optional innerHTML of the element.
 * @prop {Object.<string, string>} [styles] Optional styles of the element.
 * @prop {Object.<string, string>} [attributes] Optional attributes of the element.
 */

/**
 * Create a new HTML element with the given tag, parent and optional className and innerHTML.
 * @param {?HTMLElement} parent Parent to append the HTML element.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @returns The generic HTML element.
 */
export function createGenericElement(parent = null, elementData = {}) {
    const element = document.createElement(elementData.tag === undefined ? "div" : elementData.tag);
    if (parent !== null) {
        parent.appendChild(element);
    }
    if (elementData.className !== undefined) {
        element.className = elementData.className;
    }
    if (elementData.innerHTML !== undefined) {
        element.innerHTML = elementData.innerHTML;
    }
    if (elementData.styles !== undefined) {
        for (const [style, value] of Object.entries(elementData.styles)) {
            element.style[style] = value;
        }
    }
    if (elementData.attributes !== undefined) {
        for (const [attribute, value] of Object.entries(elementData.attributes)) {
            element.setAttribute(attribute, value);
        }
    }
    return element;
}

/**
 * @typedef GenericButtonData
 * @prop {Function} [onclick] Optional function to assign to the button onclick.
 */

/**
 * Create a new generic button.
 * @param {?HTMLElement} parent Parent to append the generic button.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @param {GenericButtonData} [buttonData] Optional object containing info about the button.
 * @returns The generic button.
 */
export function createGenericButton(parent, elementData = {}, buttonData = {}) {
    elementData.tag = "button";
    const button = createGenericElement(parent, elementData);
    if (buttonData.onclick !== undefined) {
        button.onclick = buttonData.onclick;
    }
    return button;
}

/**
 * @typedef GenericLinkData
 * @prop {Function} [onclick] Optional function to assign to the link onclick.
 */

/**
 * Create a new generic link.
 * @param {?HTMLElement} parent Parent to append the generic link.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @param {GenericLinkData} [linkData] Optional object containing info about the link.
 * @returns The generic link.
 */
export function createGenericLink(parent, elementData = {}, linkData = {}) {
    elementData.tag = "a";
    const link = createGenericElement(parent, elementData);
    if (linkData.onclick !== undefined) {
        link.onclick = linkData.onclick;
    }
    return link;
}

/**
 * @typedef OpenModalButtonData
 * @prop {string} [id] Optional unique id of the modal to open.
 * @prop {Function} [onclick] Optional function to assign to the button onclick.
 */

/**
 * Create a new button that opens the modal with the given id.
 * @param {?HTMLElement} parent Parent to append the button.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @param {OpenModalButtonData} [buttonData] Optional object containing info about the button.
 * @returns The open modal button.
 */
export function createOpenModalButton(parent, elementData = {}, buttonData = {}) {
    const modalButton = createGenericButton(parent, elementData, {onclick: buttonData.onclick});
    if (buttonData.id !== undefined) {
        modalButton.setAttribute("data-bs-toggle", "modal");
        modalButton.setAttribute("data-bs-target", buttonData.id);
    }
    return modalButton;
}

/**
 * @typedef OpenModalLinkData
 * @prop {string} [id] Optional unique id of the modal to open.
 * @prop {Function} [onclick] Optional function to assign to the link onclick.
 */

/**
 * Create a new link that opens the modal with the given id.
 * @param {?HTMLElement} parent Parent to append the link.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @param {OpenModalLinkData} [linkData] Optional object containing info about the button.
 * @returns The open modal link.
 */
export function createOpenModalLink(parent, elementData = {}, linkData = {}) {
    const modalLink = createGenericLink(parent, elementData, {onclick: linkData.onclick});
    if (linkData.id !== undefined) {
        modalLink.setAttribute("data-bs-toggle", "modal");
        modalLink.setAttribute("data-bs-target", linkData.id);
    }
    return modalLink;
}

/**
 * @typedef GenericImageData
 * @prop {boolean} [isFluid] Optional bool to add the img-fluid class to the image. Defaults to true.
 */

/**
 * Create a new generic image.
 * @param {?HTMLElement} parent Parent to append the generic image.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @param {GenericImageData} [imageData] Optional object containing info about the image.
 * @returns The generic image.
 */
export function createGenericImage(parent, elementData = {}, imageData = {}) {
    elementData.tag = "img";
    const image = createGenericElement(parent, elementData);
    if (imageData.isFluid === undefined || imageData.isFluid === true) {
        image.classList.add("img-fluid");
    }
    return image;
}

/**
 * @typedef GenericInputData
 * @prop {boolean} [allowAutoComplete] Optional bool to allow the auto complete function. Defaults to false.
 */

/**
 * Create a new generic input.
 * @param {?HTMLElement} parent Parent to append the generic input.
 * @param {GenericElementData} [elementData] Optional object containing info about the element.
 * @param {GenericInputData} [inputData] Optional object containing info about the input.
 * @returns The generic input.
 */
export function createGenericInput(parent, elementData = {}, inputData = {}) {
    elementData.tag = "input";
    const input = createGenericElement(parent, elementData);
    if (inputData.allowAutoComplete === undefined || inputData.allowAutoComplete === false) {
        input.setAttribute("autoComplete", "off");
    }
    return input;
}

/**
 * Remove all children from a HTMLElement.
 * @param {HTMLElement} element The element to remove children.
 */
export function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Disable or enable the given button replacing the color class to danger or success.
 * @param {HTMLElement} button The button to enable.
 * @param {boolean} [disabled] Defaults to true, set to false to enable.
 */
export function setButtonDisabled(button, disabled = true) {
    button.disabled = disabled;
    if (disabled) {
        button.classList.replace("btn-success", "btn-danger");
        return;
    }
    button.classList.replace("btn-danger", "btn-success");
}