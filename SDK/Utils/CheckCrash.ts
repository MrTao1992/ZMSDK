import SDKApp from "../SDKBase/SDKApp";
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as LocalStorage from '../Utils/LocalStorage';
import * as UtilsType from './UtilsType';
import * as UtilsString from './UtilsString';

enum CHECK_LEVEL {
    NONE,
    DIV,
    WEBGL,
    ERROR,
    BLANK
}

export default class CheckCrash {
    // static GAME_CONTAINER: string = 'Cocos2dGameContainer';
    // static GAME_CANVAS: string = 'GameCanvas';

    private _isRuning: boolean;
    private _totalError: number;
    private _level: CHECK_LEVEL;
    private _step: number;
    private _total: number;
    private _curStep: number;
    private _duration: number;
    private _renderCount: number;

    private _zeroError: number;
    // private _tmpCanvas: any;

    private _timeId: number;
    // private _isRender: boolean;
    // private _isBlank: boolean;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this._isRuning = false;
        this._totalError = 0;
        this._level = CHECK_LEVEL.NONE;
        this._step = 1;
        this._total = 2000;
        this._curStep = 0;
        this._duration = 0;
        this._renderCount = 0;

        this._zeroError = 0;
        // this._tmpCanvas = null;
        // this._isRender = false;
        // this._isBlank = false;
    }

    public start(): void {
        //分屏或者老师录制不检测
        if (SDKLogicsCore.parameterVo.isGamePreview() ||
            SDKLogicsCore.parameterVo.isReplay() ||
            SDKLogicsCore.parameterVo.isSplitScreen() ||
            SDKLogicsCore.parameterVo.isRepairRecord) {
            return;
        }
        this._isRuning = true;
        this._timeId = setInterval(this.update.bind(this), 30, 30);
    }

    public stop(): void {
        this._isRuning = false;
        clearInterval(this._timeId);
    }

    public update(dt): void {
        if (!this._isRuning) {
            return;
        }

        this._duration += dt;
        if (this._curStep >= this._step) {
            this._curStep = 0;
            this.render();
            this._renderCount++;
        }
        this._curStep++;
    }

    private render() {
        switch (this._level) {
            case CHECK_LEVEL.NONE:
                this.checkNone();
                break;
            case CHECK_LEVEL.DIV:
                this.checkDiv();
                break;
            case CHECK_LEVEL.WEBGL:
                this.checkWEBGL();
                break;
            case CHECK_LEVEL.ERROR:
                this.checkError();
                break;
            // case CHECK_LEVEL.BLANK:
            //     this._isBlank = true;
            //     this.checkBlank();
            //     break;
        }
    }

    private setState(step, total, level) {
        this._step = step;
        this._total = total;
        this._duration = 0;
        this._renderCount = 0;
        this._level = level;

        this.sendLog(this._level - 1, 'ok');
    }

    private checkNone(): void {
        if (this._duration >= this._total) {
            this.setState(2, 5000, CHECK_LEVEL.DIV);
        }
    }

    private checkDiv(): void {
        let result: boolean;

        if (this._duration >= this._total) {
            this.reload();
            return;
        } else {
            result = this.isGameCanvas();
            if (result) {
                this.setState(2, 5000, CHECK_LEVEL.WEBGL);
            }
        }
    }

    private checkWEBGL(): void {
        let result: boolean;

        if (this._duration >= this._total) {
            this.reload();
            return;
        } else {
            result = this.isSupportWebGl();
            if (result) {
                this._zeroError = 0;
                this.setState(5, 5000, CHECK_LEVEL.ERROR);
            }
        }
    }

    private checkError(): void {
        let result: number;

        if (this._duration >= this._total) {
            if (this._zeroError / this._renderCount >= 0.4) {
                // this.addEvents();
                // this.setState(60, 10000, CHECK_LEVEL.BLANK);
                this.sendLog(CHECK_LEVEL.ERROR, 'ok');
                this.stop();
            } else {
                this.reload();
                return;
            }
        } else {
            result = this.getJsErrorCount();
            if (result - this._totalError === 0) {
                this._zeroError++;
            }
            this._totalError = result;
        }
    }

    // private checkBlank(): void {
    //     let result: boolean;

    //     if (this._duration >= this._total) {
    //         this.removeEvents();
    //         this.reload();
    //         return;
    //     } else {
    //         if(this._isRender && this._isBlank) {
    //             result = this.isBlank();
    //             if (!result) {
    //                 this.stop();
    //                 this._tmpCanvas = null;
    //                 this.sendLog(CHECK_LEVEL.BLANK, 'ok');
    //                 this.removeEvents();
    //             }
    //             this._isBlank = false;
    //         }
    //     }
    // }

    private reload(): void {
        this.stop();
        this.sendLog(this._level);

        let refreshCount = LocalStorage.getItem('refreshCount');
        if (UtilsType.isEmpty(refreshCount)) {
            refreshCount = 1;
        } else {
            refreshCount++;
        }
        LocalStorage.addItem('refreshCount', refreshCount, 15 * 60);
        if (refreshCount <= 2) {
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        }
    }

    private sendLog(level: CHECK_LEVEL, state: string = 'error'): void {
        if (level == CHECK_LEVEL.NONE) {
            return;
        }

        let data = {};
        data['name'] = CHECK_LEVEL[level];
        data['state'] = state;
        data['url'] = UtilsString.formateUrlOfMobile(window.location.href);
        SDKApp.instance().newRecordTransceiver.send('checkMsg', data);
    }

    // private _onEventBeforeDraw;
    // private _onEventAfterDraw;
    // private addEvents(): void {
    //     this._onEventBeforeDraw = SDKApp.instance().thirdInterface.onGameBeforeDraw(() => {
    //         this._isRender = false;
    //     }, this);
    //     this._onEventAfterDraw = SDKApp.instance().thirdInterface.onGameAfterDraw(() => {
    //         this._isRender = true;
    //         this.checkBlank();
    //         this._isRender = false;
    //     },this);
    // }

    // private removeEvents(): void {
    //     SDKApp.instance().thirdInterface.offGameBeforeDraw(this._onEventBeforeDraw, this);
    //     SDKApp.instance().thirdInterface.offGameAfterDraw(this._onEventAfterDraw, this);
    // }

    public isGameCanvas(): boolean {
        let result = false;

        let gameCanvasName = SDKApp.instance().thirdInterface.gameCanvasName();
        let gameCanvas = document.getElementById(gameCanvasName);
        if (gameCanvas) {
            result = true;
        }

        return result;
    }

    /**
     * 这个方法消耗40ms,因此要在渲染之后去检测,不然会出现黑屏闪烁情况
     */
    // public isBlank(): boolean {
    //     let result = false;

    //     if (!this.isGameCanvas()) {
    //         return true;
    //     }
    //     let gameCanvasName = SDKApp.instance().thirdInterface.gameCanvasName();
    //     let gameCanvas: any = document.getElementById(gameCanvasName);
    //     if (gameCanvas.width == 0 || gameCanvas.height == 0) {
    //         return true;
    //     }
    //     if (!this._tmpCanvas) {
    //         this._tmpCanvas = document.createElement('canvas');
    //     }
    //     this._tmpCanvas.width = gameCanvas.width;
    //     this._tmpCanvas.height = gameCanvas.height;
    //     result = gameCanvas.toDataURL() == this._tmpCanvas.toDataURL();
    //     return result;
    // }

    public isSupportWebGl(): boolean {
        let gl;
        let canvasEL;
        let gameCanvasName = SDKApp.instance().thirdInterface.gameCanvasName();

        canvasEL = document.getElementById(gameCanvasName);
        if (!canvasEL) {
            return false;
        }
        try {
            gl = canvasEL.getContext('webgl')
                || canvasEL.getContext('experimental-webgl')
                || canvasEL.getContext('webkit-3d')
                || canvasEL.getContext('moz-webgl');
        } catch (err) {
            return false;
        }
        return true;
    }

    public getJsErrorCount(): number {
        if ((window as any).hdLog && (window as any).hdLog.jsError) {
            return (window as any).hdLog.jsError;
        }
        return 0;
    }

    public getDocErrorCount(): number {
        if ((window as any).hdLog && (window as any).hdLog.docError) {
            return (window as any).hdLog.docError;
        }
        return 0;
    }
}