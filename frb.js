var my = {};

var goingRight = true;
var m = 0;

function update() {
    if (my.ball.y + my.ball.height > game.height) {
        my.ball.yVelocity = 0-my.ball.yVelocity;        
    }
    if (my.ball.yVelocity > 20) my.ball.yVelocity = 20;
    
    SpriteManager.camera.x = Math.sin(m) * 100;
    m += .05;
}

function draw() {
}

/***********************
    Framework
***********************/

function Camera() {
    this.x = 0;
    this.y = 0;
}
Camera.prototype.start = function() {
    canvas.save();
    canvas.translate(0-this.x, 0-this.y);
};
Camera.prototype.end = function() {
    canvas.restore();
};

var SpriteManager = {
    camera: new Camera(),
    images:{},
    sprites:new Array(),
    add:function(name) {
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
        var sprite = new Sprite(name, img, game.width/2-img.width/2, game.height/2-img.height/2);
        this.sprites.push(sprite);
        
        return sprite;
    }  ,
    update:function() {
        for(var i=0;i<this.sprites.length;i++) {
            var sprite = this.sprites[i];
            sprite.update();
        }   
    },
    draw:function() {
        this.camera.start();
        for(var i=0;i<this.sprites.length;i++) {
            var sprite = this.sprites[i];
            sprite.draw();
        }
        this.camera.end();
    }        
};

function Sprite(name, img, x, y) {
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
Sprite.prototype.draw = function() {
    canvas.save();
    canvas.translate(this.x + this.width/2, this.y + this.height/2);
    canvas.rotate(this.zRotation);
    canvas.drawImage(this.img, this.width/-2,this.height/-2);//this.x, this.y);

    canvas.restore();
    //context.rotate(0);
};
Sprite.prototype.update = function() {
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
var game = {
    width:480,
    height:320,
    fps:30
};

var canvasElement = $("<canvas width='" + game.width + 
                      "' height='" + game.height + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

function coreUpdate() {
    SpriteManager.update();
    update();
}

function coreDraw() {
    canvas.fillStyle ="#6495ED";
    canvas.fillRect(0, 0, game.width, game.height);
    
    SpriteManager.draw();
    draw();   
}

setInterval(function() {
  coreUpdate();
  coreDraw();
}, 1000/game.fps);

/****************
 Custom init
****************/
$(function() {
   my.ball = SpriteManager.add("http://www.flatredball.com/frb/docs/images/9/99/Frblogo128.png"); 
    //my.ball.y = 300;
    my.ball.yAcceleration = .5;
    
    my.ball.zRotationVelocity = .05;
});
​