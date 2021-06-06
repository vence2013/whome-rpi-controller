const rpio = require('rpio');
const moment = require('moment');
const schedule = require('node-schedule');


const Pindef = {
    'pump':15, 'irrigate':16,    /* output */
    'waterfull':27, 'soilwet':28 /* input  */
};


/****************************** Direct Control ******************************/

/* inital data structure */
var Pinval = {'pump':false, 'irrigate':false};


function fullcheck_cb()
{
    let isfull = rpio.read(Pindef['waterfull']) ? false : true;

    /* water is full, close pump */
    if (Pinval['pump'])
    {
        if (isfull)
            clear('pump');
    }

    /* open if pump opered */
    if (Pinval['pump'])
        setTimeout(fullcheck_cb, 1000);
}

exports.set = set;
function set( type )
{
    let pin = Pindef[ type ];

    Pinval[ type ] = true;
    rpio.write(pin, rpio.HIGH);

    setTimeout(fullcheck_cb, 1000);
}

exports.clear = clear;
function clear( type )
{
    let pin = Pindef[ type ];

    Pinval[ type ] = false;
    rpio.write(pin, rpio.LOW);
}

exports.toggle = toggle;
function toggle( type )
{
    let val = Pinval[ type ];

    val ?  clear(type) : set(type);
}


/************************* Auto Filter Process *******************************/

/* inital data structure */
var Autofilter_ctl = {
    'seconds':0, 
    'start':null, // process start time
    'stop':true   // during the process, soil is wet, no need to continue
};

exports.autofilter_start = autofilter_start;
function autofilter_start()
{
    Autofilter_ctl['seconds'] = 0;
    Autofilter_ctl['start']   = moment().format('hh:mm:ss');
    Autofilter_ctl['stop']    = false;

    let iswet = rpio.read(Pindef['soilwet']) ? false : true;
    if (iswet) 
        autofilter_stop();        
}

exports.autofilter_stop = autofilter_stop;
function autofilter_stop()
{
    clear('irrigate');

    Autofilter_ctl['stop'] = true;
}

exports.autofilter_toggle = autofilter_toggle;
function autofilter_toggle()
{
    Autofilter_ctl['stop'] ? autofilter_start() : autofilter_stop();
}

exports.status = () =>
{
    /* active at low */
    let isfull = rpio.read(Pindef['waterfull']) ? false : true;
    let iswet  = rpio.read(Pindef['soilwet']) ? false : true;

    return {
        'pump':Pinval['pump'], 
        'irrigate':Pinval['irrigate'], 
        'waterfull':isfull, 
        'soilwet':iswet,
        'now'  :moment().format('hh:mm:ss'),
        'start':Autofilter_ctl['start'],
        'stop':Autofilter_ctl['stop'],
    };
}


exports.setup = async () =>
{
    rpio.open(Pindef['waterfull'], rpio.INPUT);
    rpio.open(Pindef['soilwet'],   rpio.INPUT);

    rpio.open(Pindef['pump'],     rpio.OUTPUT, rpio.LOW);
    rpio.open(Pindef['irrigate'], rpio.OUTPUT, rpio.LOW);

    clear('pump');
    clear('irrigate');
    autofilter_stop();

    console.log('Device setup finished!');
}