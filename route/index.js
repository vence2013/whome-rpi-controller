const Router = require('koa-router');
var router = new Router();
var rpio = require('rpio');


rpio.open(16, rpio.OUTPUT, rpio.LOW);

router.get('/', async (ctx)=>{
    await ctx.render('view/index.html', {'name':'rpi controller'}); 
})

router.get('/gpio/:gpiox', async (ctx)=>{
    let params = ctx.params;
    let query  = ctx.query;
    
    let gpio = parseInt(params.gpiox);
    let value= parseInt(query.set);
    //console.log(gpio, value);
    rpio.write(gpio, value ? rpio.HIGH : rpio.LOW);
    
    ctx.body = 'SUCCESS';
})


module.exports = router;