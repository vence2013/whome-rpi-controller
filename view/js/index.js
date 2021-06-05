function direct_ctl(type)
{
    $.get("/control/"+type, (res) => {
        console.log(res);
    });
}

function gpio_set(pin)
{
    let val;

    if (15 == pin)
        val = $("#ctl1").is(':checked') ? 1 : 0;
    else if (16 == pin)
        val = $("#ctl2").is(':checked') ? 1 : 0;
    else 
        val = $("#ctl3").is(':checked') ? 1 : 0;

    console.log(pin, val);
    $.get("/gpio/"+pin+"?set="+val, (res) => {
        console.log(res);
    });
}

function status_query()
{
    $.get("/status", (res) => {
        console.log(res);
        $("#water").text(res.water);
        $("#solid").text(res.solid);
    });
}