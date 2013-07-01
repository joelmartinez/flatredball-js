var game = frb.start({
    clearColor:"black",
    init: function(engine) {
        window.tiles = new Array();

        window.reference = engine.SpriteManager.add("groundtile");
        window.reference.alpha=0;

    },
    update: function() {
        // update tiles
        if (window.reference.width > 0) { 
            // only do this after we're done loading the reference sprite
            var numTilesRequired = Math.ceil(game.graphics.width / window.reference.width)+1;

            if (window.tiles.length < numTilesRequired) {
                for (var i = 0; i < numTilesRequired; i++) {
                    var tile = game.SpriteManager.add("groundtile");
                    tile.y = game.viewBounds.bottom + tile.height - tile.height/2;
                    tile.x = i * tile.height - game.graphics.width/2;
                    window.tiles.push(tile);
                };

            }
        }
        
    }
});
