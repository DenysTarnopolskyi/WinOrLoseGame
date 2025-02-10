import { Bounds, Point } from 'pixi.js';
import { HERO_COLOR } from '../consts/CColor';
import { HERO_RADIUS, HERO_SPEED } from '../consts/CGame';
import { BaseElement } from './BaseElement';

export class MainHero extends BaseElement {
    private speed: number;
    private targetPosition: Point;
    private gameFieldArea: Bounds;

    constructor(position:Point, gameFieldArea:Bounds) {
        super();
        this.x = position.x;
        this.y = position.y;
        this.gameFieldArea = gameFieldArea;
        this.targetPosition = new Point(0, 0);
        this.speed = HERO_SPEED;
    }

    protected draw() {
        this.background.circle(0, 0, HERO_RADIUS);
        this.background.fill(HERO_COLOR);
        this.addChild(this.background);
    }

    public moveToPoint(position:Point): void {
        this.targetPosition = position;
    }

    public update(delta: number): void {
        const dx = this.targetPosition.x - this.x;
        const dy = this.targetPosition.y - this.y;
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

        if (distanceToTarget > 1) {
            const moveDistance = Math.min(distanceToTarget, this.speed * delta);
            this.x += (dx / distanceToTarget) * moveDistance;
            this.y += (dy / distanceToTarget) * moveDistance;
        }

       this.checkIsHeroOutGameField();
    }

    private checkIsHeroOutGameField() {
        if(this.x < this.gameFieldArea.x) {
            this.x = this.gameFieldArea.x;
        }  
        if(this.y < this.gameFieldArea.y) {
            this.y = this.gameFieldArea.y;
        } 
        if(this.x > (this.gameFieldArea.x + this.gameFieldArea.width)) {
            this.x = this.gameFieldArea.x + this.gameFieldArea.width;
        }  
        if(this.y > (this.gameFieldArea.y + this.gameFieldArea.height)) {
            this.y = this.gameFieldArea.y + this.gameFieldArea.height;
        }
    }

    public destroy() {
        super.destroy();
        //this.followCounterText = null;
        //this.targetPosition = null;
        //this.gameFieldRectangle = null;
    }
}