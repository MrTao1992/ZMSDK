/**
 * SDKRecordBase:
 * 埋点消息包数据结构
 */
export default class SDKRecordBase {
    constructor(name: string = '') {
        this.reset();
    }

    public name(): string {
        return '';
    }

    public reset(): void {}
}
