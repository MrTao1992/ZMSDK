import * as SDKENUM from '../SDKConst/SDKEnum';

export default class SDKSceneState {
    protected _secnes: Array<string>;
    protected _answers: Array<object>;
    protected _curIndex: number;
    protected _state: SDKENUM.TYPE_SCENE;
    protected _interaction: number;

    constructor() {
        this.reset();
    }

    public get state(): SDKENUM.TYPE_SCENE {
        return this._state;
    }

    public set state(value: SDKENUM.TYPE_SCENE) {
        this._state = value;
    }

    public get curIndex(): number {
        return this._curIndex;
    }

    public set curIndex(value: number) {
        this._curIndex = value;
    }

    public set secnes(value: string[]) {
        this._secnes = value;
    }

    public set answers(value: Array<object>) {
        this._answers = value;
    }

    public getCount(): number {
        return this._secnes.length;
    }

    public isLastScene(): boolean {
        return (
            this._curIndex === this._secnes.length - 1 ||
            this._secnes.length === 0
        );
    }

    public isFirstScene(): boolean {
        return this._curIndex === 0;
    }

    public curSceneName(): string {
        if (this._curIndex < this._secnes.length) {
            return this._secnes[this._curIndex];
        }
        return '';
    }

    public getSceneNameByIndex(index: number): string {
        if (index < this._secnes.length) {
            return this._secnes[index];
        }
        return "";
    }

    public getSceneIndexByName(scene: string) : number {
        return this._secnes.indexOf(scene);
    }

    public set interaction(value: number) {
        this._interaction = value;
    }

    public get interaction(): number {
        return this._interaction;
    }

    public getAnswerByIndex(index: number): object {
        let indexA = 0, countA = 0;
        let sceneName = this.getSceneNameByIndex(index);
        if (sceneName == "") {
            return [];
        }
        countA = this._answers.length;
        for (indexA = 0; indexA < countA; indexA++) {
            let element = this._answers[indexA];
            if (element['scene'] == sceneName) {
                return element['answerList'];
            }
        }
        return [];
    }

    public getAnswerById(answerId: string): object {
        let answers;
        let index = 0, count = 0;

        answers = this.getAnswerByIndex(this.curIndex);
        count = answers.length;
        for (index = 0; index < count; index++) {
            const element = answers[index];
            if (element['answerId'] == answerId) {
                return element;
            }
        }
        return null;
    }

    public reset(): void {
        this._curIndex = 0;
        this._secnes = [];
        this._answers = [];
        this._interaction = new Date().getTime();
        this._state = SDKENUM.TYPE_SCENE.TYPE_LOADING;
    }
}