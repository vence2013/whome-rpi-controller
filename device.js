const rpio = require('rpio');
const moment = require('moment');
const schedule = require('node-schedule');


const Pindef = {
    'pump':15, 'irrigate':16,    /* output */
    'waterfull':27, 'soilwet':28 /* input  */
};


/*------------------------------ Direct Control ----------------------------*/

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


/*------------------------------- Auto Process ------------------------------*/

const Period_sec = 180; // 3 min
const Period_max = 20;  // 3 * 20 seconds = 60 min

/* inital data structure */
var Auto_ctl = {
    'cnt':0, 
    'start':null, // process start time
    'istop':true   // during the process, soil is wet, no need to continue
};

function auto_excute()
{
    let iswet = rpio.read(Pindef['soilwet']) ? false : true;

    set('pump');
    ((Auto_ctl['cnt'] < 2) && !iswet) ? set('irrigate') : clear('irrigate');

    Auto_ctl['cnt']++;
    if (Auto_ctl['cnt'] < Period_max)
        setTimeout(auto_excute, Period_sec * 1000);
    else
        auto_stop();
}

exports.auto_start = auto_start;
function auto_start()
{
    Auto_ctl['cnt'] = 0;
    Auto_ctl['istop'] = false;
    Auto_ctl['start'] = moment().format('hh:mm:ss');

    auto_excute();
}

exports.auto_stop = auto_stop;
function auto_stop()
{
    clear('pump');
    clear('irrigate');

    Auto_ctl['istop'] = true;
}

exports.auto_toggle = auto_toggle;
function auto_toggle()
{
    Auto_ctl['istop'] ? auto_start() : auto_stop();
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
        'start':Auto_ctl['start'],
        'istop':Auto_ctl['istop'],
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

    console.log('Device setup finished!');
}