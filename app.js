class Moveable {
    constructor() {
        this.position = {x: 0, y: 0}; // If drawn this is likely going to be a collection of shapes and positions
        this.shapes = [];
        this.width = 0; // TODO: static currently to test if it initialiseBadShips works
        this.height = 0; // TODO: static currently to test if it initialiseBadShips works
    }

    // Update internal x y values
    move(deltaX, deltaY) {
        for (let shape of this.shapes) {
            shape.oldX = shape.x;
            shape.oldY = shape.y;
            shape.x += deltaX;
            shape.y += deltaY;
        }
    }

    randomColor() {
        // gets random colour
        return "#"+((1<<24)*Math.random()|0).toString(16);
    }

    // changeShipColor() {
    //     // change color of ship depending on which side is hit
    //     if(this.isAtExtremity('left')) {
    //         return 'blue';
    //     } else if (this.isAtExtremity('right')){
    //         return 'red';
    //     } else {
    //         return 'white';
    //     }
    // }

    kill(context) {
        // Clear existing draw of object
        for (let shape of this.shapes) {
            context.clearRect(shape.x, shape.y, shape.width, shape.height);
        }

        // No need to explicity destroy instance but ensure no references to it exist if it needs to be destroyed - garbage collection
        
    }

    draw(context) {
        for (let shape of this.shapes) {
            context.clearRect(shape.oldX, shape.oldY, shape.width, shape.height);
        }

        // Draw in new position
        for (let shape of this.shapes) {
            context.fillStyle = shape.color ? shape.color : this.randomColor();
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
    }

    isAtExtremity(direction, canvasElement) {
        let Values = '';
        let Value = '';

        switch(direction) {
            case 'left':
                Values = this.shapes.map(shape => shape.x);
                Value = Math.floor(...Values);
                
                if (Value <= 0) {
                    this.lastExtremity = 'left';
                    return true;
                } else {
                    return false;
                };

            case 'right':
                Values = this.shapes.map(shape => shape.x + shape.width);
                Value = Math.max(...Values);
                
                if (Value >= this.game.canvasElement.width) {
                    this.lastExtremity = 'right';
                    return true;
                } else {
                    return false;
                }

            case 'top':
                Values = this.shapes.map(shape => shape.y);
                Value = Math.max(...Values);
                if (Value <= 0) {
                    this.lastExtremity = 'top';
                    return true;
                } else {
                    return false;
                }

            case 'bottom':
                Values = this.shapes.map(shape => shape.y + shape.height);
                Value = Math.max(...Values);
                if (Value >= canvasElement.height) {
                    this.lastExtremity = 'bottom';
                    return true;
                } else {
                    return false;
                }

            default:
            break;
        }
        
    }
}

class Ship extends Moveable {
    constructor() {
        super();
        this.game = game;
        this.bullet = '';
        this.bulletInPlay = false;
        this.width = 80; // TODO: static currently to test if it initialiseBadShips works
        this.height = 80; // TODO: static currently to test if it 
    }

    fireBullet() {
        if (!this.bulletInPlay) {
            let bullet = this.game.createBullet(this);
            // This does not exactly identify bullet exit point and also needs to be more readable
            this.game.moveObject(bullet, Math.floor(...this.shapes.map(shape => shape.x)), Math.floor(...this.shapes.map(shape => shape.y)));
            this.game.drawObject(bullet);
        }
    }
}

class GoodShip extends Ship {
    constructor() {
        super();
        this.shapes = [
            {
                x: 20,
                y: 40,
                width: 60,
                height: 20,
                color: '#21c521'
            },
            {
                x: 40,
                y: 20,
                width: 20,
                height: 20,
                color: '#21c521'
            },
            {
                x: 20,
                y: 55,
                width: 20,
                height: 20,
                color: '#21c521'
            },
            {
                x: 60,
                y: 55,
                width: 20,
                height: 20,
                color: '#21c521'
            }
        ];
        this.shootTrigger = 'Space';
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    destroy() {
        for (let interval of this.intervals) {
            clearInterval(interval);
            removeEventListener('keydown', this.handleKeyDown);
            removeEventListener('keyup', this.handleKeyUp);
        }
    }

    addEventListeners() {
        this.intervals = [];
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (event.code === this.shootTrigger) {
            this.fireBullet();
            if (!this.intervals[event.keyCode]) {
                this.intervals[event.keyCode] = setInterval(() => this.fireBullet(), 100);
            }
        } else if (event.code === 'ArrowLeft') {
            if (!this.intervals[event.keyCode]) {
                this.intervals[event.keyCode] = setInterval(() => {
                    this.game.moveObject(this, -1, 0);
                    this.game.drawObject(this);
                }, 1000/300);
            }
        } else if (event.code === 'ArrowRight') {
            if (!this.intervals[event.keyCode]) {
                this.intervals[event.keyCode] = setInterval(() => {
                    this.game.moveObject(this,1, 0);
                    this.game.drawObject(this);
                }, 1000/300);
            }
        }
    };

    handleKeyUp(event) {
        event.preventDefault();
        clearInterval(this.intervals[event.keyCode]);
        this.intervals[event.keyCode] = false;
    };
}

class BadShip extends Ship {
    constructor() {
        super();
        this.shapes = [
            {
                x: 20,
                y: 32,
                width: 60,
                height: 8,
                color: 'white'
            },
            {
                x: 40,
                y: 28,
                width: 20,
                height: 20,
                color: 'white'
            },
            {
                x: 20,
                y: 20,
                width: 12,
                height: 20,
                color: 'white'
            },
            {
                x: 68,
                y: 20,
                width: 12,
                height: 20,
                color: 'white'
            }
        ];
    }
}

class Bullet extends Moveable {
    constructor(owner) {
        super();
        this.shapes = [
            {
                x: 20,
                y: 10,
                width: 4,
                height: 28
            },
        ];
        this.owner = owner;
    }
}

class Rock extends Moveable {
    constructor(offSet, whiteSpace, width) {
        super()
        this.shapes = this.getShapes(offSet, whiteSpace, width);
        this.particleWidth = 4;
        this.particleHeight = 45;
        this.width = 4*20;
        //this.height = ;
    }

    getShapes(offSet, whiteSpace, width) {
        let shapes = new Array;
        for (let i = 0; i < 20; i++) {
            shapes.push({
                x: (i*4)+(offSet*width)+(whiteSpace*offSet*width),
                y: 800,
                width: 4,
                height: 45
            });
        }

        return shapes;
    }

    draw(context) {
        // Draw in new position
        for (let shape of this.shapes) {
            context.fillStyle = '#21c521';
            context.fillRect(
                shape.x,
                shape.y,
                shape.width,
                shape.height);
        }
    }

    takeDamageFrom(object, context) {
        if (object instanceof Bullet) {
            let damageTaken = false;
            for (let shape of this.shapes) {
                if (this.isColliding(shape, object)) {
                    context.clearRect(shape.x, shape.y, shape.width, shape.height);
                    this.shapes.splice(this.shapes.indexOf(shape), 1);
                    damageTaken = true
                }
            }
            return damageTaken;
        }
    }

    isColliding(shape, object2) {
        let colliding = false;

        for (let j = 0; j < object2.shapes.length; j++) {
            if (!(
                shape.x > (object2.shapes[j].x + object2.shapes[j].width) || 
                (shape.x + shape.width) < object2.shapes[j].x || 
                shape.y > (object2.shapes[j].y + object2.shapes[j].height) ||
                (shape.y + shape.height) <  object2.shapes[j].y
            )) { colliding = true; break; }
        }

        return colliding;
    }
}

class SpaceInvadersGame {
    constructor(canvasId) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvasContext = this.canvasElement.getContext("2d");
        this.frameRate = 50;
        this.canvasWidth = 1000;
        this.badShipRows = 5;
        this.badShipsPerRow = 7;
        this.badShipDirection= '';
        this.badShipsBulletsPerSecond = 2;
        this.badShips = [];
        this.bullets =[];
        this.numRocks = 5;
        this.rockWhiteSpace = 1;
        this.rocks = [];
    }

    newGame() {
        this.initialiseBadShips();
        this.players = [new GoodShip(this)];
        this.initialiseGoodShip(this.players[0]);
        this.initialiseRocks();
    }

    startGame() {
        this.runGame();
    }

    runGame() {
        // Arrow funciton here will ensure this is bound to SpaceInvadersGame and not window.
        setInterval(() => {
            this.moveBadShips();
            this.checkForCollisions();
        }, 1000/this.frameRate);

        setInterval(() => {
            this.shootBadBullets();
        }, 1000);
        
        setInterval(() => {
            this.moveBullets('goodShip');
            this.checkForCollisions();
        }, 1000/(this.frameRate*16));

        setInterval(() => {
            this.moveBullets('badShip');
            this.checkForCollisions();
        }, 1000/(this.frameRate));
    }

    moveObject(object, deltaX, deltaY) {
        let canvasContext = this.canvasContext
        object.move(deltaX, deltaY, canvasContext);
       // this.drawObject(object);
    }

    drawObject(object) {
        let canvasContext = this.canvasContext
        object.draw(canvasContext);
    }

    destroyObject(object) {
        let canvasContext = this.canvasContext

        if (object instanceof Rock) {
            // let rockIndex = this.rocks.indexOf(object);
            // this.rocks.splice(bulletIndex, 1);
            // This is harder depending on what is impacting rock, see Trello task
        } else if (object instanceof Bullet) {
            object.kill(canvasContext);
            object.owner.bulletInPlay = false;
            object.owner.bullet = '';
            let bulletIndex = this.bullets.indexOf(object);
            this.bullets.splice(bulletIndex, 1);
        } else if (object instanceof BadShip) {
            object.kill(canvasContext);
            // Find badShip in this.badShips and remove
            for (let i = 0; i < this.badShips.length; i++) {
                if (this.badShips[i].indexOf(object) >= 0) {
                    let badShipIndex = this.badShips[i].indexOf(object);
                    this.badShips[i].splice(badShipIndex, 1);
                    break;
                }
            }
        } else if (object instanceof GoodShip) {
            object.kill(canvasContext);
            object.destroy();
            let goodShipIndex = this.players.indexOf(object);
            this.players.splice(goodShipIndex, 1);
        }
    }

    testCollision() {
        let testShip = new GoodShip(this);
        this.moveObject(testShip, 0, 125);
        this.drawObject(testShip);
        this.isColliding(testShip, this.players[0]);
    }

    isColliding(object1, object2) {
        let colliding = false;

        let shapes1 = object1.shapes;
        let shapes2 = object2.shapes;

        for (let i = 0; i < shapes1.length; i++) {
            for (let j = 0; j < shapes2.length; j++) {
                if (!(
                    shapes1[i].x > (shapes2[j].x + shapes2[j].width) || 
                    (shapes1[i].x + shapes1[i].width) < shapes2[j].x || 
                    shapes1[i].y > (shapes2[j].y + shapes2[j].height) ||
                    (shapes1[i].y + shapes1[i].height) < shapes2[j].y
                )) { colliding = true;  break; }
            }
            if (colliding) { break; }
        }

        return colliding;
    }

    checkForCollisions() {
        for (let bullet of this.bullets) {
            let collision = false;
            
            // TODO:  Break loops if impacts occurs
            for (let rock of this.rocks) {
                if (this.isColliding(bullet, rock)) {
                    // bullet + rock colliding
                    let passThrough = !rock.takeDamageFrom(bullet, this.canvasContext);
                    if (!passThrough) {
                        this.destroyObject(bullet);
                    }

                    collision = true;
                    break;
                } else {
                    continue;
                }
            }
            if (collision) { continue; }

            for (let row of this.badShips) {
                for (let badShip of row) {
                    if (this.isColliding(bullet, badShip)) {
                        if (bullet.owner instanceof BadShip) {
                            badShip.draw(this.canvasContext);
                            continue;
                        } else if (bullet.owner instanceof GoodShip) {
                            // goodShip bullet + badShip colliding
                            this.destroyObject(badShip);
                            this.destroyObject(bullet);
                            // update score
                            // remove ship
                            // remove bullet
                            // enable shoot addEventListener
                        }
                        collision = true;
                        break;
                    } else {
                        continue;
                    }
                }
                if (collision) { break; }
            }

            if (collision) { continue; }

            for (let goodShip of this.players) {
                if (this.isColliding(bullet, goodShip)) {
                    if (bullet.owner instanceof BadShip) {
                        // badShip bullet + goodShip colliding
                        this.destroyObject(goodShip);
                        this.destroyObject(bullet);
                        // remove ship
                        // lose life
                        // check if game is over
                    } else if (bullet.owner instanceof GoodShip) {
                        // do nothing - this shouldnt be possible
                        goodShip.draw(this.canvasContext);
                        continue;
                    }
                    collision = true;
                    break;
                } else {
                    continue;
                }
                
            }

            if (collision) { continue; }

            if (bullet.isAtExtremity('top', this.canvasElement) || bullet.isAtExtremity('bottom', this.canvasElement)) {
                this.destroyObject(bullet);
            }

        }

        for (let row of this.badShips) {
            for (let badShip of row) {

                for (let rock of this.rocks) {
                    if (this.isColliding(badShip, rock)) {
                        // badShip bullet + rock colliding
                        // damage rock precisely where positions intersect
                    } else {
                        continue;
                    }
                }

            }
        }
}

    // Draw a grid of badShips
    initialiseBadShips() {
        for (let i = 0; i < this.badShipRows; i++) { // Loop for number of rows required
            this.badShips[i] = []; // Initialise row in array
            for (let j = 0; j < this.badShipsPerRow; j ++) { // Loop for ships required on each row
                let newShip = new BadShip(this);
                this.moveObject(newShip, (newShip.width*j)+5, (newShip.height*i)+150); // For initialise delta is set relative to 0, 0. newShip.width/height*j/i should offset from the previous ship and produce a gutter
                newShip.draw(this.canvasContext);
                this.badShips[i].push(newShip);
            }  
        }
    }

    initialiseGoodShip(goodShip) {
        goodShip.addEventListeners();
        this.moveObject(goodShip, (this.canvasElement.width/2)-(goodShip.width/2), (this.canvasElement.height)-(goodShip.height+10));
        this.drawObject(goodShip);
    }

    // Lower levels will have a central rock protecting goodPlayer spawn point
    // Higher levels will not have a central
    // Draw from middle and switch between positive/negative offset
    initialiseRocks() {
        let canvasCentre = this.canvasElement.width/2;
        let canvas = this.canvasContext;
        let rockWidth = 80;
        let counter = 0;
        let offSetNegative = false;

        for (let i = 0; i < this.numRocks; i++) {
            let offSet = offSetNegative ? -counter : counter;
            let rock = new Rock(offSet, this.rockWhiteSpace, rockWidth);
            rock.move(canvasCentre-(rockWidth/2), 0);
            this.rocks.push(rock);
            rock.draw(canvas);

            if (offSetNegative) { counter++; } 

            if (i !== 0) {
                offSetNegative = !offSetNegative;
            } else {
                counter++;
            }
        }
    }

    createBullet(ship) {
        let bullet = new Bullet;
        bullet.owner = ship;
        ship.bulletInPlay = true;
        this.bullets.push(bullet);
        return bullet;
    }

    // This currently just moves ships right --> TODO: hit edge of canvas and come back
    moveBadShips() {
        for (let row of this.badShips) {
            // As badShips are destroyed rows become empty.
            if (row.length > 0) {
                let firstShip = row[0];
                let lastShip = row[row.length-1];
                let maxShipHeight = 40; //Math.max(row.map(ship => ship.height));

                // Ships have hit left edge of canvas, deltaX needs to be +1
                if (firstShip.isAtExtremity('left', this.canvasElement)) {
                    this.badShipDirection = true;
                // Ships have hit right side of canvas, deltaX needs to be -1
                } else if (lastShip.isAtExtremity('right', this.canvasElement)) {
                    this.badShipDirection = false;
                }

                let deltaX = this.badShipDirection ? 1 : -1;
                let deltaY = 0;

                for (let ship of row) {
                    this.moveObject(ship, deltaX, deltaY);
                    this.drawObject(ship);
                }
            }
        }
    }

    moveBullets(ownerType) {
        for (let bullet of this.bullets) {
            if (ownerType == 'badShip' && bullet.owner instanceof BadShip) {
                this.moveObject(bullet, 0, 5);
                this.drawObject(bullet);
            } else if (ownerType == 'goodShip' && bullet.owner instanceof GoodShip) {
                this.moveObject(bullet, 0, -5);
                this.drawObject(bullet);
            }
        }
    }

    // shoot bullets from X random bad ships
    shootBadBullets() {
        for (let i = 1; i <= this.badShipsBulletsPerSecond; i++) {
            let rowIndex = Math.floor(Math.random()*this.badShips.length);
            let shipIndex = Math.floor(Math.random()*this.badShips[rowIndex].length);
            let ship = this.badShips[rowIndex][shipIndex];
            // badShip may have already been destroyed
            if (ship) { ship.fireBullet(); }
        }
    }
}