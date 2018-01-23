/*------------------------------------------------------------------

    Project:    Microsoft - LightHouse - EDUM

    Author:     Jiajing Xiong

    Email:      v-jiaxio@microsoft.com
                jarjingx@gmail.com

------------------------------------------------------------------*/

$(".trigger").css("animation-play-state", "paused");
var trigger_count = 0;
var scan_trigger = false;
$("div#chart_A_mask").hide();
$("div#chart_B_mask").hide();
$("div#button_A").hide();
$("div#button_B").hide();
$(".card").hide();
$(".card_info").hide();

$("div#button_map").click(function () {
    pause = !pause;
    if (pause)
        $("div#button_map").html("start");
    else
        $("div#button_map").html("pause");
})

$("div#button_A").click(function () {
    $("div#button_A").removeClass("button_off");
    $("div#button_B").removeClass("button_on");
    $("div#button_A").addClass("button_on");
    $("div#button_B").addClass("button_off");
    $("div#chart_A_mask").show();
    $("div#chart_B_mask").hide();
    $("iframe#chart_A").show();
    $("iframe#chart_B").hide();
})

$("div#button_B").click(function () {
    $("div#button_A").removeClass("button_on");
    $("div#button_B").removeClass("button_off");
    $("div#button_A").addClass("button_off");
    $("div#button_B").addClass("button_on");
    $("div#chart_A_mask").hide();
    $("div#chart_B_mask").show();
    $("iframe#chart_A").hide();
    $("iframe#chart_B").show();
    $(".card").show();
    $(".card_info").show();
    scan_trigger = true;
})

$(document).keypress(function (event) {
    if (event.keyCode == 83 || event.keyCode == 115) {
        trigger_count++;
        if (trigger_count == 1) {
            document.getElementById("bgm").play();
            $("iframe#chart_A").hide();
            $("iframe#chart_B").hide();
            $("iframe#chart_A").addClass("trigger");
            $("iframe#chart_B").addClass("trigger");
            $("div#chart_mask").hide();
            $(".trigger").css("animation-play-state", "running");
            setTimeout(function () {
                $("div#chart_A_mask").show();
                $("iframe#chart_A").show();
                $("div#button_A").show();
                $("div#button_B").show();
            }, 8000);
            for (var i = 1; i < 10000; i++)
                setTimeout(flash, 4000 + 1000 * i);
        }
        if (trigger_count == 2)
            if (scan_trigger) {
                $(".scan").css("animation-play-state", "running");
                setTimeout(function () {
                    $(".result").css("animation-play-state", "running");
                }, 19000);
            }
            else
                trigger_count = 1;
    }
})