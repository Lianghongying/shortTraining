//var HOST = 'http://119.29.69.229:9444';
var HOST = 'http://dxb.gdgbpx.com';
//var HOST = 'http://113.108.9.214:90';
//var HOST = 'http://172.16.35.177:8080';

function sdScan(){     
        sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, Uri.parse("file://"    
                    + Environment.getExternalStorageDirectory())));     
    }

function getVersion() {
	return '1.7.6';
}

function getToken() {
	return localStorage.getItem('token');
}

function getLoginTime() {
	return localStorage.getItem('loginTime');
}

//检测登录状态
function checkLoginStatus() {
	var userId = getUserId();
	if(!userId || userId == '') {
		return false;
	}
	return true;
}
//获取用户编号
function getUserId() {
	return localStorage.getItem('userId');
}
//获取用户信息
function getUserInfo() {
	return JSON.parse(localStorage.getItem('userData') || '{}');
}
//显示登录页面
function showLoginPage(extras) {
	return mui.openWindow({
		url: 'login.html',
		id: 'login.html',
		show: {
			aniShow: 'slide-out-bottom'
		},
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '请登录...' //等待对话框上显示的提示内容
		},
		extras: extras
	});
}

//打开设置身份证页面
function openSetIDCardPage() {
	return mui.openWindow({
		url: 'setIDCard.html',
		id: 'setIDCard.html',
		show: {
			aniShow: 'slide-out-bottom'
		},
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '正在加载...' //等待对话框上显示的提示内容
		}
	});
}
//异步请求
function ajax(req) {
	req = mui.extend(true, {
		type: 'GET',
		url: '',
		headers: {
			version: getVersion(),
			token: getToken(),
			loginTime: getLoginTime()
		},
		timeout: 10000,
		contentType: 'application/json',
		success: function(data, t, xhr) {},
		error: function(xhr, type, errorThrown) {}
	}, req);
	return mui.ajax(HOST + req.url, {
		headers: req.headers,
		data: req.data,
		contentType: req.contentType,
		dataType: 'json', //服务器返回json格式数据
		type: req.type, //HTTP请求类型
		timeout: 20000, //超时时间设置为20秒；
		success: function(data, t, xhr) {
			plus.nativeUI.closeWaiting();
			if(data.code == '10001' && req.url != '/training/user/login' && req.url.indexOf('/training/version/check') == -1) {
				plus.nativeUI.closeWaiting();
				mui.back();
				showLoginPage();
			} else {
				req.success(data, t, xhr);
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			req.error(xhr, type, errorThrown);
		}
	});
}
//检测是否成功
function ajaxSuccess(json) {
	if(json.hasOwnProperty('code') && json.code == '1') {
		return true;
	}
	return false;
};

// 获取url参数
function getUrlParam(strParame) {
	var args = new Object();
	var query = location.search.substring(1);
	var pairs = query.split('&');
	for(var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');
		if(pos == -1) {
			continue;
		}
		var argname = pairs[i].substring(0, pos);
		var value = pairs[i].substring(pos + 1);
		args[argname] = value;
	}
	return args[strParame];
};

// 日期格式话
function dateFormat(date, fmt) {
	if(!date || date == undefined || !fmt || fmt == undefined || fmt == '') {
		return '';
	}
	var o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds()
		// 毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	return fmt;
};

//身份证号码校验
function identityCodeValid(code) { //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
	var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
	if(reg.test(code) === false) {
		return false;
	}
	return true;
}

// 日期格式话
function util_dateFormat(date, fmt) {
	if(!date || date == undefined || !fmt || fmt == undefined || fmt == '') {
		return '';
	}
	var o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds()
		// 毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	return fmt;
};

//显示版本更新提示框
function newVersionConfirm(version) {
	var btnArray = ['立即更新', '取消'];
	if(version.forceUpdate && version.forceUpdate == 'true') {
		btnArray = ['立即更新'];
	}
	mui.confirm(version.versionDesc, '发现新版本 ' + version.currentVersion, btnArray, function(e) {
		if(e.index == 0) {
			var url = '';
			if(version.clientType == 'iOS') {
				url = version.downLoadUrl;
			} else {
				url = HOST + '/training/filesys/download/' + version.downLoadUrl;
			}
			plus.runtime.openURL(url);
			plus.runtime.quit();
		} else {
			if(version.forceUpdate && version.forceUpdate == 'true') {
				showVersionConfirm(version);
			}
		}
	});
}
//版本检查
function newVersionCheck() {
	var clientType = plus.os.name;
	ajax({
		url: '/training/version/check?clientType=' + encodeURIComponent(clientType) + '&id=' + encodeURIComponent(getVersion()),
		type: 'GET',
		success: function(json) {
			if(ajaxSuccess(json)) {
				if(json.data && json.data.id && json.data.downLoadUrl && json.data.downLoadUrl != '') {
					newVersionConfirm(json.data);
				}
			}
		}
	});
}