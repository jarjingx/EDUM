/*------------------------------------------------------------------

    Project:    Microsoft - LightHouse - EDUM

    Author:     Jiajing Xiong

    Email:      v-jiaxio@microsoft.com
                jarjingx@gmail.com

------------------------------------------------------------------*/

var projection = d3.geoMercator().center([116.3200819, 40.0026086]).translate([5244, 530]).scale([2250000]);
var x, y, r;
// 主楼：40.00063489  116.3263251
// 图书馆：40.00355714  116.3190488
// 美术学院：39.99834189  116.3299731

/*此处代码用于标定投影函数projection的偏移量和缩放量
[x, y] = projection([116.3263251, 40.00063489]);
d3.select("svg").append("circle").attr("cx", x).attr("cy", y).attr("r", "3").attr("fill", "white");
[x, y] = projection([116.3190488, 40.00355714]);
d3.select("svg").append("circle").attr("cx", x).attr("cy", y).attr("r", "3").attr("fill", "white");
[x, y] = projection([116.3299731, 39.99834189]);
d3.select("svg").append("circle").attr("cx", x).attr("cy", y).attr("r", "3").attr("fill", "white");
*/

// 人数要半径的映射函数
function getr(count) {
    return Math.sqrt(parseInt(count)) * 4;
}

// 时间信息输出函数
function print_time(t) {
    time = "";
    if (parseInt(t / 2) < 10)
        time = time + "0" + parseInt(t / 2) + ":";
    else
        time = time + parseInt(t / 2) + ":";
    if (t % 2)
        time = time + "30";
    else
        time = time + "00";
    d3.select("text#time").text(time);
}

// 视图刷新函数
function flash() {
    if (pause)
        if (paused)
            // 希望暂停，且已经暂停，则忽略更新
            return;
        else {
            // 希望暂停，但仍未暂停，则执行暂停操作  ！注意：为保证同步，暂停timeline后，地图数据需要再刷新一次
            $(".load").css("animation-play-state", "paused");
            $(".time").css("animation-play-state", "paused");
            paused = true;
        }
    else
        if (paused) {
            // 不希望暂停，但已经暂停，则启动        ! 注意：为保证同步，启动timeline后，本次不可刷新地图数据
            $(".load").css("animation-play-state", "running");
            $(".time").css("animation-play-state", "running");
            paused = false;
            return;
        }
    // 不希望暂停，且仍未暂停，继续执行后续逻辑刷新地图数据
    
    // 绘制代表建筑物人数的圆圈
    d3.select("svg").selectAll("circle.map")
        .transition()
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .attr("r", function (d) { return getr(d["Count" + t]); });

    // 绘制建筑物类型图标
    d3.select("svg").selectAll("image.map")
        .transition()
        .duration(duration)
        .attr("xlink:href", function (d) {
            if (getr(d["Count" + t]) < radius) return;
            if (d.ClusteredType == "classroom") return "icon/middle_map_dots_icon_classroom.png";
            if (d.ClusteredType == "administration") return "icon/middle_map_dots_icon_administration.png";
            if (d.ClusteredType == "dorm") return "icon/middle_map_dots_icon_dorm.png";
            if (d.ClusteredType == "gym") return "icon/middle_map_dots_icon_gym.png";
            if (d.ClusteredType == "library") return "icon/middle_map_dots_icon_library.png";
            if (d.ClusteredType == "restaurant") return "icon/middle_map_dots_icon_restaurant.png";
        });

    // 更新图例处各类型的数量
    d3.select("text#count_dorm").text(count[t].dorm.toString());
    d3.select("text#count_restaurant").text(count[t].restaurant.toString());
    d3.select("text#count_gym").text(count[t].gym.toString());
    d3.select("text#count_classroom").text(count[t].classroom.toString());
    d3.select("text#count_library").text(count[t].library.toString());

    // 更新 warning 标志
    if (t == 38)
        $("#warning").show();
    if (t == 43)
        $("#warning").hide();

    // 更新图例处的时间显示
    print_time(t);

    // 更新当前时间计数器
    // 引入 wait 用于插入 4秒（即4个迭代周期）的等待时长
    // 从而保证进度条走到 24:00 时画面整体静止 4秒 再继续从 8:00 开始显示
    // 因为每个时间图标（太阳、月亮）的变大时长为 4秒（4个迭代周期）
    // 为了保证最后一个图标和第一个图标不同时变大，特加入此等待周期
    t++;
    if (t > 48)
        if (wait < 3) {
            t = 48;
            wait++;
        }
        else {
            // 原始数据是用 0:00 开始的，但是设计图要求从 8:00 开始，对应 t = 16
            t = 16;
            wait = 0;
        }
}

