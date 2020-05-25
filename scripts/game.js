const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
}


let game = {
    ctx: null,
    platform: null,
    ball: null,
    blocks: [],
    rows: 6,
    cols: 10,
    width: 1280,
    height: 720,
    running: true,
    score: 0,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null,
    }, 
    sounds: {
        bump: null,
    },
    initCanvasSize() {
        let realWidth = window.innerWidth * window.devicePixelRatio; // полностью вписываем ширину
        let realHeight = window.innerHeight * window.devicePixelRatio; 
        let maxHeight = this.height;
        let maxWidth = this.width; //конечная ширина
        // resultHeight = maxWidth * realHeight / realWidth
        this.height = Math.min(Math.floor(maxWidth * realHeight / realWidth), maxHeight); // округляем вниз и отсекаем все, что выше maxWidth 
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    init() {
        this.canvas = document.getElementById('mycanvas');
        this.ctx = this.canvas.getContext('2d');
        this.initCanvasSize();
        this.setEvents();
    },
    setEvents() {
        window.addEventListener('keydown', e => {
            if(e.keyCode === KEYS.SPACE) {
                this.platform.fire();
                
            } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
                this.platform.start(e.keyCode);
                
            }
            
        });
        window.addEventListener('keyup', e => {
            this.platform.stop()
            
        })
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;
        required += Object.keys(this.sounds).length;

        let onResourceLoad = () => {
            ++loaded;
            if (loaded >= required) {
               callback();
            }
        };
        
        this.preloadSprites(onResourceLoad);
        this.preloadAudio(onResourceLoad);

    },
    preloadSprites(onResourceLoad) {
        for(let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = 'img/'+ key + '.png';
            this.sprites[key].addEventListener('load', onResourceLoad);
            
        }
    },
    preloadAudio(onResourceLoad) {
        for(let key in this.sounds) {
            this.sounds[key] = new Audio("sounds/" + key + ".mp3");
            this.sounds[key].addEventListener('canplaythrough', onResourceLoad, {once: true});
            
        }
    },
    create() {
        this.ball.x = this.width / 2 - 20;
        this.ball.y = this.height - 85;
        this.platform.x = this.width / 2 - 125;
        this.platform.y = this.height - 45;

        for(let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    width: 111,
                    height: 39,
                    x: 113 * col + 70,
                    y: 42 * row + 90,
                    active: true
                })
            }
        }
    },
    update(){
        this.platform.move();
        this.ball.move(); 
        this.collideBlocks();
        this.collidePlatform();
        this.ball.collideWorldBounds();
        this.platform.platformInside()
    },
    addScore() {
        ++this.score;

        if(this.score >= this.blocks.length) {
            this.end('You win!!!');
        }
    },
    collideBlocks() {
        for(let block of this.blocks) {
            if (block.active && this.ball.collide(block)) {
                    this.ball.bumpBlock(block);
                    this.addScore();
                    this.sounds.bump.play();
                }    
        }
    },
    collidePlatform() {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
            this.sounds.bump.play();
        }
    },

    run() {
        if (this.running)
        window.requestAnimationFrame(() => { //указание для каждого сдледующего кадра анимации
            this.update(); //обновление игрового состояния
            this.render(); //отрисовка игровых объектов
            this.run();
            
        });
    },
    render () {
        this.ctx.clearRect(0, 0, this.width, this.height); //очищает все, что было отрисовано до этого
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, this.ball.frame * this.ball.width, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
        this.ctx.fillText('Score: ' + this.score , 70, 46);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "28px Arial";
            
    },
    renderBlocks() {
        for (let block of this.blocks) {
            if (block.active)
            this.ctx.drawImage(this.sprites.block, block.x, block.y)
        }
    },
    start: function() {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
        

    },
    end(message) {
        //1.остановить игру
        this.running = false;
        //2.вывести сообщение
        alert (message);
        //3.перезапустить игру перезагрузив страницу
        window.location.reload();
    },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};





window.addEventListener('load', () => {
    game.start();
})

