importScripts('esprima.js', 'escodegen.browser.js', 'foresta.js');

addEventListener('message', function(e) {
    var data = e.data;
    var syntax = esprima.parse(data);

	var query = new foresta("ObjectExpression Property #update:parent:value");
	query.visit(syntax);
	var updateExpression = query.results[0];
	var updatedUpdateFunction = globalContext.escodegen.generate(updateExpression);

	self.postMessage(updatedUpdateFunction);
}, false);