var flatRedBall = (function (frb) {
    frb.ResourcePool = Class.extend({
        init: function() {
            this.active = new frb.AttachableList();
            this.available = new frb.AttachableList();
        },

        add: function(factory) {
            var newItem = null;
            if(this.available.length > 0) {
                newItem = this.available.pop();
            }

            if(newItem === null) {
                newItem = factory();
            }

            this.active.add(newItem);
            return newItem;
        },

        return: function(item) {
            this.active.remove(item);
            this.available.add(item);
        }

    });

    return frb;
}(flatRedBall || {}))
