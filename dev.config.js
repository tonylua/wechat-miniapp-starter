const os = require('os');
const { resolve } = require('path');

exports.getHost = function(process) {
	let _host = 'localhost';

	if (!process)
		return _host;

	// console.log("DEV.CONFIG.JS", process.env.npm_config_argv);
	
	const { original } = JSON.parse(process.env.npm_config_argv);
	let ip_param;
	
	if (original[0] === 'run' && /^(start|preview|mock)$/.test(original[1])) {
		ip_param = original[2];
	} else if (original[0] === 'start') {
		ip_param = original[1];
	} else {
		return _host;
	}

	if (!/^\-ip\=.+$/.test(ip_param))
		return _host;

	if (ip_param === '-ip=1') {
		try {
			let interfaces = os.networkInterfaces();
			let addresses = [];
			for (let k in interfaces) {
			    for (let k2 in interfaces[k]) {
			        let address = interfaces[k][k2];
			        if (address.family === 'IPv4' && !address.internal) {
			            addresses.push(address.address);
			        }
			    }
			}

			_host = addresses[0];
		} catch(ex) {
			console.log(ex);
		}
	} else {
		_host = ip_param.substr(4);
	}

	return _host;
};

exports.mock_port = 7001;
exports.mock_path = resolve(__dirname, 'api');
exports.mock_prefix = '/weappmini';
exports.mock_protocal = 'http';