import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';

/**
 * 消息处理对象的基类, 子类必须从写execute()方法。然后调用recylePacket(),回收数据包
 */

export default class SDKCommandBase {
    protected _packet: SDKPacket;

    constructor(){
    }

    public set packet(value: SDKPacket) {
        this._packet = value;
    }

    public run(data: any): void {
        this.execute(data);
    }

    /**
     * 子类必须重写改方法
     * 命令执行函数
     * @param data 数据包用户数据
     */
    public execute(data: any): void {}

    public recylePacket(): void {
        SDKPacketPool.Release(this._packet);
    }
}
