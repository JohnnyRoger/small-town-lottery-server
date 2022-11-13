
"use strict";

// module

module.exports = (paramName, paramValue) => {

	if ("undefined" === typeof paramValue) {
		return Promise.reject(new ReferenceError("Missing \"" + paramName + "\" data"));
	}
		else if ("string" !== typeof paramValue) {
			return Promise.reject(new TypeError("\"" + paramName + "\" data is not a string"));
		}
		else if ("" === paramValue) {
			return Promise.reject(new Error("\"" + paramName + "\" data is empty"));
		}

	else {
		return Promise.resolve();
	}

};
