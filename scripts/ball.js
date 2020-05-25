game.ball = {
    x: game.width / 2 - 20,
    y: game.height - 85,
    width: 40,
    height: 40,
    dy: 0,
    dx: 0,
    velocity: 10,
    frame: 0,
    start() {
        this.dy = -this.velocity;
        this.dx = game.random(-this.velocity, +this.velocity);

       /* setInterval(() => {
            ++this.frame;
            if(this.frame > 3) {
                this.frame = 0;
            }
        }, 100);*/

    },
    move() {
        if (this.dy) {
            this.y += this.dy;
            
        }
        if(this.dx) {
            this.x += this.dx
        }
    },
    collide(element){
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        if(
        x + this.width > element.x && 
        x < element.x + element.width &&
        y + this.height > element.y &&
        y < element.y + element.height) {
            return true;
        } 
        return false;
    },
    collideWorldBounds() {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        //получаем координаты мяча
        let ballLeft = x;
        let ballRight = ballLeft + this.width;
        let ballTop = y;
        let ballBottom = ballTop + this.height;

        //получаем координаты сторон
        let worldLeft = 0;
        let worldRight = game.width;
        let worldTop = 0;
        let worldBottom = game.height;

        if (ballLeft < worldLeft) {
            this.x = 0;
            this.dx = this.velocity;
            game.sounds.bump.play();
        } else if (ballRight > worldRight ){
            this.x = worldRight - this.width;
            this.dx = -this.velocity;
            game.sounds.bump.play();
        } else if (ballTop < worldTop) {
            this.dy = this.velocity;
            this.y = 0;
            game.sounds.bump.play();
        } else if (ballBottom > worldBottom) {
            game.end('Game Over');
            
            
        }
    },
    bumpBlock(block) {
        this.dy = -this.dy; //летит с тем же углом при отскоке
        block.active = false;


    },
    bumpPlatform(platform) {
        if (platform.dx) {
        this.x += platform.dx
        }
        if(this.dy > 0) {
            this.dy = -this.velocity; //чтобы мяч отталкивался только вверх
            let touchX = this.x + this.width / 2; // координаты центра мяча
            this.dx = this.velocity * platform.getTouchOffset(touchX);
        }
        
    }
    
};