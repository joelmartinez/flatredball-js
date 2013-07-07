New-Item -ItemType file "frb.js" -force | out-null

$files = "Class.js", "MathHelper.js", "PositionedObject.js", "ResourcePool.js", "attachablelist.js", "Camera.js", "Emitter.js", "InputManager.js", "Sprite.js", "InputManager.js", "SpriteManager.js", "TimeManager.js", "FlatRedBall.js"

foreach($f in $files)
{
	$contents = cat $f
	add-content "frb.js" $contents
}