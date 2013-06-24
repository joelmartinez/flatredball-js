var flatRedBall = (function (frb) {

    frb.paused = false;
    frb.focused = false;
    frb.context = null;
    frb.gameTimer = null;
    frb.graphics = {
        background: "#6495ED",
        fps: 60,
        width: 0,
        height: 0
    };
    frb.viewBounds = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    frb.options = {
        disableSpaceBarScroll: true,
        disableRightClick: true
    }


    frb.init = function (canvas) {
        if (canvas === undefined || canvas === null) {
            throw "Invalid canvas provided.";
        }
        else {
            frb.context = canvas.getContext("2d");
            frb.graphics.width = frb.context.canvas.width;
            frb.graphics.height = frb.context.canvas.height;

            frb.initializeInput(canvas);

            frb.gameTimer = setInterval(frb.run, 1000 / frb.graphics.fps);
            console.log("Engine initialized.");
        }
    };

    frb.initializeInput = function(renderSurface) {

        // tabindex is required for an element to get focus and listen for keyboard events
        if (renderSurface.hasAttribute('tabindex') === false) {
            renderSurface.setAttribute('tabindex', 0);
        }

        // listeners call into InputManager and provide updates
        renderSurface.addEventListener('keydown', frb.InputManager.handleKeyDown, false);
        renderSurface.addEventListener('keyup', frb.InputManager.handleKeyUp, false);
        renderSurface.addEventListener('mousedown', frb.InputManager.handleMouseDown, false);
        renderSurface.addEventListener('mouseup', frb.InputManager.handleMouseUp, false);
        renderSurface.addEventListener('mousemove', frb.InputManager.handleMouseMove, false);

        // notify the game whether it has focus or not
        renderSurface.addEventListener('blur', function () {
            frb.focused = false;
        }, false);
        renderSurface.addEventListener('focus', function() {
            frb.focused = true;
        }, false);

        // prevent right click
        if(frb.options.disableRightClick === true) {
            renderSurface.setAttribute('oncontextmenu', 'return false;');
        }
    };

    frb.run = function () {
        frb.update();
        frb.draw();
    };

    frb.update = function () {
        frb.InputManager.update();
        frb.TimeManager.update();
        frb.SpriteManager.update();
        frb.customActivity();
    };

    frb.draw = function () {
        frb.context.fillStyle = frb.graphics.background;
        frb.context.fillRect(0, 0, frb.graphics.width, frb.graphics.height);
        frb.SpriteManager.draw();
    };

    frb.customActivity = function () {
        // intended to be overridden with custom logic
    };

    frb.updateViewBounds = function () {
        var left = frb.SpriteManager.camera.x - (frb.graphics.width / 2);
        var top = frb.SpriteManager.camera.y + (frb.graphics.height / 2);
        var bottom = top - frb.graphics.height;
        var right = left + frb.graphics.width;
        frb.viewBounds.top = top;
        frb.viewBounds.right = right;
        frb.viewBounds.bottom = bottom;
        frb.viewBounds.left = left;
    }

    return frb;
}(flatRedBall || {}));