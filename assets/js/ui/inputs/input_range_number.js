import { createGenericElement, createGenericInput } from "../../helpers/helpers_html.js";

/** Create an input range and an input number that share the same value. */
export class Input_Range_Number {
    /**
     * @param {HTMLElement} parent The parent to append the inputs.
     * @param {string} [name] The name attribute of the inputs.
     * @param {number} [minValue] The minimum value of the inputs.
     * @param {number} [maxValue] The maximum value of the inputs.
     * @param {number} [value] The starting value of the inputs.
     */
    constructor(parent, name = "Quantity", minValue = 1, maxValue = 100, value = 1) {
        this.root = createGenericElement(parent, {className: "p-1"});
        this.inputRange = createGenericInput(this.root, {className: "form-range", attributes: {"type": "range", "name": name}});
        this.inputNumber = createGenericInput(this.root, {className: "form-control", attributes: {"type": "number", "name": name}});

        this.update(minValue, maxValue, value);

        this.inputRange.oninput = () => { this.updateValue(this.inputRange.value); };
        this.inputNumber.oninput = () => { this.updateValue(this.inputNumber.value); };
    }

    /**
     * Set the name attribute of the inputs.
     * @param {string} name The new name attribute.
     */
    setNameAttribute(name) {
        this.inputRange.setAttribute("name", name);
        this.inputNumber.setAttribute("name", name);
    }

    /**
     * Update the min, max and current value of the inputs.
     * @param {number} minValue The new minimum value of the inputs.
     * @param {number} maxValue The new maximum value of the inputs.
     * @param {string | number} value The new value of the inputs.
     */
    update(minValue, maxValue, value) {
        this.updateMin(minValue);
        this.updateMax(maxValue);
        this.updateValue(value);
    }

    /**
     * Update the value of the inputs to be an integer within min and max values.
     * @param {string | number} inputValue The new current value.
     */
    updateValue(inputValue) {
        const value = Number(inputValue);
        this.value = isNaN(value) || value < this.minValue || this.maxValue < this.minValue ? this.minValue : Math.min(Math.floor(value), this.maxValue);
        this.inputRange.value = this.value;
        this.inputNumber.value = this.value;
    }

    /**
     * Update the minimum value of the inputs.
     * @param {number} min The new minimum value.
     */
    updateMin(min) {
        this.minValue = min;
        this.inputRange.min = min;
    }

    /**
     * Update the maximum value of the inputs.
     * @param {number} max The new maximum value.
     */
    updateMax(max) {
        this.maxValue = max;
        this.inputRange.max = max;
    }
}