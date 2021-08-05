import SDKCommandBase from './SDKCommandBase';

/**
 * 向zmg课件请求历史记录信息
 */
export default class SDKGetHistoryCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        this.recylePacket();
    }
}
