import { Application, Bounds, FederatedPointerEvent, Point, Ticker } from 'pixi.js';
import { Animal } from './components/Animal';
import { GameField } from './components/GameField';
import { MainHero } from './components/MainHero';
import { ProgressPanel } from './components/ProgressPanel';
import { ResultScreen } from './components/ResultScreen';
import { TopPanel } from './components/TopPanel';
import { ANIMAL_RADIUS, ANIMAL_SPAWN_INTERVAL, GAME_HEIGHT, GAME_WIDTH, HERO_COLLISION_DISTANCE, HERO_START_X_POSITION, HERO_START_Y_POSITION, MAX_ANIMALS_COUNT } from './consts/CGame';

enum GameResult {
    GAME,
    WIN,
    LOSE
}

export class Game {
    private app: Application;
    private gameField!: GameField;
    private mainHero!: MainHero;
    private animals: Animal[];
    private progressBar!: ProgressPanel;
    private topPanel!: TopPanel;
    private resultScreen!: ResultScreen;
    private spawnIntervalId: number;
    private gameResult: number = 0;
    private spawnCounter: number = 0;

    constructor(app:Application) {
        this.app = app;
        this.spawnIntervalId = -1;
        this.animals = [];

        this.initGameComponents();
        this.startGame();
    }

    private initGameComponents(): void {
        this.gameField = new GameField();
        this.app.stage.addChild(this.gameField);

        this.progressBar = new ProgressPanel();
        this.progressBar.x = (GAME_WIDTH - this.progressBar.getWidth()) * 0.5;
        this.progressBar.y = (GAME_HEIGHT - this.progressBar.getHeight()) * 0.5;
        this.gameField.addChild(this.progressBar);

        this.topPanel = new TopPanel();
        this.app.stage.addChild(this.topPanel);

        this.resultScreen = new ResultScreen();
        this.app.stage.addChild(this.resultScreen);

        this.mainHero = new MainHero(this.getHeroStartPosition(), this.getGameFieldBounds());
        this.mainHero.moveToPoint(this.getHeroStartPosition());
        this.gameField.addChild(this.mainHero);
        this.gameField.on('pointerdown', this.onGameFieldClicked.bind(this));
        this.app.ticker.add((delta: Ticker) => this.update(delta));
    }

    private startGame(): void {
        this.spawnCounter = 0;
        this.gameResult = GameResult.GAME;

        this.topPanel.updateMaxScore(MAX_ANIMALS_COUNT);
        this.progressBar.reset(this.checkWinLose.bind(this));
        this.resultScreen.reset();
        this.removeAnimals();
        this.startSpawnAnimals();
    }

    private startSpawnAnimals(): void {
        this.spawnIntervalId = setInterval(() => {
            this.spawnCounter++;
            this.spawnAnimals();
        }, ANIMAL_SPAWN_INTERVAL);
    }

    private spawnAnimals(): void {
        if(this.spawnCounter > MAX_ANIMALS_COUNT) {
            this.clearSpawnIntervalId();
            return;
        }
        
        const animal = new Animal(this.getRandomPosition());
        this.animals.push(animal);
        this.gameField.addChild(animal);
    }

    private update(delta: Ticker): void {
        if(this.gameResult !== GameResult.GAME) {
            return;
        }

        let deltaTime:number = parseFloat(delta.deltaTime.toFixed(4));
        this.mainHero.update(deltaTime);
        this.animals.forEach((animal, index) => {
            if(this.checkHitTestHeroWithAnimal(animal)) {
                this.removeAnimal(animal, index);
                this.topPanel.updateScore();
                this.checkWinLose();
            } else {
                animal.update(deltaTime);
            }
        });
        this.progressBar.update(deltaTime);
    }

    private checkWinLose(): void {
        if(this.topPanel.isWin()) {
            this.gameResult = GameResult.WIN;
            this.endGame();
        } else if(this.progressBar.getLeftTime() <= 0) {
            this.gameResult = GameResult.LOSE;
            this.endGame();
        }
    }

    private endGame(): void {
        var isWin = Boolean(this.gameResult === GameResult.WIN);
        this.resultScreen.showResult(isWin);
    }

    private checkHitTestHeroWithAnimal(animal: Animal): boolean {
        const dx = this.mainHero.x - animal.x;
        const dy = this.mainHero.y - animal.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < HERO_COLLISION_DISTANCE;
    }

    private onGameFieldClicked(event: FederatedPointerEvent): void {
        if(this.gameResult === GameResult.GAME){
            this.mainHero.moveToPoint(event.global);
        } else {
            this.app.ticker.start()
            this.startGame()
        }
    }

    private getRandomPosition(): Point {
        return new Point(ANIMAL_RADIUS + Math.random() * (GAME_WIDTH - ANIMAL_RADIUS), - ANIMAL_RADIUS);
    }

    private getHeroStartPosition(): Point {
        return new Point(HERO_START_X_POSITION, HERO_START_Y_POSITION);
    }

    private getGameFieldBounds(): Bounds {
        return this.gameField.getBounds();
    }

    public destroy() {
        this.app.ticker.remove(this.update);
        this.clearSpawnIntervalId();
        this.removeAnimals();
        
        this.topPanel.destroy();
        this.resultScreen.destroy();
        this.progressBar.destroy();
        this.mainHero.destroy();
        this.gameField.removeAllListeners();
        this.gameField.destroy();
        this.app.destroy();
        //this.animals = null;
        //this.topPanel = null;
        //this.progressBar = null;
        //this.mainHero = null;
        //this.gameField = null;
        //this.resultScreen = null;
    }

    private clearSpawnIntervalId(): void {
        if(this.spawnIntervalId != -1) {
            clearInterval(this.spawnIntervalId)
            this.spawnIntervalId = -1;
        }
    }

    private removeAnimals(): void {
        if(!this.animals.length) {
            return;
        }
        for (var i = this.animals.length-1; i >= 0; i--) {
            this.removeAnimal(this.animals[i], i);
        }
        this.animals = [];
    }

    private removeAnimal(animal: Animal, index:number): void {
        this.gameField.removeChild(animal);
        this.animals.splice(index, 1);
        animal.destroy();
        //animal = null;
    }
}