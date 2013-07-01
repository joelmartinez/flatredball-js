var game = frb.start({
    clearColor:"black",
    init: function(engine) {
        window.lines = new Array();

        options = {
            numberOfDrops: 50,
            rainVector: {x: -4, y: -23},
            rainVectorRandomFactor: 1,
            rainSpeed: 40,
            rainSpeedRandomFactor: 10
        };

        // init the raindrops
        for (var i = 0; i < options.numberOfDrops; i++) {
            var startx = Math.random() * engine.viewBounds.left*2 - engine.viewBounds.left;
            var starty = Math.random() * engine.viewBounds.top*2 - engine.viewBounds.top*2;
            var line = engine.SpriteManager.addLine(
                startx,
                starty,
                startx+options.rainVector.x-(Math.random() * options.rainVectorRandomFactor-options.rainVectorRandomFactor),
                starty+options.rainVector.y);
            line.lineColor = "#ccc";
            line.lineWidth = 4;
            line.vec = {x: line.end.x-line.start.x, y: line.end.y-line.start.y, speed: options.rainSpeed + Math.random() * options.rainSpeedRandomFactor};  

            window.lines.push(line);
        }; 
    },
    update: function() {
        for (var i = window.lines.length - 1; i >= 0; i--) {
            var line = window.lines[i]

            if (!game.InputManager.keyboard.keyDown("S")) {
                var vec = line.vec;

                line.start.xVelocity = vec.x * vec.speed;
                line.start.yVelocity = vec.y * vec.speed;
                line.end.xVelocity = vec.x * vec.speed;                             
                line.end.yVelocity = vec.y * vec.speed;
            }
            else {
                line.start.xVelocity = 0;
                line.start.yVelocity = 0;
                line.end.xVelocity = 0;
                line.end.yVelocity = 0;
            }

            if (line.start.y < game.viewBounds.bottom) {
                line.start.y = game.viewBounds.top - line.vec.y;
                line.end.y = game.viewBounds.top;
            }
            if (line.end.x < game.viewBounds.left) {
                line.start.x = game.viewBounds.right - line.vec.x;
                line.end.x = game.viewBounds.right;
            }

        };
        
    }
});
