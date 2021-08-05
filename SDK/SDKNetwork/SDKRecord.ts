import SDKRecordBase from './SDKRecordBase';

/**
 * SDKRecord:
 * 埋点消息包数据结构
 */
export default class SDKRecord extends SDKRecordBase {
    public user_id: string;
    public app_id: string;
    public session_id: string;
    public event_time_start: number;
    public event_id: string;
    public event_type: number;
    public event_value: number;
    public event_para: any;

    constructor(name: string = '') {
        super(name);
        this.event_id = name;
    }

    public name(): string {
        return this.event_id;
    }

    public reset(): void {
        super.reset();
        this.user_id = '';
        this.app_id = '';
        this.session_id = '';
        this.event_time_start = 0;
        this.event_id = '';
        this.event_type = 0;
        this.event_value = 1;
        this.event_para = {};
    }
}
