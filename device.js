const rpio = require('rpio');


const Pindef = {
    'pump':15, 'irrigate':16,    /* output */
    'waterfull':27, 'soilwet':28 /* input  */
};
var Pinval = {};

exports.toggle = toggle;
function toggle( type )
{
    let pin = Pindef[ type ];
    let val = Pinval[ type ];

    /* toggle */
    Pinval[ type ] = !val;
    rpio.write(pin, val ? rpio.LOW : rpio.HIGH);
}

exports.set = set;
function set( type )
{
    let pin = Pindef[ type ];

    Pinval[ type ] = true;
    rpio.write(pin, rpio.HIGH);
}

exports.clear = clear;
function clear( type )
{
    let pin = Pindef[ type ];

    Pinval[ type ] = false;
    rpio.write(pin, rpio.LOW);
}

exports.status = () =>
{
    /* active at low */
    let isfull = rpio.read(Pindef['waterfull']) ? false : true;
    let iswet  = rpio.read(Pindef['soilwet']) ? false : true;

    return {'pump':Pinval['pump'], 'irrigate':Pinval['irrigate'], 'waterfull':isfull, 'soilwet':iswet};
}


function task_cb()
{
    let isfull = rpio.read(Pindef['waterfull']) ? false : true;

    /* water is full, close pump */
    if (Pinval['pump'])
    {
        if (isfull)
            clear('pump');
    }

    setTimeout(task_cb, 1000);
}

exports.setup = async () =>
{
    Pinval['pump']     = true;
    Pinval['irrigate'] = true;

    rpio.open(Pindef['waterfull'], rpio.INPUT);
    rpio.open(Pindef['soilwet'],   rpio.INPUT);

    rpio.open(Pindef['pump'],     rpio.OUTPUT, rpio.LOW);
    rpio.open(Pindef['irrigate'], rpio.OUTPUT, rpio.LOW);

    setTimeout(task_cb, 1000);

    console.log('Device setup finished!');
}