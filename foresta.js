function foresta(query) {
    this.query = query;

    // parse out the query
    var parts = this.query.split(" ");
    this.filters = new Array();

    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var propertySelectors = new Array();
        if (part.length = 0 || part === " ") continue;
        
        var propertySelectorIndex = part.indexOf(":");
        if (propertySelectorIndex > -1) {
            // there's one or more property selector
            var subParts = part.split(":");
            part = subParts[0];
            for(var i=1;i<subParts.length;i++) {
                propertySelectors.push(subParts[i]);
            }
        }
        
        var filter = null;
        if (part.substring(0, 1) === "#") {
            // identifier
            filter = {
                value: part.substring(1, part.length),
                test: function (expression) {
                    return expression.type === "Identifier" && expression.name === this.value;
                }
            };
        } else if (part === "*") {
            // wildcard ... match anything
            filter = {
                test: function (expression) {
                    return true
                }
            };
        } else {
            // this is probably just a bare expression type filter
            filter = {
                value: part,
                test: function (expression) {
                    return expression.type === this.value;
                }
            };
        }

        if (filter != null) {
            filter.propertySelectors = propertySelectors;
            this.filters.push(filter);
        }
    }

    this.results = new Array();
    var that = this;
    this.visitProgram = function (program) {
        var body = program.body;
        for (var i = 0; i < body.length; i++) {
            var expression = body[i];
            expression.parent = program;
            this.visit(expression);
        }
    };
    this.visitVariableDeclaration = function (decl) {
        for (var i = 0; i < decl.declarations.length; i++) {
            var declaration = decl.declarations[i];
            declaration.parent = decl;
            this.visit(declaration);
        }
    };
    this.visitVariableDeclarator = function (variable) {
        if (variable.id !== null) {
            variable.id.parent = variable;
            this.visit(variable.id);
        }
        if (variable.init !== null) {
            variable.init.parent = variable;
            this.visit(variable.init);
        }
    };
    this.visitIdentifier = function (id) {
        // console.log(id.name);
    };
    this.visitBinaryExpression = function (expression) {
        if (expression.left !== null) {
            expression.left.parent = expression;
            this.visit(expression.left);
        }
        
        if (expression.right !== null) {
            expression.right.parent = expression;
            this.visit(expression.right);
        }
    };
    this.visitLiteral = function (literal) {
        // console.log(literal.value);
    };
    this.visitFunctionExpression = function (fx) {
        if (fx.id !== null) {
            fx.id.parent = fx;
            this.visit(fx.id);
        }
        for(var i = 0;i<fx.params.length;i++){
            var param = fx.params[i];
            param.parent = fx;
            this.visit(param);
        }
        for(var i = 0;i<fx.defaults.length;i++){
            var def = fx.defaults[i];
            def.parent = fx;
            this.visit(def);
        }
        
        if (fx.body !== null) {
            fx.body.parent = fx;
            this.visit(fx.body);
        }
        //generator
        // expression
    };
    this.visitBlockStatement = function(block) {
        for(var i=0;i<block.body.length;i++) {
            var e = block.body[i];
            e.parent = block;
            this.visit(e);
        }
    };
    this.visitAssignmentExpression = function(ex) {
        this.visitBinaryExpression(ex);
    };
    this.visitMemberExpression = function(member) {
        if (member.object !== null) {
            member.object.parent = member;
            this.visit(member.object);
        }
        
        if (member.property !== null) {
            member.property.parent = member;
            this.visit(member.property);
        }
    };
    this.visitExpressionStatement = function(ex) {
        if (ex.expression !== null) {
            ex.expression.parent = ex;
            this.visit(ex.expression);
        }
    };
    this.visitObjectExpression = function(ex) {
        for(var i=0;i<ex.properties.length;i++) {
            var property = ex.properties[i];
            property.parent = ex;
            this.visit(property);
        }
    };
    this.visitProperty = function(prop) {
        if (prop.key !== null) {
            prop.key.parent = prop;
            this.visit(prop.key);
        }
        
        if (prop.value) {
            prop.value.parent = prop;
            this.visit(prop.value);
        }
    };
    this.visitNewExpression = function(ex) {
        if (ex.callee !== null) {
            ex.callee.parent = ex;
            this.visit(ex.callee);
        }
        
        for(var i=0;i<ex.arguments.length;i++) {
            var arg = ex.arguments[i];
            arg.parent = ex;
            this.visit(arg);
        }
    };
    this.visitCallExpression = function(call) {
        this.visitNewExpression(call);
    };
    this.evaluateFilters = function(expression) {
        var filterMatched = true;
        var currentExpression = expression;
        for (var i = this.filters.length - 1; i >= 0; i--) {
            var filter = this.filters[i];
            if (currentExpression && filter.test(currentExpression)) {
                currentExpression.matchedFilter = filter;
                // move up the chain
                currentExpression = currentExpression.parent;
            } else {
                filterMatched = false;
                break;
            }
        }

        //console.log(expression);
        if (filterMatched) {
            if (expression.matchedFilter.propertySelectors.length===0) {
                // no further filters, just push the expression
                this.results.push(expression);
            }
            else {
                // we have property selectors, grab the result
                var properties = expression.matchedFilter.propertySelectors;
                var currentResult = expression;
                for(var i=0;i<properties.length;i++) {
                    var propFilter = properties[i]; 
                    if (currentResult[propFilter]) {
                        currentResult = currentResult[propFilter]; 
                    }
                }
                this.results.push(currentResult);
            }
        }  
    },
    this.visit = function (tgt) {
        if (tgt === null) return;
        
        this.evaluateFilters(tgt);

        switch (tgt.type) {
            case "Program":
                this.visitProgram(tgt);
                break;
            case "VariableDeclaration":
                this.visitVariableDeclaration(tgt);
                break;
            case "VariableDeclarator":
                this.visitVariableDeclarator(tgt);
                break;
            case "Identifier":
                this.visitIdentifier(tgt);
                break;
            case "BinaryExpression":
                this.visitBinaryExpression(tgt);
                break;
            case "Literal":
                this.visitLiteral(tgt);
                break;
            case "FunctionExpression":
                this.visitFunctionExpression(tgt);
                break;
            case "BlockStatement":
                this.visitBlockStatement(tgt);
                break;
            case "AssignmentExpression":
                this.visitAssignmentExpression(tgt);
                break;
            case "MemberExpression":
                this.visitMemberExpression(tgt);
                break;
            case "ExpressionStatement":
                this.visitExpressionStatement(tgt);
                break;
            case "ObjectExpression":
                this.visitObjectExpression(tgt);
                break;
            case "Property":
                this.visitProperty(tgt);
                break;
            case "NewExpression":
                this.visitNewExpression(tgt);
                break;
            case "CallExpression":
                this.visitCallExpression(tgt);
                break;
        }
    }
}