import SDKRecordBase from './SDKRecordBase';

/**
 * SDKRecordBase:
 * 埋点消息包数据结构
 */
export default class SDKPageRecord extends SDKRecordBase {
    public page_id: string;
    public page_name: string;
    public refer_page_id: string;
    public refer_page_name: string;
    public expand: any;
    public app_id: string;
    public platform: string;
    public device_id: string;
    public user_id: string;
    public tracker_tpye: number;
    public channel_id: string;
    public session_id: string;
    public time_start: number;
    public duration: number;
    public content: string;
    public linkurl: string;

    constructor(name: string = '') {
        super(name);
        this.page_name = name;
    }

    public name(): string {
        return this.page_name;
    }

    public reset(): void {
        super.reset();
        this.page_id = '';
        this.page_name = '';
        this.refer_page_id = '';
        this.refer_page_name = '';
        this.expand = {};
        this.app_id = '';
        this.platform = '';
        this.device_id = '';
        this.user_id = '';
        this.tracker_tpye = 3;
        this.channel_id = '';
        this.session_id = '';
        this.time_start = 0;
        this.duration = 0;
        this.content = '';
        this.linkurl = '';
    }
}
