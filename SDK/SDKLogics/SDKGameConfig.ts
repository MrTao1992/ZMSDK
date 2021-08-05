export default class SDKGameConfig {
    public splitPageNumber: number;         //分屏每页最大数量
    public kickout: boolean;                //熔断开关
    public delayTime: number;               //熔断间隔时间
    public maxPacket: number;               //熔断最大发包量
    public maxSecPacket: number;            //熔断每秒最大发包量
    public maxPacketSize: number;           //单个包最大字节数
    public printScreen: boolean;            //是否支持作答截图

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.splitPageNumber = 4;
        this.kickout = true;
        this.delayTime = 5;
        this.maxPacket = 200;
        this.maxSecPacket = 50;
        this.maxPacketSize = 500;
        this.printScreen = false;
    }
}