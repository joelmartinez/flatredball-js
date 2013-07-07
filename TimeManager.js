var flatRedBall = (function (frb) {
    frb.TimeManager = {
        start: new Date(),
        last: new Date(),
        secondDifference: 0,
        secondDifferenceFromStart: 0,
        update: function() {
            var startMilli = this.start.getTime();
            var lastMilli = this.last.getTime();
            this.last = new Date();
            var nowMilli = this.last.getTime();
            this.secondDifference = (nowMilli - lastMilli) / 1000;
            this.secondDifferenceFromStart = (nowMilli - startMilli) / 1000;
        }
    };

    return frb;
}(flatRedBall || {}))
