const Device = require("../device");
const Router = require('koa-router');
var router = new Router();


router.get('/', async (ctx) => 
{
    await ctx.render('view/index.html', {'name':'rpi controller'}); 
})

router.get('/control/:type', async (ctx) => 
{
    let params = ctx.params;    
    let type = params.type;

    Device.toggle( type );    
    ctx.body = Device.status();
})

router.get('/auto', async (ctx) => 
{
    Device.autofilter_toggle();    
    ctx.body = Device.status();
})

router.get('/status', async (ctx) => 
{
    ctx.body = Device.status();
})

module.exports = router;