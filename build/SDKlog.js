function Log() {
	this.jsError = 0;
	this.docError = 0;
	this.appId = '0';
	this.usage = 'preview';
	this.role = 'none';
	this.repair = 'none';
	this.isTrain = false;
	this.lastError = null;
	this.count = 0;
	this.roomSessionId = '';
	this.coursewareUuid = '';
	this.subCoursewareUuid = '';
}

Log.prototype.init = function () {
	let url = window.location.search;
	let query = getRequest(url);
	let env = getEnvironment(query);
	let _ZM_JSSDK = window['ZM_JSSDK'];
	let lessonUid = '0';

	//let logType = env === 'prod' ? 'error' : 'debug';
	_ZM_JSSDK && _ZM_JSSDK.setConfig({
		environment: env,
		logLevel: 'error',
		useBeacon: false
	});

	let userId = '';
	if (query["userMobile"]) {
		userId = String(query["userMobile"]);
	}
	if (query["user_id"]) {
		userId = String(query["user_id"]);
	}
	if (query["lessonUid"]) {
		lessonUid = query["lessonUid"];
	}
	if (query["appId"]) {
		this.appId = query["appId"];
	}
	if (query["usage"]) {
		this.usage = query["usage"];
	}
	if (query["role"]) {
		this.role = query["role"];
	}
	if (query['repair']) {
		this.repair = query['repair'];
	}
	if (query["isTrain"]) {
		this.isTrain = query["isTrain"] === 'true' ? true : false;
	}
	if (query['roomSessionId']) {
		this.roomSessionId = query['roomSessionId'];
	}
	if(query['coursewareUuid']) {
		this.coursewareUuid = query['coursewareUuid'];
	}

	_ZM_JSSDK && _ZM_JSSDK.setDefaults({
		appId: '11264',
		appVersion: '1.0.0',
		userId: userId,
		lessonUid: lessonUid,
		role: this.getRole(),
		roomSessionId:this.roomSessionId
	});

	this.createSubUuid();
	this.send('docLoadComplete', {}, 0, 1);
}

Log.prototype.send = function (name, data, eventType, eventValue) {
	let _ZM_JSSDK = window['ZM_JSSDK'];
	if (!_ZM_JSSDK || !_ZM_JSSDK.sendEvent) {
		return;
	}
	let date = new Date();

	let log = {};
	log.eventId = this.getEventPreName() + name;
	log.eventType = eventType;
	log.eventValue = eventValue;
	if (log.event_type === 0) {
		log.event_value = 1;
	}
	log.eventParam = data;
	log.eventParam.parentAppId = this.appId;
	log.eventParam.nameSpace = this.getNameSpace();
	log.eventParam.timeStamp = date.getTime();
	log.eventParam.coursewareUuid = this.coursewareUuid;
	log.eventParam.subCoursewareUuid = this.subCoursewareUuid;
	log.eventParam.localTime = date.toLocaleString() + '.' + log.eventParam.timeStamp % 1000;
	_ZM_JSSDK && _ZM_JSSDK.sendEvent(log);
}

Log.prototype.getRole = function () {
	let role = 'none';
	if (this.role == 'student' || this.role == 'teacher' || this.role == 'trainer') {
		role = this.role;
	} else if (this.role == 'watcher' || this.role == 'seller') {
		role = 'watcher';
	}
	return role;
}

Log.prototype.getNameSpace = function () {
	let nameSpace = 'preview';

	nameSpace = this.usage;
	if (this.usage == 'class' && (this.role == 'seller' || this.role == 'watcher')) {
		nameSpace = 'watch';
	} else if (this.usage == 'class' && this.repair == 'record') {
		nameSpace = 'repairRecord';
	} else if (this.usage == 'class' && this.repair == 'play') {
		nameSpace = 'repairPlay';
	} else if (this.usage == 'class' && this.isTrain) {
		nameSpace = 'train';
	}

	return nameSpace;
}

/**
 * 获取事件类型前缀
 */
Log.prototype.getEventPreName = function () {
	let eventPreName = 'preview_';

	if (this.usage == 'preview') {
		eventPreName = 'preview_';
	} else if (this.usage == 'class' && (this.role == 'seller' || this.role == 'watcher')) {
		eventPreName = 'watch_';
	} else if (this.usage == 'class') {
		eventPreName = 'study_';
	} else if (this.usage == 'replay') {
		eventPreName = 'replay_';
	}
	eventPreName += 'zmg_';
	return eventPreName;
}

Log.prototype.createSubUuid = function () {
	let subUuid = new Date().getTime();
	this.subCoursewareUuid = subUuid;
	return subUuid;
}

function getEnvironment(query) {
	let evn = '';

	if (query.enviroment) {
		switch (query.enviroment) {
			case 'localhost':
			case 'test':
				evn = 'fat';
				break;
			case 'uat':
				evn = 'uat';
				break;
			case 'production':
				evn = 'prod';
				break;
		}
	}

	if (query.env) {
		switch (query.env) {
			case 'test':
				evn = 'fat';
				break;
			case 'uat':
				evn = 'uat';
				break;
			case 'prod':
				evn = 'prod';
				break;
		}
	}

	if (evn === '') {
		switch (window.location.hostname) {
			case '127.0.0.1':
			case 'localhost':
			case 'test.hdkj.zmlearn.com':
				evn = 'fat'
				break;
			case 'hdkj.uat.zmops.cc':
				evn = 'uat';
				break;
			case 'hdkj.zmlearn.com':
				evn = 'prod';
				break;
		}
	}

	return evn;
}

function getRequest(url) {
	const query = {};
	if (url.indexOf('?') !== -1) {
		const str = url.substr(1);
		const strs = str.split('&');
		for (let i = 0; i < strs.length; i++) {
			query[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
		}
	}
	return query;
}

window.addEventListener("error", function (evt) {
	let errObj = {};
	let isSend = true;

	errObj.errorMessage = evt.message;
	errObj.scriptURL = evt.filename;
	errObj.lineNumber = evt.lineno;
	errObj.columnNumber = evt.colno;
	if (evt.error) {
		errObj.errorObj = { message: evt.error.message, stack: evt.error.stack };
	}

	if (this.lastError &&
		lastError.errorMessage === errObj.errorMessage &&
		lastError.scriptURL === errObj.scriptURL &&
		lastError.lineNumber === errObj.lineNumber &&
		lastError.columnNumber === errObj.columnNumber) {
		this.count++;
	} else {
		this.count = 0;
		this.lastError = errObj;
	}
	isSend = this.count <= 2;

	if (window.hdLog) {
		if (isSend) {
			window.hdLog.send('jsErrorMsg', errObj, 0, 1);
		}
		window.hdLog.jsError += 1;
	}
});

document.addEventListener('error', function (event) {
	if (!event.target) {
		return;
	}
	var typeName = event.target.localName;
	var baseUrl = event.target.baseURI;
	var sourceUrl = "";

	if (event.target.href && event.target.href != '') {
		sourceUrl = event.target.href;
	} else if (event.target.src) {
		sourceUrl = event.target.src;
	}

	let errObj = {};
	errObj.typeName = typeName;
	errObj.baseUrl = baseUrl;
	errObj.sourceUrl = sourceUrl;

	if (window.hdLog) {
		window.hdLog.send('docErrorMsg', errObj, 0, 1);
		window.hdLog.docError += 1;
	}
}, true);

window.hdLog = new Log();