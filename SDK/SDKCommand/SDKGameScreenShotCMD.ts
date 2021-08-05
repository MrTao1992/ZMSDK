import SDKCommandBase from './SDKCommandBase';
import SDKApp from '../SDKBase/SDKApp';
import { SCREENSHOT_DATA } from '../SDKConst/SDKRegistCommand';
import ScreenShot from '../Utils/ScreenShot';

/**
 * 辅助iOS系统，截取课件屏幕信息（视频|canvas）
 * 信令不需要转发到服务器，客户端需要做过滤处理
 */
export default class SDKGameScreenShotCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        let screenShot: ScreenShot = new ScreenShot();
        screenShot.printScreen((img) => {
            SDKApp.instance().transceiver.sendMsg(SCREENSHOT_DATA, img, false);
        });
        
        this.recylePacket();
    }
}