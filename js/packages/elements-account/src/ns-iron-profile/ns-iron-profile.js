import {Element as PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../components/iron-ajax/iron-ajax.html';
import './ns-profile.html';
import template from './ns-iron-profile.html';


class NSIronProfile extends PolymerElement {
    static get is() {
        return 'ns-iron-profile';
    }

    static get template() {
        return template;
    }

    static get properties() {
        return {
            user: {
                type: Object,
                value: {}
            },
            accountSettings: {
                type: Object,
                value: {
                    "name": "View Account Settings",
                    "href": "#"
                }
            },
            logout: {
                type: Object,
                value: {
                    "name": "Sign Out",
                    "href": "/"
                }
            },
            signin: {
                type: Object,
                value: {
                    "name": "Sign In",
                    "href": "/"
                }
            },
            profileMenu: {
                type: Array,
                value: [
                    {
                        "name": "Volume & Genealogy",
                        "href": "#",
                        "accountLevels": [
                            "10"
                        ]
                    }, {
                        "name": "Shop",
                        "href": "#",
                        "accountLevels": [
                            "10"
                        ]
                    }, {
                        "name": "Back Office",
                        "href": "#",
                        "accountLevels": [
                            "10"
                        ]
                    }
                ]
            },
            isLoggedIn: {
                type: Boolean,
                value: false
            },
            myAccount: {
                type: String,
                value: "My Account"
            }
        }
    }

    detached() {
        this.isLoggedIn = aem.userProfileManager.isUserLoggedIn();
        if (this.isLoggedIn) {
            this.masterInfo = aem.userProfileManager.getUserProfileMasterInfo();
            this.userDetails = aem.userProfileManager.getUserProfileDetailInfo();
            if (this.masterInfo) {
                switch (this.masterInfo.userType) {
                    case 'Retail_Customer':
                    case 'Prefered_Customer':
                    case 'Family_Member':
                        this.user.accType = 'customer';
                        this.user.isCustomer = true;
                        break;
                    case 'Primary_Distributor':
                    case 'Associate':
                        this.user.accType = 'distributor';
                        break;
                    default:
                        this.user.accType = 'guest';
                }
            }
            if (this.userDetails) {
                var profileHeader = this.userDetails['profileHeader'];
                if (profileHeader['profileThumbnailUrl']) {
                    this.user.accImage = profileHeader['profileThumbnailUrl'];
                } else {
                    this.user.accImage = '';
                }
                this.user.firstName = profileHeader['firstName'];
                this.user.lastName = profileHeader['lastName'];
                this.user.preferredName = profileHeader['preferredName'];
                this.user.accountLevel = aem.userProfileManager.getAccountType();
            }
        }
    }
}
window.customElements.define(NSIronProfile.is, NSIronProfile);
