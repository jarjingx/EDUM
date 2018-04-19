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

// ͨ����ťѡ��ͼ��
$("div#button_A").click(function () {
    // ͨ���ı� class �޸İ�ť��ۣ�ѡ����δѡ�еİ�ť��۲�ͬ��
    $("div#button_A").removeClass("button_off");
    $("div#button_B").removeClass("button_on");
    $("div#button_A").addClass("button_on");
    $("div#button_B").addClass("button_off");
    // �л�ͼ�����ֲ�
    $("div#chart_A_mask").show();
    $("div#chart_B_mask").hide();
    // �л�ͼ��
    $("iframe#chart_A").show();
    $("iframe#chart_B").hide();
})

// ��һ�δ���ľ������
$("div#button_B").click(function () {
    $("div#button_A").removeClass("button_on");
    $("div#button_B").removeClass("button_off");
    $("div#button_A").addClass("button_off");
    $("div#button_B").addClass("button_on");
    $("div#chart_A_mask").hide();
    $("div#chart_B_mask").show();
    $("iframe#chart_A").hide();
    $("iframe#chart_B").show();
    // �鿴��ͼ�� B ��������л�����������
    // switch_trigger ���ڼ�¼�Ƿ������л�
    switch_trigger = true;
})

// �˴��������ڿ�������'s'���������չʾЧ��
// ���������ɺ�ֻ��ʾ���Ҳ��ͼ���м�ĵ�ͼ�Լ�������ͼ
// ��һ��'s'������ʱ�����ű������֣�������Ŀ��ʼ���֣���ͼ���ݿ�ʼ����
// �ڶ���'s'������ʱ����ͼ�������أ�ѧ���Ա�ͼ����
// trigger_count ���ڼ�¼��ǰ�û�'s'���Ĵ���
$(document).keypress(function (event) {
    if (event.keyCode == 83 || event.keyCode == 115) {
        trigger_count++;
        if (trigger_count == 1) {
            // ���ű�������
            document.getElementById("bgm").play();
            // ���� PowerBI ͼ��
            // ע�⣺
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