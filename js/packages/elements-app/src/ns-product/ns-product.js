/**
 * Created by ericm on 10/18/17.
 */
import {PolymerElement} from '@polymer/polymer/polymer-element.js';

import template from './ns-product.html';
import $ from 'jquery';
import NsCurrency from 'ns-test-util-elements';

function getMarket(code,data) {
    var market = data.market;
    market.map(mkt => {
        if (mkt.countryCode == code) {
            market = mkt;
        }
    });
    return market;
}

/**
 *  Testing in .js
 *  An element to showcase a product.
 *  `ns-product` is the base element for product stuff and can be used inside
 * a `ns-product-group`. Other product components include:
 * * `ns-product-detail`
 * * `ns-product-small`
 * * `ns-product-overlay`
 * * `ns-product-popup`
 *  @demo demo/index.html Basic Demo
 */
export class NsProduct extends PolymerElement {

    static get properties() {
        return {
            /**
             * A NuSkin product SKU
             *
             * Examples:
             *   - 01003610
             */
            sku: {
                type: String,
                value: '',
            },
            country: {
                type: String,
                value: "US"
            },
            price: {
                type: String
            }
        };
    }

   static get template() {
        return template;
    }

   constructor() {
        super()
    }

    /**
     * Does the setup work of calling tokenizeSku, making an ajax call for the product 
     * and setting the basic data for the product
     */
    ready() {
        super.ready();
        console.log('in product ready');
        if (this.sku) {
            let tokenizedSku = this.tokenizeSku(this.sku);
            let that = this;
            console.log('lang:' + this.lang);
            if (!this.lang) this.lang = 'en';
            $.ajax({
                url: 'https://www.nuskin.com/content/products/' + tokenizedSku + '.service.US.json',
                success: function(data) {
                    console.log('data:', data);
                    var langArray = data.contents.language;
                    var langData;
                    for (var i=0; i<langArray.length; i++) {
                        if (langArray[i].languageCode === that.lang) {
                            langData = langArray[i];
                            break;
                        }
                    }

                    that.title = langData.name;
                    that.description = langData.shortDescription;
                    that.fullImage = data.contents.fullImage;

                    var market = getMarket(that.country, data);
                    console.log("Got price:", market.WebRetail)
                    that.price = market.WebRetail;
                }
            });
        } else {
            console.log('please supply a sku');
            this.title = 'Please supply a sku'
        }
    }

    /**
     * 
     * @param {*} sku 
     * Adds a product by it's SKU
     */
    addProduct(sku) {
        console.log("Adding sku: ", this.sku)
    }

    /**
     * 
     * @param {*} sku 
     * Creates a token from the SKU
     */
    tokenizeSku(sku) {
        console.log('tokenizing sku');
        let url = '';
        let part1 = sku.substring(0,2);
        let part2 = sku.substring(2,4);
        let part3 = sku.substring(4,6);
        return part1 + '/' + part2 + '/' + part3 + '/' + sku;
    }


}
customElements.define('ns-product', NsProduct);