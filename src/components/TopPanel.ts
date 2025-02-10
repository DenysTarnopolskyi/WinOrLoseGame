import { Text } from 'pixi.js';
import { SCORE_PANEL_TEXT } from '../consts/CText';
import { BaseElement } from './BaseElement';

export class TopPanel extends BaseElement{
    private scoreTextField!: Text;
    private score = 0;

    constructor() {
        super();
        this.initScoreTextField();
    }

    private initScoreTextField(): void {
        this.scoreTextField = new Text({ text: "", style: this.getFont() });
        this.addChild(this.scoreTextField);
    }

    private updateScoreText(): void {
        this.scoreTextField.text = SCORE_PANEL_TEXT + this.score;
    }

    public updateScore(): void {
        this.score--;
        if(this.score < 0) {
            this.score = 0;
        }
        this.updateScoreText();
    }

    public updateMaxScore(maxScore:number): void {
        this.score = maxScore;
        this.updateScoreText();
    }

    public isWin(): boolean {
        return Boolean(this.score === 0);
    }

    public destroy() {
        super.destroy();
        this.removeChild(this.scoreTextField);
        this.scoreTextField.destroy();
        //this.scoreTextField = null;
    }
}