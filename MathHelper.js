var flatRedBall = (function(frb) {
    frb.MathHelper = {
        e:Math.E,
        log10E: 0.4342945,
        log2E: 1.442695,
        pi: Math.PI,
        piOver2: (Math.PI / 2.0),
        piOver4: (Math.PI / 4.0),
        twoPi: (Math.PI * 2.0),

        invert: function (value) {
            return 0 - value;
        },

        clamp: function (value, min, max) {
            if (value < min) return min;
            else if (value > max) return max;
            else return value;
        },

        lerp: function(value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        },

        toDegrees: function(radians) {
            return (radians * 57.295779513082320876798154814105);
        },

        toRadians: function(degrees) {
            return (degrees * 0.017453292519943295769236907684886);
        }
    };
    return frb;

}(flatRedBall || {}));