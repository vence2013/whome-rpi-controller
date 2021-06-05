function direct_ctl(type)
{
    $.get("/control/"+type, (res) => { display_status(res); });
}

function autofilter()
{
    $.get("/autofilter", (res) => { display_status(res); });
}

function display_status(status)
{
    $(".direct_ctl").find(".btn")
    .removeClass("btn-secondary btn-success");
    $("#pump").addClass(status['pump'] ? 'btn-success' : 'btn-secondary');
    $("#irrigate").addClass(status['irrigate'] ? 'btn-success' : 'btn-secondary');

    /* 输入状态 */
    $(".input_status").find(".alert")
    .removeClass("alert-secondary alert-warning");

    $("#waterfull")
    .text(status['waterfull'] ? '水已满' : '水未满')
    .addClass(status['waterfull'] ? 'alert-warning' : 'alert-secondary');

    $("#soilwet")
    .text(status['soilwet'] ? '湿度已够' : '湿度不足')
    .addClass(status['soilwet'] ? 'alert-warning' : 'alert-secondary');
}

function query_status()
{
    $.get("/status", (res) => { display_status(res); });
}