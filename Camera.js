var flatRedBall = (function (frb) {
    frb.Camera = Class.extend({
        init:function() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        },

        start: function() {
            frb.context.save();
            frb.context.translate(frb.MathHelper.invert(this.x) + frb.graphics.width / 2, this.y + frb.graphics.height / 2);
        },

        end: function() {
            frb.context.restore();
        }
    });

    return frb;
}(flatRedBall || {}))
