import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import template from './ns-button.html';

class NsButton extends PolymerElement {
    constructor() {
        super();
    }

    static get is() {
        return "ns-button";
    }

    static get template() {
        return template;
    }

    static get properties() {
        return {
            type: {
                type: String,
                value: "default"
            },
            href: {
                type: String,
                value: ""
            },
            align: String,
            fluid: Boolean,
            disabled: {
                type: Boolean,
                value: false
            },
            shadowless: Boolean,
            borderless: Boolean
        }
    }

    ready() {
        super.ready();
    }

}
customElements.define(NsButton.is, NsButton);