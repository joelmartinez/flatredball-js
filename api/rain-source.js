frb.start({
    clearColor:"black",
    init: function() {
        window.lines = new Array();
        window.tiles = new Array();

        options = {
            numberOfDrops: 50,
            rainVector: {x: -4, y: -23},
            rainVectorRandomFactor: 1,
            rainSpeed: 40,
            rainSpeedRandomFactor: 10
        };

        // init the raindrops
        for (var i = 0; i < options.numberOfDrops; i++) {
            var startx = Math.random() * frb.viewBounds.left*2 - frb.viewBounds.left;
            var starty = Math.random() * frb.viewBounds.top*2 - frb.viewBounds.top*2;
            var line = frb.SpriteManager.addLine(
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

            if (!frb.InputManager.keyboard.keyDown("S")) {
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

            if (line.start.y < frb.viewBounds.bottom) {
                line.start.y = frb.viewBounds.top - line.vec.y;
                line.end.y = frb.viewBounds.top;
            }
            if (line.end.x < frb.viewBounds.left) {
                line.start.x = frb.viewBounds.right - line.vec.x;
                line.end.x = frb.viewBounds.right;
            }

        };
        
    }
});
