const base64Img = require('base64-img');
const postcss = require('postcss');
const less = require('less');
const {watchTree} = require('fs-watch-tree');
const fs = require('fs-extra');
const nodeFileEval = require('node-file-eval');
const walk = require('klaw-sync');
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { resolve, join, relative } = require('path');
const config = require('./dev.config.js');

const HOST_FROM_CFG = config.getHost(process);

const HTTPS_OPTS = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const css2wxss = (path, cont)=>{
	path = relative(__dirname, path);
	const wxss = path.replace(/^src\/less\//, 'public/').replace(/\.less$/, '.wxss');
	cont = cont.replace(/\/\*wxss\={2}\s(.*?)\s\={2}wxss\*\//g, "$1;\r\n");
	fs.writeFileSync(wxss, `/*由 ${path} 生成，请勿手动修改以免被覆盖！*/\r\n${cont}`);
	console.log(wxss, 'saved!');
};

const parseFont = css=>{
	const re = /\'(.*\.(?:ttf|otf))\'/gi;
	let exec, font, size, map={};
	while(exec = re.exec(css)) {
		font = resolve(__dirname, exec[1]);
		if (!fs.existsSync(font)) {
			console.warn('!FONT NOT EXIST!', font);
			continue;
		}
		size = fs.statSync(font).size;
		map[font] = map[font] || base64Img.base64Sync(font);
		console.log('base64:', font, map[font].substring(0, 100) + '...');
		css = css.replace(exec[1], map[font]);
	}
	return css;
};

const parseImg = css=>{
	const re = /\'(.*\.(?:jpg|jpeg|gif|png|svg))\'/gi;
	let exec, origin, img, size, map={};
	while(exec = re.exec(css)) {
		origin = exec[1];
		img = resolve(__dirname, origin);
		if (!fs.existsSync(img)) {
			console.warn('!IMAGE NOT EXIST!', img);
			continue;
		}
		size = fs.statSync(img).size;
		if ( !/\.svg$/.test(origin) && size < 1024 * 20 ) { //svg的base64，小程序无法正确显示
			map[img] = map[img] || base64Img.base64Sync(img);
			console.log('base64:', img, map[img].substring(0, 100) + '...');
		} else {
			map[img] = map[img] || origin.replace(/^assets/, `${config.mock_protocal}://${HOST_FROM_CFG}:${config.mock_port}/assets`);
			console.log('absolute path:', img);
		}
		css = css.replace(`('${origin}`, `('${map[img]}`);
	}
	return css;
};

const parseLess = path=>{
	const lessCont = fs.readFileSync(path, 'utf8').replace(
    	/(\@import\s.*?\.wxss[\'|\"])(?:\s+)?\;/g, 
    	"/*wxss== $1 ==wxss*/"
    );
    return less.render(lessCont, {paths: ['./src/less']})
    	.then(output=>output.css)
    	.then(parseFont)
    	.then(parseImg)
    	.then(cont=>css2wxss(path, cont));
};

const parseAllLess = ()=>{
	const lessFiles = walk(
		resolve(__dirname, "src/less"),  {
			nodir: true
		}).map(p=>p.path)
		.filter(path=>/\.less$/.test(path))
		.filter(path=>/\/less\/(?!\_)/.test(path));
	return Promise.all(lessFiles.map(parseLess))
		.then(()=>console.log('👌  所有less已处理完毕!'));
};

const parseDevConfig = ()=>{
	const path = relative(__dirname, 'dev.config.js');
	const dist = resolve(__dirname, 'public/app.config.js');

	nodeFileEval('./dev.config.js').then(dcfg=>{
		const cfg = {
			mock_host: dcfg.getHost(process),
			mock_port: dcfg.mock_port,
			mock_prefix: dcfg.mock_prefix,
			mock_protocal: dcfg.mock_protocal
		};
		const cont = 'module.exports = ' + JSON.stringify(cfg, null, 2);
		fs.writeFileSync(dist, `/*由 ${path} 生成，请勿手动修改以免被覆盖！*/\r\n${cont}`);
		console.log(dist, 'saved!');
	});
}

//reset模式
if (process.argv.length > 2 && process.argv[2] === '--reset') {
	parseAllLess();
	parseDevConfig();
	return;
}

//监听less自动编译为wxss, 并编码其中的图片
watchTree("./src/less", {
    exclude: [/\.(?!less$)/]
}, function (event) {
	const { name } = event;
    if (event.isDirectory() || !/\.less$/.test(name)) return;
    if (event.isDelete()) {
    	css2wxss(name, '');
    	return;
    }
    if (/\_.*?\.less$/.test(name)) {
		parseAllLess();
    	return;
    }
    parseLess(name);
});
console.log('watching less...');

//监听环境配置文件等
watchTree("./", {
    exclude: [
    	".git",
    	"node_modules",
    	"src"
    ]
}, event=> {
	const { name } = event;
    if (event.isDirectory() || !/\.js$/.test(name)) return;
	if (/dev\.config\.js$/.test(name)) {
    	parseDevConfig();
    	return;
    }
});
console.log('watching config...');


//启动mock服务器
const runserver = (port, dir)=>{
	const app = new express;
	app.set('views', __dirname + '/');
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(express.static(dir, {}));
	app.all('*', function(req, res, next) {  
	    res.header("Access-Control-Allow-Origin", `*`);
	    res.header("Access-Control-Allow-Credentials", true);
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
	    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
	    res.header("Content-Type", "application/json;charset=utf-8");  
	    next();  
	});
	const server = https.createServer(HTTPS_OPTS, app);
	const api = walk(config.mock_path)
		.map(p=>p.path)
		.filter(path=>/\.js$/.test(path))
		.forEach(part=>require(part)(app, config.mock_prefix));
	app.set('port', port);
	let host = HOST_FROM_CFG;
    server.listen(port, host);
    server.on('listening', e=>console.log(`server run at ${config.mock_protocal}://${host}:${port} (${dir})`));
}
runserver(config.mock_port, './');