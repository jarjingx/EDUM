/*------------------------------------------------------------------

    Project:    Microsoft - LightHouse - EDUM

    Author:     Jiajing Xiong

    Email:      v-jiaxio@microsoft.com
                jarjingx@gmail.com

------------------------------------------------------------------*/

$(".come").hide()
$(".trigger").css("animation-play-state", "paused");
var trigger_count = 0;
var switch_trigger = false;
$("div#chart_A_mask").hide();
$("div#chart_B_mask").hide();
$("div#button_A").hide();
$("div#button_B").hide();
$(".card").hide();
$(".card_info").hide();
$("#warning").hide();
$(".result").hide();

$("div#button_map").click(function () {
    pause = !pause;
    if (pause)
        $("div#button_map").html("start");
    else
        $("div#button_map").html("pause");
})

// 通过按钮选择图表
$("div#button_A").click(function () {
    // 通过改变 class 修改按钮外观（选中与未选中的按钮外观不同）
    $("div#button_A").removeClass("button_off");
    $("div#button_B").removeClass("button_on");
    $("div#button_A").addClass("button_on");
    $("div#button_B").addClass("button_off");
    // 切换图表遮罩层
    $("div#chart_A_mask").show();
    $("div#chart_B_mask").hide();
    // 切换图表
    $("iframe#chart_A").show();
    $("iframe#chart_B").hide();
})

// 上一段代码的镜像操作
$("div#button_B").click(function () {
    $("div#button_A").removeClass("button_on");
    $("div#button_B").removeClass("button_off");
    $("div#button_A").addClass("button_off");
    $("div#button_B").addClass("button_on");
    $("div#chart_A_mask").hide();
    $("div#chart_B_mask").show();
    $("iframe#chart_A").hide();
    $("iframe#chart_B").show();
    // 查看过图表 B 后才允许切换中央区内容
    // switch_trigger 用于记录是否允许切换
    switch_trigger = true;
})

// 此处代码用于控制两次's'键触发后的展示效果
// 界面加载完成后只显示左右侧底图和中间的地图以及出勤率图
// 第一次's'键触发时，播放背景音乐，各个栏目开始呈现，地图数据开始滚动
// 第二次's'键触发时，地图区域隐藏，学生对比图出现
// trigger_count 用于记录当前敲击's'键的次数
$(document).keypress(function (event) {
    if (event.keyCode == 83 || event.keyCode == 115) {
        trigger_count++;
        if (trigger_count == 1) {
            // 播放背景音乐
            document.getElementById("bgm").play();
            // 隐藏 PowerBI 图表
            // 注意：
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
            if (switch_trigger) {
                $(".away").hide();
                $(".come").show();
            }
            else
                trigger_count = 1;
    }
})