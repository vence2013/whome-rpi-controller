const rpio = require('rpio');


const Pindef = {
    'pump':15, 'irrigate':16,    /* output */
    'waterfull':27, 'soilwet':28 /* input  */
};
var Pinval = {};

exports.toggle = (type) =>
{
    let pin = Pindef[ type ];
    let val = Pinval[ type ];

    /* toggle */
    Pinval[ type ] = !val;
    rpio.write(pin, val ? rpio.LOW : rpio.HIGH);
}

exports.status = () =>
{
    let isfull = rpio.read(Pindef['waterfull']);
    let iswet  = rpio.read(Pindef['soilwet']);

    return {'pump':Pinval['pump'], 'irrigate':Pinval['irrigate'], 'waterfull':isfull, 'soilwet':iswet};
}


function task_cb()
{
    console.log('task callback');

    setTimeout(task_cb, 1000);
}

exports.setup = async () =>
{
    Pinval['pump']     = 0;
    Pinval['irrigate'] = 0;

    rpio.open(Pindef['waterfull'], rpio.INPUT);
    rpio.open(Pindef['soilwet'],   rpio.INPUT);

    rpio.open(Pindef['pump'],     rpio.OUTPUT, rpio.LOW);
    rpio.open(Pindef['irrigate'], rpio.OUTPUT, rpio.LOW);

    setTimeout(task_cb, 1000);

    console.log('Device setup finished!');
}