var rpio = require('rpio');

function task_cb()
{
    console.log('task callback');

    setTimeout(task_cb, 1000);
}

exports.setup = async () =>
{
    rpio.open(27, rpio.INPUT);
    rpio.open(28, rpio.INPUT);

    rpio.open(15, rpio.OUTPUT, rpio.LOW);
    rpio.open(16, rpio.OUTPUT, rpio.LOW);

    setTimeout(task_cb, 1000);

    console.log('device setup finished!');
}