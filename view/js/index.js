function direct_ctl(type)
{
    $.get("/control/"+type, (res) => {
        console.log(res);

        $(".direct_ctl").find(".btn")
        .removeClass("btn-secondary btn-success");
        $("#pump").addClass(res['pump'] ? 'btn-success' : 'btn-secondary');
        $("#irrigate").addClass(res['irrigate'] ? 'btn-success' : 'btn-secondary');

        /* 输入状态 */
        $(".input_status").find(".alert")
        .removeClass("alert-secondary alert-warning");

        $("#waterfull")
        .text(res['waterfull'] ? '水已满' : '水未满')
        .addClass(res['waterfull'] ? 'alert-warning' : 'alert-secondary');

        $("#soilwet")
        .text(res['soilwet'] ? '湿度已够' : '湿度不足')
        .addClass(res['soilwet'] ? 'alert-warning' : 'alert-secondary');
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