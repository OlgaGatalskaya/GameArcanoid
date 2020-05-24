game.platform = {
    x: 280,
    y: 300,
    width: 100,
    height: 14,
    velocity: 6, //показатель допустимой скорости
    dx: 0,  //смещение по оси в данный момент времени
    ball: game.ball,
    fire() {
        if (this.ball)
        this.ball.start();
        this.ball = null;
    },
    start (direction) {
        if(direction === KEYS.LEFT) {
            this.dx = -this.velocity
        } else if (direction === KEYS.RIGHT) {
            this.dx = this.velocity;
        }

    },
    stop() {
        this.dx = 0;
    },
    move() {
        if (this.dx) {
            this.x += this.dx;
            if(this.ball) {
            this.ball.x += this.dx;
            }
        } 

    },
    getTouchOffset(x) {
       let diff = (this.x + this.width) - x //правая сторона платформы - координата косания мяча
       let offset = this.width - diff; // левая сторона платформы
       let result = offset * 2 / this.width;
       return result - 1; //результат от центра

    },
    platformInside() {
        let x = this.x + this.dx;
        
        let platformLeft = x;
        let platformRight = platformLeft + this.width;

        let worldLeft = 0;
        let worldRight = game.width;

        if (platformLeft < worldLeft) {
            this.x = 0;
            
        } else if (platformRight > worldRight) {
            this.x = worldRight - this.width;
           
        }


    }
}