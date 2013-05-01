frb.start({
    init: function() {
        frb.line1 = frb.SpriteManager.addLine(0,0, 20,20);

        frb.line2 = frb.SpriteManager.addLine(10,10, 10, -50);
        frb.line2.lineWidth = 10;
        frb.line2.lineColor = "red";

        
    },
    update: function() {

        frb.line1.end.x = frb.InputManager.mouse.worldX;
        frb.line1.end.y = frb.InputManager.mouse.worldY;
        
    }
});