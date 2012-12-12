/***********************
    Framework
***********************/
var frb = {};

frb.Camera = function() {
    this.x = 0;
    this.y = 0;
}
frb.Camera.prototype.start = function () {
    frb.context.save();
    frb.context.translate(0 - this.x, 0 - this.y);
};
frb.Camera.prototype.end = function () {
    frb.context.restore();
};

frb.SpriteManager = {
    camera: new frb.Camera(),
    images: {},
    sprites: new Array(),
    add: function (name) {
        var path = name;

        // handle the case where we want a static URL
        if (name.indexOf("http") < 0)
            path = "content/" + name + ".png";

        // now initialize the image
        var img;
        if (name in this.images) {
            img = this.images[name];
        }
        else {
            img = new Image();
            img.src = path;

            this.images[name] = img;
        }

        // now create the sprite
        var sprite = new frb.Sprite(name, img, frb.graphics.width / 2 - img.width / 2, frb.graphics.height / 2 - img.height / 2);
        this.sprites.push(sprite);

        return sprite;
    },
    update: function () {
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            sprite.update();
        }
    },
    draw: function () {
        this.camera.start();
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            sprite.draw();
        }
        this.camera.end();
    }
};

frb.Sprite = function(name, img, x, y) {
    this.name = name;
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.zRotation = 0;
    this.zRotationAcceleration = 0;
    this.zRotationVelocity = 0;
}
frb.Sprite.prototype.draw = function () {
    frb.context.save();
    frb.context.translate(this.x + this.width / 2, this.y + this.height / 2);
    frb.context.rotate(this.zRotation);
    frb.context.drawImage(this.img, this.width / -2, this.height / -2);

    frb.context.restore();
};
frb.Sprite.prototype.update = function () {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity += this.xAcceleration;
    this.yVelocity += this.yAcceleration;

    this.zRotation += this.zRotationVelocity;
    this.zRotationVelocity += this.zRotationAcceleration;
};

/***********************
    Game initialization
***********************/
(function () {
    function coreUpdate() {
        frb.SpriteManager.update();

        if (update && typeof (update) == "function") update();
    }

    function coreDraw() {
        frb.context.fillStyle = "#6495ED";
        frb.context.fillRect(0, 0, frb.graphics.width, frb.graphics.height);

        frb.SpriteManager.draw();

        if (draw && typeof (draw) == "function") draw();
    }

    function r(f) {
        if (document.addEventListener) {
            // Use the handy event callback
            var callback = function () {
                document.removeEventListener("DOMContentLoaded", callback, false);
                f();
            };

            document.addEventListener("DOMContentLoaded", callback, false);

        }
        else {
            // TODO: support IE
        }
    }

    // initialize the canvas
    frb.graphics = {
        width: 480,
        height: 320,
        fps: 30
    };

    var canvasElement = $("<canvas width='" + frb.graphics.width +
                              "' height='" + frb.graphics.height + "'></canvas>");
    frb.context = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('body');

    r(function () {
        console.log("initializing frb");

        // run the user's initialization code
        if (init && typeof (init) == "function") init();

        // set up the game loop
        setInterval(function () {
            coreUpdate();
            coreDraw();
        }, 1000 / frb.graphics.fps);
    });
})();