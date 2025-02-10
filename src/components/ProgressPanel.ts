import { ProgressBar } from '@pixi/ui';
import { Graphics, Text } from 'pixi.js';
import { PROGRESSBAR_COLOR, PROGRESSBAR_FILLER_COLOR } from '../consts/CColor';
import { GAME_TOTAL_TIME, PROGRESS_BAR_HEIGHT, PROGRESS_BAR_RADIUS, PROGRESS_BAR_WIDTH, SECONDS_IN_MINUTE } from '../consts/CGame';
import { TIME_TEXT } from '../consts/CText';
import { BaseElement } from './BaseElement';

export class ProgressPanel extends BaseElement {
    private progressBar!: ProgressBar;
    private filler!:Graphics;
    private timeTextField!: Text;
    private progress:number = 0;
    private elapsedTime:number = 0;
    private leftTime:number = 0;
    private competeCallback!:Function | null;

    constructor() {
        super();
        this.drawFiller();
        this.initProgressBar();
        this.initTimeLeftTextField();
    }

    protected draw():void {
        this.background.roundRect(0, 0, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT, PROGRESS_BAR_RADIUS);
        this.background.fill(PROGRESSBAR_COLOR);
    }

    private drawFiller():void {
        this.filler = new Graphics();
        this.filler.roundRect(0, 0, PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT, PROGRESS_BAR_RADIUS);
        this.filler.fill(PROGRESSBAR_FILLER_COLOR);
    }

    private initProgressBar():void {
        this.progressBar = new ProgressBar({
            bg: this.background,
            fill: this.filler,
            progress: this.progress
        });
        this.addChild(this.progressBar);
    }

    private initTimeLeftTextField():void {
        this.timeTextField = new Text({ text: "", style: this.getFont() });
        this.timeTextField.x = this.background.width * 0.5;
        this.timeTextField.y = 3;
        this.addChild(this.timeTextField);
    }

    public update(delta:number):void {
        if(this.progress === 0) {
            this.competeCallback && this.competeCallback();
            this.competeCallback = null;
            return;
        }
        this.elapsedTime += delta / SECONDS_IN_MINUTE;
        this.progress = Math.max(0, 1 - this.elapsedTime / GAME_TOTAL_TIME) * 100;
        this.progressBar.progress = this.progress
        this.updateTimeText(GAME_TOTAL_TIME - Math.ceil(this.elapsedTime));
    }

    public updateTimeText(time:number): void {
        if(this.leftTime !== time && time >= 0) {
            this.leftTime = time;
            this.timeTextField.text = (this.leftTime + TIME_TEXT).toString();
        }
    }

    public reset(callback:Function):void {
        this.competeCallback = callback; 
        this.progress = 1;
        this.elapsedTime = 0;
        this.updateTimeText(GAME_TOTAL_TIME);
    }

    public getLeftTime():number {
        return this.leftTime;
    }

    public destroy() {
        super.destroy();
        this.removeChild(this.progressBar);
        this.progressBar.destroy();
        this.removeChild(this.timeTextField);
        this.removeChild(this.filler);
        //this.filler = null;
        //this.progressBar = null;
        //this.timeTextField = null;
        //this.competeCallback = null;
    }
}