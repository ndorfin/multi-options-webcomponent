const SELECTOR_WRAPPER   = '[slot="wrapper"]',
      SELECTOR_BUTTON    = '[type="button"]',
      SELECTOR_CHECKBOX  = '[type="checkbox"]',
      SELECTOR_TEXTFIELD = '[type="text"]';

export default class MultiOptions extends HTMLElement {

	#addNewItemElemToWrapper(item) {
		let itemFragment = this.templateItem;
		let checkbox = itemFragment.querySelector(SELECTOR_CHECKBOX)
		checkbox.value = item;
		checkbox.id = `${ checkbox.name }_${ checkbox.value }`;
		let label = itemFragment.querySelector('[data-item-label]');
		label.textContent = item;
		this.wrapperElem.append(itemFragment);
	}

	#addNewOptionsToList() {
		let values = this.textElem.value.split(',');
		values.forEach((item) => {
			const trimmedValue = item.trim();
			if (trimmedValue) {
				let existingCheckbox = this.wrapperElem.querySelector(`[value="${ trimmedValue }"]`);
				if (!existingCheckbox) this.#addNewItemElemToWrapper(trimmedValue);
			}
		});
		this.textElem.value = '';
		this.#synchroniseList();
	}

	#refreshList() {
		const disabledItems = this.datalistElem.querySelectorAll('option:disabled');
		disabledItems.forEach((item) => item.disabled = false);
	}

	#synchroniseList() {
		if (this.datalistElem) {
			this.#refreshList();
			const checkboxes = this.wrapperElem.querySelectorAll(SELECTOR_CHECKBOX);
			if (checkboxes.length) {
				checkboxes.forEach(({value}) => {
					const matchingOption = this.datalistElem.querySelector(`option[value="${ value }"]`);
					if (matchingOption) matchingOption.disabled = true;
				});
			}
		}
	}

	/* Event Handlers */
	#handleClicks(event) {
		if (event.target.matches(SELECTOR_BUTTON)) {
			if (this.textElem.value) this.#addNewOptionsToList();
		}
	}
	#handleKeyDowns(event) {
		if (event.key == 'Enter' && document.activeElement == this.textElem) {
			event.preventDefault();
			if (this.textElem.value) this.#addNewOptionsToList();
		} 
	}
	#handleChanges(event) {
		if (event.target.matches(`${ SELECTOR_CHECKBOX }:not(:checked)`)) {
			let topMostParentBeforeWrapper = event.target.closest(`${ SELECTOR_WRAPPER } > *`);
			this.wrapperElem.removeChild(topMostParentBeforeWrapper);
			if (!this.wrapperElem.children.length) this.wrapperElem.textContent = '';
			this.#synchroniseList();
		}
	}

	connectedCallback() {
		this.addEventListener('click', this.#handleClicks.bind(this));
		this.addEventListener('keydown', this.#handleKeyDowns.bind(this));
		this.addEventListener('change', this.#handleChanges.bind(this));
		this.#synchroniseList();
	}
	
	/* Shorthand template retrieval */
	#getTemplateFragment(selector) {
		const templateNode = this.querySelector(selector);
		return (templateNode) ? templateNode.content.cloneNode(true) : null;
	}
	get templateWrapper() {
		return this.#getTemplateFragment('template[data-type="wrapper"]');
	}
	get templateItem() {
		return this.#getTemplateFragment('template[data-type="item"]');
	}
	
	/* Shorthand element lookups */
	get buttonElem() {
		return this.querySelector(SELECTOR_BUTTON);
	}
	get textElem() {
		return this.querySelector(SELECTOR_TEXTFIELD);
	} 
	get wrapperElem() {
		const wrapper = this.querySelector(SELECTOR_WRAPPER);
		if (wrapper) return wrapper;

		const newWrapper = this.templateWrapper;
		this.append(newWrapper);
		return this.querySelector(SELECTOR_WRAPPER);
	}
	get datalistElem() {
		return this.querySelector('datalist');
	}
}
