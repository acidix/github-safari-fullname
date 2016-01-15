"use strict";

function ReplaceRestricter() {
    this.restrictedUrls = [
        "issues/new" // Create new issue. If replace is executed on this page it will slow down the whole browser.
    ];
    // List of all "exceptions" (criteria, when a user ID should NOT be replaced by the real name)
    this.restrictedElements = [{
        "parents": "#wiki-body"
    }, {
        "parents": "textarea"
    }, {
        "parents": ".ace_editor"
    }, {
        "parents": ".form-content" // Edit comment text area
    }, {
        "parents": ".copyable-terminal" // UserIds which are commands for the terminal shouldn't be replaced
    }, {
        "parents": ".commit-ref" // Visible remote branch name. It should be able to use this name in the terminal
    }, {
        "parents": ".merge-pr-more-commits" // Comment for fork: Add more commits by pushing to the
    }, {
        "parents": "code" // No replace for anything which seems like code
    }, {
        "parents": "pre" // No replace for anything that is preformatted
    }, {
        "parent": ".author"
    }, {
        "self": ".vcard-username"
    }];
    // List of all "exception" patterns
    this.retrictedPatterns = [{
        "pattern": /[di]\d{6}\/|c\d{7}\//gi // Allow only if the username is not followed by a slash
    }];
}

ReplaceRestricter.prototype.isAllowedUrl = function(currentUrl) {
    for (var i = 0; i < this.restrictedUrls.length; i++) {
        if (currentUrl.indexOf(this.restrictedUrls[i]) !== -1) {
            return false;
        }
    }
    return true;
};

//Checks if a jQuery element fulfills any of the replacement exceptions
ReplaceRestricter.prototype.isReplacementAllowed = function(jqElement) {
    if(!jqElement){
        return false;
    }
    //Check if this text matches the criteria for any of the "exceptions"
    for (var i = 0; i < this.retrictedPatterns.length; i++) {
        if((this.restrictedElements[i].parents ? jqElement.parents(this.restrictedElements[i].parents).length > 0 : false)){
            return false;
        } else if(this.restrictedElements[i].self ? jqElement.parent().parent().children(this.restrictedElements[i].self).length > 0 : false){
            return false;
        }
    }
    //All exceptions passed / do not apply
    return true;
};

//Checks if the content of a jQuery element matches restriction patterns
ReplaceRestricter.prototype.isPatternAllowed = function(jqElement, oldValue) {
    if(!jqElement){
        return false;
    }

    //Check if this text matches the criteria for any of the "exceptions"
    for (var i = 0; i < this.retrictedPatterns.length; i++) {
        if(this.retrictedPatterns[i].pattern ? oldValue.match(this.retrictedPatterns[i].pattern) : false){
            return false;
        }
    }
    //All exceptions passed / do not apply
    return true;
}
