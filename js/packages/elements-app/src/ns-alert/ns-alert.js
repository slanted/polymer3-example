import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import template from './ns-alert.html';

import {utilTest} from "ns-test-util"; // function imported from another module

import infoIcon from '../assets/info-icon.svg';
import successMessageIcon from '../assets/success-message-icon.svg';
import warningIconDark from '../assets/warning-icon-dark.svg';
import warningIcon from '../assets/warning-icon.svg';
import errorIcon from '../assets/system-error-icon.svg';

console.log("Imported images...");

class NsAlert extends PolymerElement {
    constructor() {
        super();
    }

    ready() {
        super.ready();

        var iconDiv = this.$.iconDiv;
        switch (this.type) {
            case 'default':
                iconDiv.style.backgroundImage = 'url(' + warningIconDark + ')';
                break;
            case 'success':
                iconDiv.style.backgroundImage = 'url(' + successMessageIcon + ')';
                break;
            case 'warning':
                iconDiv.style.backgroundImage = 'url(' + warningIcon + ')';
                break;
            case 'error':
                iconDiv.style.backgroundImage = 'url(' + errorIcon + ')';
                break;
            case 'information':
                iconDiv.style.backgroundImage = 'url(' + infoIcon + ')';
                this.message = utilTest();
                break;
        
            default:
                break;
        }
    }

    static get is() {
        return "ns-alert";
    }

    static get template() {
        return template;
    }

    static get properties() {
        return {
            newProp: {
                type:String
            },
            active: {
                type: String,
                value: "active"
            },
            type: String,
            noIcon: Boolean,
            noClose: Boolean,
            header: {
                type: String,
                value: ""
            },
            message: {
                type: String,
                value: ""
            },
            developerInfo: {
                type: String,
                value: ""
            }
        };
    }

    toggle() {
        this.active = (this.active === "active") ? "inactive" : "active";
    }

}

customElements.define(NsAlert.is, NsAlert);