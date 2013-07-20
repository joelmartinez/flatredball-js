var flatRedBall = (function (frb) {

        frb.PositionedObject = Class.extend({

            init: function () {
                this.alpha = 1;

                // absolute values
                this.position = {x: 0,y: 0,z: 0};
                this.velocity = {x: 0,y: 0,z: 0};
                this.acceleration = {x: 0,y: 0,z: 0};
                this.rotation = {x: 0,y: 0,z: 0};
                this.rotationVelocity = {x: 0,y: 0,z: 0};

                // relative values
                this.relativePosition = {x: 0,y: 0,z: 0};
                this.relativeVelocity = {x: 0,y: 0,z: 0};
                this.relativeAcceleration = {x: 0,y: 0,z: 0};
                this.relativeRotation = {x: 0,y: 0,z: 0};
                this.relativeRotationVelocity = {x: 0,y: 0,z: 0};

                this.listsBelongingTo = [];
                this.children = new frb.AttachableList();
                this.parent = null;
                this.xTarget = 0;
                this.yTarget = 0;
            },

            update: function () {
                var deltaTime = frb.TimeManager.secondDifference;
                var deltaSquaredDividedByTwo = deltaTime * deltaTime / 2;

                this.relativePosition.x += (this.relativeVelocity.x * deltaTime) + (this.relativeAcceleration.x * deltaSquaredDividedByTwo);
                this.relativePosition.y += (this.relativeVelocity.y * deltaTime) + (this.relativeAcceleration.y * deltaSquaredDividedByTwo);
                this.relativePosition.z += (this.relativeVelocity.z * deltaTime) + (this.relativeAcceleration.z * deltaSquaredDividedByTwo);

                this.relativeRotation.x + this.relativeRotationVelocity.x * deltaTime;
                this.relativeRotation.y + this.relativeRotationVelocity.y * deltaTime;
                this.relativeRotation.z + this.relativeRotationVelocity.z * deltaTime;

                // if no parent we only use absolute values
                if(this.parent === null || this.parent === undefined) {
                    this.position.x += (this.velocity.x * deltaTime) + (this.acceleration.x * deltaSquaredDividedByTwo);
                    this.position.y += (this.velocity.y * deltaTime) + (this.acceleration.y * deltaSquaredDividedByTwo);
                    this.position.z += (this.velocity.z * deltaTime) + (this.acceleration.z * deltaSquaredDividedByTwo);

                    this.rotation.x += this.rotationVelocity.x * deltaTime;
                    this.rotation.y += this.rotationVelocity.y * deltaTime;
                    this.rotation.z += this.rotationVelocity.z * deltaTime;
                }
                // otherwise we use relative values, taking the parent into account
                else {
                    this.position.x = this.parent.position.x + this.relativePosition.x;
                    this.position.y = this.parent.position.y + this.relativePosition.y;
                    this.position.z = this.parent.position.z + this.relativePosition.z;

                    this.rotation.x = this.parent.rotation.x + this.relativeRotation.x;
                    this.rotation.y = this.parent.rotation.y + this.relativeRotation.y;
                    this.rotation.z = this.parent.rotation.z + this.relativeRotation.z;
                }

                this.velocity.x += (this.acceleration.x * deltaTime);
                this.velocity.y += (this.acceleration.x * deltaTime);
                this.velocity.z += (this.acceleration.x * deltaTime);

                this.relativeVelocity.x += (this.relativeAcceleration.x * deltaTime);
                this.relativeVelocity.z += (this.relativeAcceleration.x * deltaTime);
                this.relativeVelocity.z += (this.relativeAcceleration.x * deltaTime);


                this.xTarget = this.position.x;
                this.yTarget = frb.MathHelper.invert(this.position.y);
                this.alpha = frb.MathHelper.clamp(this.alpha, 0, 1);

                // update children
                if(this.children.length > 0) {
                    for(var i = 0; i < this.children.length; i++) {
                        this.children.get(i).update();
                    }
                }
            },

            attachTo:function(target, changeRelative) {
                if(!(target instanceof frb.PositionedObject)) {
                    throw "Cannot attach to a non-positioned object!";
                }

                if(changeRelative === true) {
                    this.relativePosition = this.position;
                    this.relativeAcceleration = this.acceleration;
                    this.relativeVelocity = this.velocity;
                    this.relativeRotation = this.rotation;
                    this.relativeRotationVelocity = this.rotationVelocity;
                }

                this.parent = target;
                target.children.add(this);
            },

            removeSelfFromLists: function () {
                // todo: remove self from all lists
            }
        })
        ;

        return frb;
    }
        (flatRedBall || {})
        )
    ;