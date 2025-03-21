export default class MultiOptions extends HTMLElement {

	#addNewItemElemToWrapper(item) {
		let itemFragment = this.templateItem;
		let checkbox = itemFragment.querySelector('[type="checkbox"]')
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

	#handleClicks(event) {
		if (event.target.matches('[type="button"]')) {
			if (this.textElem.value) this.#addNewOptionsToList();
		}
	}

	#handleKeyDown(event) {
		if (event.key == 'Enter' && document.activeElement == this.textElem) {
			event.preventDefault();
			if (this.textElem.value) this.#addNewOptionsToList();
		} 
	}

	#handleChanges(event) {
		if (event.target.matches('[type="checkbox"]:not(:checked)')) {
			let topMostParentBeforeWrapper = event.target.closest('[slot="wrapper"] > *');
			this.wrapperElem.removeChild(topMostParentBeforeWrapper);
			if (!this.wrapperElem.children.length) this.wrapperElem.textContent = '';
			this.#synchroniseList();
		}
	}

	#refreshList() {
		const disabledItems = this.datalistElem.querySelectorAll('option:disabled');
		disabledItems.forEach((item) => item.disabled = false);
	}

	#synchroniseList() {
		if (this.datalistElem) {
			const checkboxes = this.wrapperElem.querySelectorAll('[type="checkbox"]');
			if (checkboxes.length) {
				this.#refreshList();
				checkboxes.forEach(({value}) => {
					console.log('value', value);
					this.datalistElem.querySelector(`option[value="${ value }"]`).disabled = true;
				});
			}
		}
	}

	connectedCallback() {
		this.addEventListener('click', this.#handleClicks.bind(this));
		this.addEventListener('keydown', this.#handleKeyDown.bind(this));
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
		return this.querySelector('[type="button"]');
	}
	get textElem() {
		return this.querySelector('[type="text"]');
	} 
	get wrapperElem() {
		const wrapper = this.querySelector('[slot="wrapper"]');
		if (wrapper) return wrapper;

		const newWrapper = this.templateWrapper;
		this.append(newWrapper);
		return this.querySelector('[slot="wrapper"]');
	}
	get datalistElem() {
		return this.querySelector('datalist');
	}
}
