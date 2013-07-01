var game = frb.start({
    init: function(engine) {
        game.line1 = engine.SpriteManager.addLine(0,0, 20,20);
        game.line2 = engine.SpriteManager.addLine(10,10, 10, -50);
        
        game.line2.lineWidth = 10;
        game.line2.lineColor = "red";

        
    },
    update: function() {

        game.line1.end.x = game.InputManager.mouse.worldX;
        game.line1.end.y = game.InputManager.mouse.worldY;
        
    }
});