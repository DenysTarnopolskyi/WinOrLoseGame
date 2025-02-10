import { Point } from 'pixi.js';
import { ANIMAL_COLOR } from '../consts/CColor';
import { ANIMAL_RADIUS, ANIMAL_SIDES, ANIMAL_SPEED, GAME_HEIGHT, GAME_WIDTH } from '../consts/CGame';
import { BaseElement } from './BaseElement';

export class Animal extends BaseElement {
    private speed: number;
    private patrolTarget: Point;

  constructor(position:Point) {
        super();
        this.x = position.x;
        this.y = position.y;
        this.speed = ANIMAL_SPEED;
        this.patrolTarget = new Point(0, 0);
        this.setPatrolTarget();
    }

    protected draw() {
        this.background.star(0, 0, ANIMAL_SIDES, ANIMAL_RADIUS);
        this.background.fill(ANIMAL_COLOR);
        this.addChild(this.background);
    }

    private setPatrolTarget(): void {
        this.patrolTarget = new Point(Math.random() * GAME_WIDTH, GAME_HEIGHT + ANIMAL_RADIUS * 3);
    }

    private startPatrol(delta: number): void {
        if (!this.patrolTarget) {
            this.setPatrolTarget();
        }

        const dx = this.patrolTarget.x - this.x;
        const dy = this.patrolTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > ANIMAL_RADIUS) {
            this.x += (dx / distance) * this.speed * delta;
            this.y += (dy / distance) * this.speed * delta;
        } else {
            this.y = - ANIMAL_RADIUS;
            this.setPatrolTarget();
        }
    }

    public update(delta: number): void {
        this.startPatrol(delta);
    }
    
    public isAnimaOutSideGame(): boolean {
        return this.y > (GAME_HEIGHT + ANIMAL_RADIUS);
    }

    public destroy() {
        super.destroy();
        //this.patrolTarget = null;
    }
}