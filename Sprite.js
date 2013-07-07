var flatRedBall = (function (frb) {
    frb.Sprite = frb.PositionedObject.extend({

        init: function(name, img, x, y, loadedCallback) {
            this.name = name;
            this.img = img;
            this.width = (img !== undefined) ? img.width : 0;
            this.height = (img !== undefined) ? img.height : 0;
            this._super();
            this.x = x;
            this.y = y;
            this.alpha = 1;
            this.textureCoordinates = null;

            var sprite = this;
            img.loadEvents.push(function() {
                sprite.width = img.width;
                sprite.height = img.height;
            })
        },

        setTextureCoordinates: function(top, right, bottom, left) {
            this.textureCoordinates = {
                top: top,
                right: right,
                bottom: bottom,
                left: left
            };
        },

        draw: function(context) {
            throw "SpriteManager should manage drawing instead of calling into every object's draw method.";
        },

        update: function() {
            this._super();
        }
    });

    return frb;
}(flatRedBall || {}))