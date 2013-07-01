
var game = frb.start({
    init: function() {
        window.emitter = new frb.Emitter(game);
    },
    update: function() {

        emitter.position.x = game.InputManager.mouse.worldX;
        emitter.position.y = game.InputManager.mouse.worldY;
        

        // recycle particles if necessary
        var list = emitter.items();
        for (var i = 0; i < list.length; i++) {
            var particle = list.get(i);
            if (particle.alpha <= 0) { 
                emitter.pool.return(particle);
                continue;
            }

            particle.alpha -= 0.05;
        };

        var newParticle = emitter.emitCircle(10);//emitSprite("Frblogo128");


        // initialize particle

        var xRange = 100;
        var gravity = -150.5;
        var direction = {x: (Math.random() * xRange) - (xRange/2), y: Math.random() * 400};

        newParticle.xVelocity = direction.x;
        newParticle.yVelocity = direction.y;

        newParticle.yAcceleration = gravity;

        
    }
});

window.game = game;