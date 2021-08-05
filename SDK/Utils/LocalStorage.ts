import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as UtilsType from './UtilsType';
import SDKApp from '../SDKBase/SDKApp';

const KEY_PRE: string = 'hd_';

export function addItem(name: string, value: any, expires: number = 60 * 60): boolean {
    let item = {};
    item['data'] = value;
    item['endTime'] = new Date().getTime() + expires * 1000;
    let key = getKey(name);
    SDKApp.instance().thirdInterface.localStorageSetItem(key,JSON.stringify(item));
    return true;
}

export function getItem(name: string): any {
    let key = getKey(name);
    let item = SDKApp.instance().thirdInterface.localStorageGetItem(key);

    if (UtilsType.isEmpty(item)) {
        return null;
    }
    item = JSON.parse(item);
    if (new Date().getTime() <= parseInt(item['endTime'])) {
        return item['data'];
    } else {
        deleteItem(name);
    }
    return null;
}

export function deleteItem(name: string) {
    let key = getKey(name);
    SDKApp.instance().thirdInterface.localStorageDeleteItem(key);
}

function getKey(value: string): string {
    let key: string = '';

    key += KEY_PRE;
    key += SDKLogicsCore.parameterVo.gameId + "_";
    key += value;
    return key;
}