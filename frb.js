MathHelper = {
    invert: function (value) {
        return 0 - value;
    }
};

/***********************
    Framework
***********************/
var frb = {};

frb.TimeManager = {
    start: new Date(),
    last: new Date(),
    secondDifference: 0,
    secondDifferenceFromStart: 0,
    update: function () {
        var startMilli = this.start.getTime();
        var lastMilli = this.last.getTime();
        this.last = new Date();
        var nowMilli = this.last.getTime();
        var diff = nowMilli - lastMilli;
        var startDiff = nowMilli - startMilli;
        this.secondDifference = diff / 1000;
        this.secondDifferenceFromStart = startDiff / 1000;
    }
}

frb.PositionedObject = function () {
    this.x = 0;
    this.y = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAcceleration = 0;
    this.yAcceleration = 0;
    this.zRotation = 0;
    this.zRotationAcceleration = 0;
    this.zRotationVelocity = 0;
}
frb.PositionedObject.prototype.update = function () {
    var diff = frb.TimeManager.secondDifference;

    this.x += this.xVelocity * diff + this.xAcceleration * diff;
    this.y += this.yVelocity * diff + this.yAcceleration * diff;
    this.xVelocity += this.xAcceleration * diff;
    this.yVelocity += this.yAcceleration * diff;

    this.zRotation += this.zRotationVelocity * diff + this.zRotationAcceleration * diff;
    this.zRotationVelocity += this.zRotationAcceleration * diff;
};
frb.PositionedObject.prototype.updateControlValues = function (source) {
    this.x = source.x;
    this.y = source.y;
    this.xVelocity = source.xVelocity;
    this.yVelocity = source.yVelocity;
    this.xAcceleration = source.xAcceleration;
    this.yAcceleration = source.xAcceleration;
    this.zRotation = source.zRotation;
    this.zRotationVelocity = source.zRotationVelocity;
    this.zRotationAcceleration = source.zRotationAcceleration;
};
frb.PositionedObject.prototype.updatePositionResults = function (target) {
    target.x = this.x;
    target.y = this.y;
    target.xVelocity = this.xVelocity;
    target.yVelocity = this.yVelocity;
    target.xAcceleration = this.xAcceleration;
    target.yAcceleration = this.yAcceleration;
    target.zRotation = this.zRotation;
    target.zRotationAcceleration = this.zRotationAcceleration;
    target.zRotationVelocity = this.zRotationVelocity;
};

frb.Camera = function() {
    this.x = 0;
    this.y = 0;
}
frb.Camera.prototype.start = function () {
    frb.context.save();
    frb.context.translate((0 - this.x) + frb.graphics.width / 2, this.y + frb.graphics.height / 2);
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
            img.loadEvents = new Array();
            img.onload = function () {
                for (var i = 0; i < img.loadEvents.length; i++) {
                    img.loadEvents[i]();
                }
            };
            this.images[name] = img;
        }

        // now create the sprite
        var sprite = new frb.Sprite(name, img, 0, 0);
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

    this.position = new frb.PositionedObject();
    this.position.updatePositionResults(this);

    this.x = x;
    this.y = y;

    // now handle delayed loading
    var sprite = this;
    img.loadEvents.push(function () {
        sprite.width = img.width;
        sprite.height = img.height;
    });
}
frb.Sprite.prototype.draw = function () {
    frb.context.save();
    frb.context.translate(this.xTarget, this.yTarget);
    frb.context.rotate(this.zRotation);
    frb.context.drawImage(this.img, this.width / -2, this.height / -2);

    frb.context.restore();
};
frb.Sprite.prototype.update = function () {
    this.position.updateControlValues(this);
    this.position.update();
    this.position.updatePositionResults(this);

    this.xTarget = this.x;
    this.yTarget = MathHelper.invert(this.y);
};

/***********************
    Game initialization
***********************/
frb.start = function (options) {
    function coreUpdate() {
        frb.TimeManager.update();
        frb.SpriteManager.update();

        if (options.update) options.update();
    }

    function coreDraw() {
        frb.context.fillStyle = "#6495ED";
        frb.context.fillRect(0, 0, frb.graphics.width, frb.graphics.height);

        frb.SpriteManager.draw();

        if (options.draw) options.draw();
    }

    // initialize the canvas

    // create the canvas, if necessary
    if (options.canvas) {
        if (jQuery && options.canvas instanceof jQuery) {
            frb.context = options.canvas.get(0).getContext("2d");
            frb.graphics = { width: options.canvas.width(), height: options.canvas.height() };
        }
        else {
            frb.context = options.canvas.getContext("2d");
            frb.graphics = { width: options.canvas.width, height: options.canvas.height };
        }
    }
    else if (document.getElementsByTagName("canvas").length > 0) {
        var canvasElement = document.getElementsByTagName("canvas").item(0);

        frb.context = canvasElement.getContext("2d");
        frb.graphics = { width: canvasElement.width, height: canvasElement.height };
    }
    else {
        frb.graphics = {
            width: 480,
            height: 320
        };

        var canvasElement = document.createElement("canvas");
        canvasElement.setAttribute("width", frb.graphics.width);
        canvasElement.setAttribute("height", frb.graphics.height);
        var body = document.getElementsByTagName("body").item(0);

        body.appendChild(canvasElement);
        frb.context = canvasElement.getContext("2d");
    }
    
    if (!frb.graphics.fps) frb.graphics.fps = 30;

    (function () {
        console.log("initializing frb");

        // run the user's initialization code
        //if (init && typeof (init) == "function") init();
        if (options.init) options.init();

        // set up the game loop
        setInterval(function () {
            coreUpdate();
            coreDraw();
        }, 1000 / frb.graphics.fps);
    })();
};