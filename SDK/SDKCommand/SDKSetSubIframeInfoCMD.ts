import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 从zml课件获取多个伙伴的信息
 */
export default class SDKSetSubIframeInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKSetSubIframeInfoCMD.....', data);
        SDKLogicsCore.parameterVo.userId = data.userId;

        // this.checkInitComplete();
    }

    // private checkInitComplete(): void {
    //     let gameCanvas: HTMLElement;
    //     let canvasWidth: number = 0;
    //     let canvasHeight: number = 0;
    //     let canvasName: string = '';

    //     canvasName = SDKApp.instance().thirdInterface.gameCanvasName();
    //     if (canvasName !== '') {
    //         gameCanvas = document.getElementById(canvasName);
    //     }
    //     if (gameCanvas) {
    //         canvasWidth = Number(gameCanvas.getAttribute('width'));
    //         canvasHeight = Number(gameCanvas.getAttribute('height'));
    //     }
    //     if (canvasWidth === 0 || canvasHeight === 0) {
    //         let sceneName = SDKApp.instance().thirdInterface.getSceneName();
    //         if (sceneName !== '') {
    //             SDKApp.instance().thirdInterface.loadScene(sceneName);
    //         }
    //     }
    // }
}