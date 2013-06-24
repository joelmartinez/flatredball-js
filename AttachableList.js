var flatRedBall = (function (frb) {
    frb.AttachableList = function () {
        this.list = [];
        this.length = 0;
        return this;
    }

    frb.AttachableList.prototype.get = function (index) {
        if (index > -1 && this.list.length > index) {
            return this.list[index];
        }
        return null;
    }

    frb.AttachableList.prototype.add = function(value) {
        if(!this.contains(value)) {
            this.list.push(value);
            value.listsBelongingTo.push(this);
            this.length = this.list.length;
        }
    }

    frb.AttachableList.prototype.remove = function(value) {
        var index = this.list.indexOf(value);
        if(index >= 0) {
            this.list.splice(index, 1);
            this.length = this.list.length;

            if(value.listsBelongingTo) {
                var listIndex = value.listsBelongingTo.indexOf(this);
                if(listIndex > -1) {
                    value.listsBelongingTo.splice(listIndex, 1);
                }
            }
        }
    }

    frb.AttachableList.prototype.removeFromAll = function(value) {
        if(value.listsBelongingTo) {
            var numLists = value.listsBelongingTo.length;
            for(var i = value.listsBelongingTo.length - 1; i > -1; i -= 1) {
                if(value.listsBelongingTo[i] === undefined) {
                    continue;
                }
                value.listsBelongingTo[i].remove(value);
            }
        }
    }

    frb.AttachableList.prototype.pop = function() {
        if(this.length <= 0) {
            throw "No more items to pop.";
        }
        var item = this.get(this.length - 1);
        this.remove(item);
        return item;
    }

    frb.AttachableList.prototype.contains = function (value) {
        return this.list.indexOf(value) >= 0;
    }

    frb.AttachableList.prototype.empty = function () {
        var items = this.list.slice(0);
        for (var i = items.length - 1; i > -1; i -= 1) {
            frb.AttachableList.removeFromAll(items[i]);
        }
    }

    return frb;
}(flatRedBall || {}))
