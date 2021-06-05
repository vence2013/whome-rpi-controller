const path  = require('path');

const Koa   = require('koa');
const Body    = require('koa-body');
const Views   = require('koa-views');
const Logger  = require('koa-logger');
const StaticServer = require('koa-static-server');

const glob      = require('glob'); 
const compose   = require('koa-compose');

const Device = require("./device");

const app = new Koa();

/* 加载子网站 */
function loads()
{
    var routedirs   = [ path.join(__dirname, 'route') ],
        controldirs = [ path.join(__dirname, 'control') ];        

    /* 加载控制文件(control/ *)
     * 包括根目录的控制文件和子网站的控制文件
     */
    var controls = [];
    app.context.controls = controls;
    // 导入控制文件
    for (var i=0; i<controldirs.length; i++) {
        glob.sync(controldirs[i]+"/*.js").map((file)=>{
            var fileObj = path.parse(file);
            var dirlist = fileObj.dir.split('/');

            var key = (dirlist.length==3) ? fileObj.name : dirlist.slice(-2)[0]+'/'+fileObj.name;
            controls[ key ] = require(file);
        });
    }

    /* 加载路由(route/ *)
     */
    var routers = [];
    // 导入路由文件
    for (var i=0; i<routedirs.length; i++) {
        glob.sync(routedirs[i]+"/*.js").map((file)=>{
            var router = require(file);
            router.prefix('');

            routers.push(router.routes());
            routers.push(router.allowedMethods());
        });
    }

    return compose(routers);
}

app
.use(StaticServer({ rootDir: 'node_modules', rootPath: '/node_modules' }))
.use(StaticServer({ rootDir: 'view', rootPath: '/view' }))
.use(Body({ multipart: true, formidable: { maxFileSize: 1024*1024*1024 } /* 单个文件小于1GB */ }))
.use(Views(__dirname, { map: {html: 'underscore'} }))
.use(Logger())
.use(loads());

Device.setup();

app.listen(8000);
console.log("Server Listening at 8000!");