/**
 * Created by ericm on 10/18/17.
 */
import {PolymerElement} from '@polymer/polymer/polymer-element.js';

import template from './ns-currency.html';
import {CurrencyService} from 'ns-test-shop';

export class NsCurrency extends PolymerElement {
    static get properties() {
        return {
            amount: {
                type: Number,
                observer: '_amountChanged'
            },
            country: {
                type: String,
                value: "US"
            },
            language: {
                type: String,
                value: "en"
            }
        };
    }

   static get template() {
        return template;
    }

   constructor() {
        super()
    }
    
    ready() {
        super.ready()
        this.formattedCurrency = '---------';
        if (this.amount !== undefined && this.amount !== null) {
            this.formattedCurrency = CurrencyService.format(this.amount, this.country, this.language);
        }
    }
    
    _amountChanged(newValue, oldValue) {
        this.formattedCurrency = CurrencyService.format(this.amount, this.country, this.language);
    }
}
customElements.define('ns-currency', NsCurrency);
