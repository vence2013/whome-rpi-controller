const Router = require('koa-router');
var router = new Router();


router.get('/', async (ctx)=>{
    await ctx.render('view/index.html', {'name':'rpi controller'}); 
})

router.get('/gpio/:gpiox', async (ctx)=>{
    let params = ctx.params;
    
    console.log(params);
    ctx.body = 'SUCCESS';
})


module.exports = router;