frb.start({
    clearColor:"black",
    init: function() {
        window.lines = new Array();

        window.topbound = 400;
        window.bottombound = -400;

        for (var i = 0; i < 50; i++) {
            var startx = Math.random() * window.topbound*2 - window.topbound;
            var starty = Math.random() * window.topbound*2 - window.topbound;
            var line = frb.SpriteManager.addLine(startx,starty,startx-4-(Math.random() * 1-1),starty-28);
            line.lineColor = "#ccc";
            line.lineWidth = 4;
            line.vec = {x: line.end.x-line.start.x, y: line.end.y-line.start.y, speed: 40 + Math.random() * 10};  

            window.lines.push(line);
        };               


        window.line = line;
    },
    update: function() {
        var top = window.topbound;
        var bottom = window.bottombound;

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

            if (line.start.y < bottom) {
                line.start.y = top - line.vec.y;
                line.end.y = top;
            }
            if (line.end.x < bottom) {
                line.start.x = top - line.vec.x;
                line.end.x = top;
            }

        };
        
    }
});