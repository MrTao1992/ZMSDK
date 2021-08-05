import SDKRecord from './SDKRecord';
import SDKPacketPool from './SDKPacketPool';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKRecordBase from './SDKRecordBase';
import SDKPageRecord from './SDKPageRecord';
import * as UtilsType from '../Utils/UtilsType';
import SDKApp from '../SDKBase/SDKApp';

class CommandVo {
    public _method: string = 'POST';
    public _callBack: (response:any) => void;
    public _data: SDKRecordBase;

    public constructor(
        data: SDKRecordBase,
        method: string = 'POST',
        callBack: (response:any) => void
    ) {
        this._method = method;
        this._data = data;
        this._callBack = callBack;
    }

    public reset(): void {
        if (this._data) {
            if (this._data instanceof SDKRecord) {
                SDKPacketPool.ReleaseRecord(this._data);
            } else if (this._data instanceof SDKPageRecord) {
                SDKPacketPool.ReleasePageRecord(this._data);
            }
        }
    }
}

export default class SDKHttpClient {
    private _timeOut: number;
    private _url: string;
    private _commandVos: CommandVo[];
    private _timeId: number;
    private _isError: boolean;

    public constructor(url: string = '', timeOut: number = 10000) {
        this.reset();
        this._url = url;
        this._timeOut = timeOut;

        this.onUpdate();
    }

    public send(
        record: SDKRecordBase,
        method: string = 'POST',
        callBack: (response:any) => void = null
    ): void {
        let data: string;
        let request: XMLHttpRequest;
        const self = this;

        if (!record) {
            return;
        }
        let commandVo: CommandVo;
        commandVo = new CommandVo(record, method, callBack);
        this._commandVos.push(commandVo);

        data = JSON.stringify(record);
        request = this.getXmlHttpRequest();
        request.open(method, this._url, true);
        request.timeout = this._timeOut;
        // request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function() {
            if (
                request.readyState === 4 &&
                (request.status >= 200 && request.status < 300)
            ) {
                //DebugInfo.info('发送日志:', record.name());
                const index: number = self._commandVos.indexOf(commandVo);
                if (index !== -1) {
                    const temp: CommandVo = self._commandVos[index];
                    temp.reset();
                    self._commandVos.splice(index, 1);
                }
                if (!UtilsType.isEmpty(callBack)) {
                    callBack(request.responseText);
                }
            } else if (request.readyState === 4) {
                self.onError(null);
            }
        };
        request.send(data);
    }

    public reset(): void {
        this._url = '';
        this._timeOut = 10000;
        this._commandVos = [];
        this._timeId = 0;
        this._isError = false;
    }

    public destory(): void {}

    private reSend(): void {
        let index = 0,
            count = 0;
        let commandVo: CommandVo;
        let commandVos: CommandVo[];

        if (!this._isError) {
            return;
        }

        commandVos = this._commandVos.slice(0);
        this._commandVos = [];

        DebugInfo.info('重新发送日志');
        if (commandVos.length > 10) {
            DebugInfo.error('网络有问题');
            return;
        }

        count = commandVos.length;
        for (index = 0; index < count; index++) {
            commandVo = commandVos[index];
            this.send(commandVo._data, commandVo._method, commandVo._callBack);
        }
        this._isError = false;
    }

    private getXmlHttpRequest(): XMLHttpRequest {
        let request: XMLHttpRequest;
        const self = this;

        request = SDKApp.instance().thirdInterface.getXMLHttpRequest();
        request.addEventListener('error', (evt) => {
            self.onError(evt);
        });
        request.addEventListener('abort', (evt) => {
            self.onError(evt);
        });
        request.addEventListener('timeout', (evt) => {
            self.onError(evt);
        });

        return request;
    }

    private onError(evt: Event): void {
        if (evt) {
            console.log(evt);
        }
        this._isError = true;
    }

    private onUpdate(): void {
        clearTimeout(this._timeId);
        this._timeId = setTimeout(() => {
            this.reSend();
            this.onUpdate();
        }, 10000);
    }
}
