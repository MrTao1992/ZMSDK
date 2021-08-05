import SDKCommandBase from './SDKCommandBase';
/**
 * 设置场景状态
 */
export default class SDKSceneOnstartCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        this.recylePacket();
    }
}
