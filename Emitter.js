var flatRedBall = (function (frb) {
    frb.Emitter = Class.extend({

        init: function () {
            this.pool = new frb.ResourcePool();
            this.position = {
                x: 0,
                y: 0
            }
        },

        items: function() {
            return this.pool.active;
        },

        emit: function(addFunction) {
            var self = this;
            var newParticle = this.pool.add(addFunction);
            newParticle.alpha = 1;
            newParticle.x = this.position.x;
            newParticle.y = this.position.y;

            // TODO: temp for testing
            var fadeRate = 0.5;
            newParticle.velocity.x = Math.random() * 100;
            newParticle.velocity.y = Math.random() * 100;
            newParticle.rotation.z = Math.random() * flatRedBall.MathHelper.pi;
            newParticle.rotationVelocity.z = Math.random() * 5 - 2.5;
            newParticle.customActivity = function() {
                newParticle.alpha -= fadeRate * frb.TimeManager.secondDifference;
                if(newParticle.alpha <= 0) {
                    newParticle.alpha = 0;
                    self.pool.return(newParticle);
                }
            }

            return newParticle;
        },

        emitSprite: function(texture) {
            return this.emit(function() {
                return frb.SpriteManager.add(texture);
            })
        }

    });

    return frb;
}(flatRedBall || {}))
