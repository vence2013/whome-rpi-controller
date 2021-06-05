const Device = require("./device");
const Router = require('koa-router');
var router = new Router();


router.get('/', async (ctx)=>{
    await ctx.render('view/index.html', {'name':'rpi controller'}); 
})

router.get('/control/:type', async (ctx)=>{
    let params = ctx.params;    
    let type = params.type;

    console.log(type);
    
    ctx.body = 'SUCCESS';
})

/*
router.get('/gpio/:gpiox', async (ctx)=>{
    let params = ctx.params;
    let query  = ctx.query;
    
    let gpio = parseInt(params.gpiox);
    let value= parseInt(query.set);
    rpio.write(gpio, value ? rpio.HIGH : rpio.LOW);
    
    ctx.body = 'SUCCESS';
})

router.get('/status', async (ctx)=>{

    let water = rpio.read(27);
    let solid = rpio.read(28);

    let res = {'water':water, 'solid':solid};
    console.log(res);
    ctx.body = res;
})
*/

module.exports = router;