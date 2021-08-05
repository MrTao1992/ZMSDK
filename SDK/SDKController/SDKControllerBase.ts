import SDKBaseView from '../SDKView/SDKBaseView';
import SDKApp from '../SDKBase/SDKApp';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';

export default class SDKControllerBase {
    protected _views: SDKBaseView[];

    constructor() {
        this._views = [];
        this.reset();
        this.constructorViews();
    }

    public dispatcherCMD(
        name: string,
        data?: any,
        isMainIframe: boolean = true
    ): void {
        SDKApp.instance().transceiver.sendMsg(name, data, isMainIframe);
    }

    public update(dt:number): void {}

    public dispatcherHandle(
        name: string,
        data?: any,
        isMainIframe: boolean = true
    ): void {
        let packet: SDKPacket;

        packet = SDKPacketPool.Acquire(name);
        packet.data = data;
        packet.isMainFrame = isMainIframe;

        SDKApp.instance().packetHandler.dispatcherCMD(packet);
    }

    public reset(): void {
        let index = 0,
            count = 0;

        count = this._views.length;
        for (index = 0; index < count; index++) {
            this._views[index].reset();
        }
    }

    public destroy(): void {
        let index = 0,
            count = 0;

        count = this._views.length;
        for (index = 0; index < count; index++) {
            this._views[index].destroy();
        }
        this._views.length = 0;
        this._views = null;
    }

    /** 子类重写 构造view */
    protected constructorViews(): void {}
}