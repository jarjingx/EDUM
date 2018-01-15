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
    // 标注建筑物人数
    d3.select("svg").selectAll("text.map1")
        .transition()
        .duration(duration)
        .text(function (d) { return getr(d["Count" + t]) < radius ? "" : d["Count" + t]; })
    // 标注建筑物人数
    d3.select("svg").selectAll("text.map2")
        .transition()
        .duration(duration)
        .text(function (d) { return getr(d["Count" + t]) < radius0 || getr(d["Count" + t]) > radius ? "" : d["Count" + t]; })
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
    print_time(t);
    t++;
    if (t > 48)
        if (wait < 3) {
            t = 48;
            wait++;
        }
        else {
            t = 16;
            wait = 0;
        }
}

// 以下为主程序部分
var t = 16;
var wait = 0;
var text;
var x, y;
var radius = 80;  // 定义允许输出人数和图标的半径阈值
var radius0 = 30; // 定义允许输出人数的半径阈值
var duration = 1000;  // 定义动画持续时间
var test = 0;
var paused = false;
var pause = false;
d3.tsv("data/edum.tsv", function (data) {
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
        .attr("class", "map trigger")
        .style("animation-play-state", "paused")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return getr(d["Count" + t]); })
        .attr("fill", function (d) {
            if (d.ClusteredType == "classroom") return "#01a01f";
            if (d.ClusteredType == "administration") return "#2c3eef";
            if (d.ClusteredType == "dorm") return "#9653ff";
            if (d.ClusteredType == "gym") return "#fff800";
            if (d.ClusteredType == "library") return "#00e2ff";
            if (d.ClusteredType == "restaurant") return "#ff40db";
            return "gray";
        })
        .attr("fill-opacity", "0.5");
    // 标注建筑物人数（ 靠下放置 ）
    d3.select("svg").selectAll("text.map1")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "map1 trigger")
        .style("animation-play-state", "paused")
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y + 38; })
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-family", "GothamBook")
        .attr("font-size", "16px")
        .text(function (d) { return getr(d["Count" + t]) < radius ? "" : d["Count" + t]; })
    // 标注建筑物人数（ 中心放置 ）
    d3.select("svg").selectAll("text.map2")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "map2 trigger")
        .style("animation-play-state", "paused")
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y + 6; })
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-family", "GothamBook")
        .attr("font-size", "16px")
        .text(function (d) { return getr(d["Count" + t]) < radius0 || getr(d["Count" + t]) > radius ? "" : d["Count" + t]; })
    // 绘制建筑物类型图标
    d3.select("svg").selectAll("image.map")
        .data(data)
        .enter()
        .append("image")
        .attr("class", "map trigger")
        .style("animation-play-state", "paused")
        .attr("x", function (d) { return d.x - 25; })
        .attr("y", function (d) { return d.y - 38; })
        .attr("width", "50")
        .attr("height", "50")
        .attr("xlink:href", function (d) {
            if (getr(d["Count" + t]) < radius) return;
            if (d.ClusteredType == "classroom") return "icon/middle_map_dots_icon_classroom.png";
            if (d.ClusteredType == "administration") return "icon/middle_map_dots_icon_administration.png";
            if (d.ClusteredType == "dorm") return "icon/middle_map_dots_icon_dorm.png";
            if (d.ClusteredType == "gym") return "icon/middle_map_dots_icon_gym.png";
            if (d.ClusteredType == "library") return "icon/middle_map_dots_icon_library.png";
            if (d.ClusteredType == "restaurant") return "icon/middle_map_dots_icon_restaurant.png";
        });
    print_time(t);
    t++
    //$(".map").hide();
    //$(".map1").hide();
    //$(".map2").hide();
    //setTimeout(function () {
    //    $(".map").show();
    //    $(".map1").show();
    //    $(".map2").show();
    //}, 4000);
    // 显示的时间范围为早晨8:00至晚上24:00，t的取值为16-48
    
});