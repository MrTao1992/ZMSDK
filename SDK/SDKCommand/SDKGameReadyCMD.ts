import SDKCommandBase from './SDKCommandBase';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKLogEventConst from '../SDKConst/SDKLogEventConst';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as UtilsString from '../Utils/UtilsString';

/**
 * 游戏准备完毕,可以收发消息
 */
export default class SDKGameReadyCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("gameReadyCMD......");

        let log = { url: UtilsString.formateUrlOfMobile(window.location.href) };
        SDKApp.instance().logTransceiver.send(SDKLogEventConst.CTR_DOM_READY, log);
        //先初始化项目脚本，然后初始化引擎脚本，加载是在事件循环里，故要延迟检查
        setTimeout(() => {
            this.checkEngineState();
        }, 300);

        SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.GAME_LOAD_START, null, false);
        SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.ON_STAGE_ACCEPT, null, false);
        if(SDKLogicsCore.parameterVo.isRepairRecord) {
            SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.REPAIR_SECEND_VERSION, null, false);
        }

        this.recylePacket();
    }

    private checkEngineState(): void {
        let isSupport = this.checkIsSupportWebGL();
        let rendererInitialized = SDKApp.instance().thirdInterface.gameInitialized();

        if (isSupport) {
            DebugInfo.info('WEBGL初始化完成');
            SDKApp.instance().logTransceiver.send(SDKLogEventConst.CTR_WEBGL_INIT);
        } else {
            DebugInfo.error('WEBGL初始化失败');
            SDKApp.instance().logTransceiver.send(SDKLogEventConst.CTR_WEBGL_INIT_ERROR);
        }
        if (rendererInitialized) {
            DebugInfo.info('引擎初始化完成');
            SDKApp.instance().logTransceiver.send(SDKLogEventConst.CTR_ENGINE_INITED);
        } else {
            DebugInfo.error('引擎初始化失败');
            SDKApp.instance().logTransceiver.send(SDKLogEventConst.CTR_ENGINE_INIT_ERROR);
        }
    }

    private checkIsSupportWebGL(): boolean {
        let gl;
        let canvasEL;

        let gameCanvas = SDKApp.instance().thirdInterface.gameCanvasName();
        canvasEL = document.getElementById(gameCanvas);
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
}