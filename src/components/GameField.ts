import { Graphics } from 'pixi.js';
import { GAME_FIELD_BG_COLOR } from '../consts/CColor';
import { GAME_HEIGHT, GAME_WIDTH } from '../consts/CGame';
import { BaseElement } from './BaseElement';

export class GameField extends BaseElement {
    constructor() {
        super();
        this.interactive = true;
        this.initMask();
    }

    protected draw(): void {
        this.background.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.background.fill(GAME_FIELD_BG_COLOR);
        this.addChild(this.background);
    }

    private initMask(): void {
        let mask:Graphics = new Graphics();
        mask.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        mask.fill(GAME_FIELD_BG_COLOR);
        this.mask = mask;
    }

    public destroy() {
        super.destroy();
        this.mask = null;
        //this.patrolTarget = null;
        //this.gameFieldRectangle = null;
    }
}