export default class MultiOptions extends HTMLElement {
	
	#buttonElem;
	#wrapperElem;
	#itemElem;
	#textElem;

	#addCustomOptionsToList() {
		let values = this.#textElem.value.split(',');
		console.log(values);
	}

	#handleButtonClicks(event) {
		if (event.target.matches('[type="button"]')) {
			this.#addCustomOptionsToList();
		}
	}

	connectedCallback() {
		this.#buttonElem = this.querySelector('[type="button"]');
		this.#wrapperElem = this.querySelector('[slot="wrapper"]');
		this.#textElem = this.querySelector('[type="text"]');

		this.#buttonElem.addEventListener('click', this.#handleButtonClicks.bind(this));
		this.addEventListener('submit', (event) => {
			event.preventDefault();
		});
	}
}
