importScripts('esprima.js', 'escodegen.browser.js', 'foresta.js');


var lastInit = null;

addEventListener('message', function(e) {
	try {
	    var data = e.data;
	    var syntax = esprima.parse(data, { tolerant: true, loc: true });

	    if (syntax.errors.length > 0) {
	    	self.postMessage({failed:true, message:"syntax errors"});
	    	return;
	    }

		var updateFunctionQuery = new foresta("ObjectExpression Property #update:parent:value");
		updateFunctionQuery.visit(syntax);
		var updateExpression = updateFunctionQuery.results[0];
		var updatedUpdateFunction = globalContext.escodegen.generate(updateExpression);

		var initFunctionQuery = new foresta("ObjectExpression Property #init:parent:value");
		initFunctionQuery.visit(syntax);
		var initExpression = initFunctionQuery.results[0];
		var updatedInitFunction = globalContext.escodegen.generate(initExpression);

		var result = {
			updateFunction: updatedUpdateFunction,
			initFunction: updatedInitFunction
		};

		if (lastInit === null) lastInit = updatedInitFunction;
		result.shouldReset = lastInit !== updatedInitFunction;
		lastInit = updatedInitFunction;

		self.postMessage(result);
	}
	catch (err) {
		// do nothing for now
		self.postMessage({failed:true, message:err.message});
	}
}, false);