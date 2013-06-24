var flatRedBall = (function (frb) {
    frb.SpriteManager = {
        camera: new frb.Camera(),
        images: {},
        sprites: new frb.AttachableList(),

        add: function (name, loadedCallback) {
            var path = name;

            // handle absolute vs relative references
            if(name.indexOf("http") < 0) {
                path = "content/" + name;
                if(path.indexOf(".") < 0) {
                    path += ".png";
                }
            }

            // load the image
            var img;
            var isDoneLoading = false;
            if(name in this.images) {
                img = this.images[name];
                isDoneLoading = true;
            }
            else {
                img = new Image();
                img.src = path;
                img.loadEvents = [];
                if(loadedCallback) {
                    img.loadEvents.push(loadedCallback);
                }
                img.onload = function() {
                    for(var i = 0; i < img.loadEvents.length; i += 1) {
                        img.loadEvents[i]();
                    }
                };
                this.images[name] = img;
            }

            // init the sprite
            var sprite = new frb.Sprite(name, img, 0, 0, loadedCallback);
            this.sprites.add(sprite);

            if(isDoneLoading) {
                loadedCallback;
            }

            return sprite;
        },

        update: function() {
            frb.updateViewBounds();
            for(var i= 0; i < this.sprites.length; i++) {
                var sprite = this.sprites.get(i);
                sprite.update();
            }
        },

        draw: function() {
            // TODO: rendering should be loosely coupled: draw method should call into a renderer.
            this.camera.start();
            // TODO: order by Z
            for(var i = 0; i < this.sprites.length; i++) {
                var sprite = this.sprites.get(i);
                frb.context.save();
                frb.context.translate(sprite.xTarget, sprite.yTarget);

                // TODO: handle more than Z rotation
                frb.context.rotate(-sprite.rotation.z);

                frb.context.globalAlpha = sprite.alpha;

                // TODO: handle texture coordinates and scaling
                frb.context.drawImage(sprite.img, sprite.width / -2, sprite.height / -2);
                frb.context.restore();
            }
            this.camera.end();
        }
    };
    return frb;
}(flatRedBall || {}))
