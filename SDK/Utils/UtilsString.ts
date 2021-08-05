export function formateMobile(mobile: string): string {
    if (mobile === undefined || mobile === null || mobile === '') {
        return '';
    }
    if (mobile.length <= 4) {
        return mobile;
    }
    return mobile.replace(mobile.substring(0, mobile.length - 4), '****');
}

export function formateUrlOfMobile(url: string): string {
    let temp: string = '';
    let query;
    let index = 0;

    temp = url;
    if (temp.indexOf('?') == -1) {
        return temp;
    }
    query = urlQuery(temp);
    temp = url.substring(0, temp.indexOf('?') + 1);
    for (let key in query) {
        if (key === '') {
            continue;
        }
        if (key === 'userMobile') {
            query[key] = formateMobile(query[key]);
        }
        if (index != 0) {
            temp += '&' + key + '=' + query[key];
        } else {
            temp += key + '=' + query[key];
        }
        index++;
    }
    return temp;
}

export function urlQuery(url: string) {
    const query = {};
    let index = url.indexOf('?');
    if (index !== -1) {
        const str = url.substr(index + 1);
        const strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
            query[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }
    return query
}