// 以下为主程序部分

// t 用于控制迭代周期，每个迭代周期代表数据的半小时（t=0 代表 0:00 的数据，t=1 代表 0:30 的数据）
// 程序每 1 秒迭代一个周期（整体迭代逻辑参见 display.js）
var t = 16;
var wait = 0;
var text;
var x, y;
var radius = 80;  // 定义允许输出人数和图标的半径阈值
var duration = 1000;  // 定义地图上圆圈变形动画的持续时间
var test = 0;
// 以下两变量用于控制地图暂停启动逻辑
var paused = false;     // 记录当前地图是否暂停       true：已暂停    false：正运行
var pause = false;      // 记录当前是否需要地图暂停     true：需要暂停   false：需要启动

var switched = false;
var count = [];

d3.tsv("data/edum.tsv", function (data) {
    for (var i = 0; i <= 48; i++)
        count[i] = { classroom: 0, administration: 0, dorm: 0, gym: 0, library: 0, restaurant: 0, office: 0, service: 0, event: 0 };
    for (var i = 0; i < data.length; i++)
        for (var j = 0; j <= 48; j++)
            count[j][data[i].ClusteredType] += parseInt(data[i]["Count" + j]);

    // 产生各建筑物经纬度对像素坐标的投影
    for (var i = 0; i < data.length; i++) {
        // [x, y] = projection([data[i].ClusteredLongtitude, data[i].ClusteredLatitude]);
        var ref = projection([data[i].ClusteredLongtitude, data[i].ClusteredLatitude]);
        x = ref[0];
        y = ref[1];
        data[i].x = x;
        data[i].y = y;
    }
    
    // 绘制代表建筑物人数的圆圈
    d3.select("svg").selectAll("circle.map")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "map trigger away")
        .style("animation-play-state", "paused")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return getr(d["Count" + t]); })
        .attr("fill", function (d) {
            if (d.ClusteredType == "classroom") return "#01a01f";
            if (d.ClusteredType == "administration") return "#2c3eef";
            if (d.ClusteredType == "dorm") return "#9653ff";
            if (d.ClusteredType == "gym") return "#fa6b00";
            if (d.ClusteredType == "library") return "#00e2ff";
            if (d.ClusteredType == "restaurant") return "#ff40db";
            return "gray";
        })
        .attr("fill-opacity", "0.5");

    // 绘制建筑物类型图标
    d3.select("svg").selectAll("image.map")
        // d3 库绑定数据操作
        .data(data)
        // 建立占位符
        .enter()
        .append("image")
        .attr("class", "map trigger away")
        .style("animation-play-state", "paused")
        .attr("x", function (d) { return d.x - 25; })
        .attr("y", function (d) { return d.y - 34; })
        .attr("width", "50")
        .attr("height", "50")
        .attr("xlink:href", function (d) {
            // 生成各类型对应的 icon
            if (getr(d["Count" + t]) < radius) return;
            if (d.ClusteredType == "classroom") return "icon/middle_map_dots_icon_classroom.png";
            if (d.ClusteredType == "administration") return "icon/middle_map_dots_icon_administration.png";
            if (d.ClusteredType == "dorm") return "icon/middle_map_dots_icon_dorm.png";
            if (d.ClusteredType == "gym") return "icon/middle_map_dots_icon_gym.png";
            if (d.ClusteredType == "library") return "icon/middle_map_dots_icon_library.png";
            if (d.ClusteredType == "restaurant") return "icon/middle_map_dots_icon_restaurant.png";
        });
    // 更新图例处各类型的数量
    d3.select("text#count_dorm").text(count[t].dorm.toString());
    d3.select("text#count_restaurant").text(count[t].restaurant.toString());
    d3.select("text#count_gym").text(count[t].gym.toString());
    d3.select("text#count_classroom").text(count[t].classroom.toString());
    d3.select("text#count_library").text(count[t].library.toString());
    print_time(t);
    t++
});