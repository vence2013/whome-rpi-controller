const Router = require('koa-router');
var router = new Router();

router.get('/', async (ctx)=>{
    await ctx.render('view/index.html', {'name':'rpi controller'}); 
})

module.exports = router;