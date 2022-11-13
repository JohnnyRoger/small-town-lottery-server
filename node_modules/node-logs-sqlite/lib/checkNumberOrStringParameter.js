
"use strict";

// module

module.exports = (paramName, paramValue) => {

	if ("undefined" === typeof paramValue) {
		return Promise.reject(new ReferenceError("Missing \"" + paramName + "\" data"));
	}
		else if ("string" !== typeof paramValue && "number" !== typeof paramValue) {
			return Promise.reject(new TypeError("\"" + paramName + "\" data is not a string or a number"));
		}
		else if ("string" === typeof paramValue && "" === paramValue.trim()) {
			return Promise.reject(new Error("\"" + paramName + "\" data is empty"));
		}
		else if ("number" === typeof paramValue && 0 >= paramValue) {
			return Promise.reject(new Error("\"" + paramName + "\" data is empty"));
		}

	else {
		return Promise.resolve();
	}

};
