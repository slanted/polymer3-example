import {Element as PolymerElement} from '@polymer/polymer/polymer-element.js';
import template from './ns-profile.html';


class NsProfile extends PolymerElement {
    static get is() { return 'ns-profile'; }

    static get template() {
        return template;
    }

    static get properties() {
        return {
            active: {
                type: String,
                value: "inactive"
            },
            user: {
                type: Object
            }
        }
    }

    observers: [
        '_userObjectChanged(user.*)'
    ];

    _userObjectChanged(changedRecord) {

    }
    toggleDropdown() {
        this.active = (this.active === "active") ? "inactive" : "active";
    }

    signIn() {
        console.log(window.location.href);
        if(this.signin) {
            window.location.assign(this.signin.href);
        } else {
            window.location.assign("/");
        }
    }

    signOut() {
        aem.userProfileManager.deleteUserProfileCookiesAndSignOut();
        this.isLoggedIn = false;
    }

    hasAccountLevel(userType, navItem) {
        var hasAccountLevel = false;
        navItem.accountLevels.forEach(function(accountLevel) {
            if (userType === accountLevel) {
                hasAccountLevel = true;
            }
        });
        return hasAccountLevel;
    }
}
window.customElements.define(NsProfile.is, NsProfile);
