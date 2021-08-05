import SDKApp from "../SDKBase/SDKApp";
import * as SDKConfigConst from '../SDKConst/SDKConfigConst';

/**
 * 游戏截图
 */
export default class ScreenShot {
    private _qulity: number = 0.1;
    private _width: number = SDKConfigConst.WIDTH;
    private _height: number = SDKConfigConst.HEIGHT;

    public setSize(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    public printScreen(callback: (value: string) => void, qulity: number = 0.1): void {
        this._qulity = qulity;
        const videoDom = SDKApp.instance().thirdInterface.videoElement() as HTMLVideoElement;
        // 判断当前是否在播放视频
        const isVideoPlaying = videoDom && !this.isVideoHidden(videoDom);
        if (isVideoPlaying) {
            this.screenshotVideo(videoDom, callback);
        } else {
            this.screenshotWebGL(callback);
        }
    }

    /**
     * 适用于WebGL 与Canvas环境
     * @param {*} callback
     */
    private screenshotWebGL(callback) {
        if (SDKApp.instance().thirdInterface.isZMG1()) {
            let onEventAfterDraw = SDKApp.instance().thirdInterface.onGameAfterDraw(() => {
                let GameCanvas = SDKApp.instance().thirdInterface.gameCanvasName();
                const canvas: any = document.getElementById(GameCanvas);
                SDKApp.instance().thirdInterface.offGameAfterDraw(onEventAfterDraw, this);
                this.drawImage(canvas, callback);
            }, this);
        } else {
            SDKApp.instance().thirdInterface.screenShot((img)=>{
                callback && callback(img);
            });
        }
    }

    /**
     * 截取 video 当前帧
     * @param video
     * @param callback
     */
    private screenshotVideo(video: HTMLVideoElement, callback) {
        this.drawImage(video, callback);
    }

    private drawImage(target, callback): void {
        if(target.width == 0 || target.height == 0) {
            return;
        }
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = this._width;
        canvas.height = this._height;
        canvas.getContext('2d').drawImage(target, 0, 0, canvas.width, canvas.height);
        let id = setTimeout(() => {
            let base64 = canvas.toDataURL('image/jpeg', this._qulity);
            callback && callback(base64);
            clearTimeout(id);
        }, 100);
    }

    /**
     * 获取当前节点的样式
     * @param elem
     */
    private getComputedStyle(elem) {
        let view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
            view = window;
        }
        return view.getComputedStyle(elem);
    }

    /**
     * dom原始是否隐藏
     * @param elem
     */
    private isVideoHidden(elem) {
        const currentStyle = this.getComputedStyle(elem);
        return (
            currentStyle.getPropertyValue('visibility') === 'hidden' ||
            currentStyle.getPropertyValue('display') === 'hidden'
        );
    }
}