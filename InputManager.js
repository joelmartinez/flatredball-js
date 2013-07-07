var flatRedBall = (function (frb) {
    frb.InputManager = {
        mouse: {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            pressed: {},
            buttonDown:function(button) {
                return frb.InputManager.mouse.pressed[frb.InputManager.buttonCodes[button]] === true;
            }
        },

        keyboard: {
            pressed: {},
            keyDown: function(key) {
                return frb.InputManager.keyboard.pressed[frb.InputManager.chars[key]] === true;
            }
        },

        keys: { "Backspace": 8, "Tab": 9, "Enter": 13, "Shift": 16, "Ctrl": 17, "Alt": 18, "PauseBreak": 19, "CapsLock": 20, "Esc": 27, "Space": 32, "PageUp": 33, "PageDown": 34, "End": 35, "Home": 36, "Left": 37, "Up": 38, "Right": 39, "Down": 40, "Insert": 45, "Delete": 46, "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57, "A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72, "I": 73, "J": 74, "K": 75, "L": 76, "M": 77, "N": 78, "O": 79, "P": 80, "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88, "Y": 89, "Z": 90, "Windows": 91, "RightClick": 93, "Num0": 96, "Num1": 97, "Num2": 98, "Num3": 99, "Num4": 100, "Num5": 101, "Num6": 102, "Num7": 103, "Num8": 104, "Num9": 105, "Num*": 106, "Num+": 107, "Num-": 109, "Num.": 110, "Num/": 111, "F1": 112, "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117, "F7": 118, "F8": 119, "F9": 120, "F10": 121, "F11": 122, "F12": 123, "NumLock": 144, "ScrollLock": 145, "MyComputer": 182, "MyCalculator": 183, ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192, "[": 219, "\\": 220, "]": 221, "'": 222 },
        chars: {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"PauseBreak",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Windows",93:"RightClick",96:"Num0",97:"Num1",98:"Num2",99:"Num3",100:"Num4",101:"Num5",102:"Num6",103:"Num7",104:"Num8",105:"Num9",106:"Num*",107:"Num+",109:"Num-",110:"Num.",111:"Num/",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",182:"MyComputer",183:"MyCalculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},
        buttons: {"Left":0, "Middle": 1, "Right":2},
        buttonCodes: {0:"Left", 1:"Middle", 2:"Right"},

        update: function () {
            var left = frb.SpriteManager.camera.x - (frb.graphics.width / 2);
            var top = frb.MathHelper.invert(frb.SpriteManager.camera.y) -(frb.graphics.height / 2);
            this.mouse.worldX = left + this.mouse.x;
            this.mouse.worldY = frb.MathHelper.invert(top + this.mouse.y);
        },

        handleKeyDown:function(evt) {
            var keyName = frb.InputManager.chars[evt.keyCode];

            if(keyName === "Space" && frb.options.disableSpaceBarScroll === true) {
                evt.preventDefault();
            }

            frb.InputManager.keyboard.pressed[keyName] = true;
        },

        handleKeyUp:function(evt) {
            var keyName = frb.InputManager.chars[evt.keyCode];
            frb.InputManager.keyboard.pressed[keyName] = false;
        },

        handleMouseDown:function(evt) {
            // TODO: IE sends bitmask for buttonCodes, need IE specific implementation
            var buttonName = frb.InputManager.buttonCodes[evt.button];
            frb.InputManager.mouse.pressed[buttonName] = true;
        },

        handleMouseUp:function(evt) {
            // TODO: IE sends bitmask for buttonCodes, need IE specific implementation
            var buttonName = frb.InputManager.buttonCodes[evt.button];
            frb.InputManager.mouse.pressed[buttonName] = false;
        },

        handleMouseMove:function(evt) {
            frb.InputManager.mouse.x = evt.x - (frb.graphics.width / 2);
            frb.InputManager.mouse.y = frb.MathHelper.invert(evt.y) + (frb.graphics.width / 2);
            //console.log("Mouse: " + frb.InputManager.mouse.x + "," + frb.InputManager.mouse.y);
        }
    };

    return frb;
}(flatRedBall || {}))
