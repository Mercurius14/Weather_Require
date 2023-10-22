
var myChart1 = echarts.init(document.getElementById('main1'), 'temperature');
   // var myChart2 = echarts.init(document.getElementById('main2'));
var myChart3 = echarts.init(document.getElementById('main3'));
var myChart4 = echarts.init(document.getElementById('main4'));
   // var myChart5 = echarts.init(document.getElementById('main5'));
//判断是否在数组中
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
             return true;
       }
    }
       return false;
}
var d = new Date();
d= d.toString();
d = d.split(" ");

$(document).ready(function(){
        //地理位置体现
        var ip_province=ip_city=ip_district='';//省市
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(116.331398,39.897445);
        map.centerAndZoom(point,12);
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
               //城市和编码数据加载，用于城市的自动选择
               var city_code;
               $.getJSON("./static/js/city_code.json",function(result){
			    city_code = result
		        });
		        //获取省份下面的城市
		        var pro_city;
                $.getJSON("./static/js/city_code.json",function(result){
                    pro_city = result
                });
                 // 创建地理编码实例
                var myGeo = new BMap.Geocoder();
                // 根据坐标得到地址描述
                myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(res){
                    if (res){
                        //直辖市判断
                        var city_main = ['北京市','重庆市','天津市',"上海市"]
                        ip_province=res.addressComponents.province;
                        ip_city=res.addressComponents.city;
                        ip_city = ip_city.slice(0,ip_city.length-1);
                        ip_district = res.addressComponents.district;
                        ip_district = ip_district.slice(0,ip_district.length-1);
                        $(".rect3").css({
                               "background-color": "rgba(255, 255, 255, 0.2)",
                              "border-radius":"10px",
                              "left":"10px",
                              "display": "flex"
                          });
                        //选择框变化
                        var pro_code = {'北京市': 'ABJ', '天津市': 'ATJ', '河北省': 'AHE', '山西省': 'ASX', '内蒙古自治区': 'ANM', '辽宁省': 'ALN', '吉林省': 'AJL', '黑龙江省': 'AHL', '上海市': 'ASH', '江苏省': 'AJS', '浙江省': 'AZJ', '安徽省': 'AAH', '福建省': 'AFJ', '江西省': 'AJX', '山东省': 'ASD', '河南省': 'AHA', '湖北省': 'AHB', '湖南省': 'AHN', '广东省': 'AGD', '广西壮族自治区': 'AGX', '海南省': 'AHI', '重庆市': 'ACQ', '四川省': 'ASC', '贵州省': 'AGZ', '云南省': 'AYN', '西藏自治区': 'AXZ', '陕西省': 'ASN', '甘肃省': 'AGS', '青海省': 'AQH', '宁夏回族自治区': 'ANX', '新疆维吾尔自治区': 'AXJ', '香港特别行政区': 'AXG', '澳门特别行政区': 'AAM', '台湾省': 'ATW'}
                        var str  = pro_code[ip_province]
                        var code = ['ATJ',"ABJ","AHE",'ASX','ANM','ALN','AJL','AHL','ASH','AJS','AZJ','AAH','AFJ','AJX','ASD','AHA','AHB','AHN','AGD','AGX','AHI','ACQ','ASC','AGZ','AYN','AXZ','ASN','AGS','AQH','ANX','AXJ','AXG','AAM','ATW'];
                        for (i in code)
                        {
                            judge = code[i];
                            if (str == judge)
                            {
                                ind = "#"+judge;
                                $(ind).show();
                                $("#fitst_show").text(ip_province);
                                $("#provinceSel option[value='"+str+"']").attr("selected", "selected");
                            }
                            else if(str != judge){
                                ind = "#"+judge;
                                $(ind).hide();
                            }
                        }
       //选择框右边总体数据内容变化
                        pro_value = (pro_code[ip_province]).replace('A','');
                        $("#date").text(d[3]+' '+d[4]);
                        if(isInArray(city_main,ip_province))//判断是否为直辖市
                        {
                            $("#shenfen").text(ip_province);
                            $("#chengshi").text(ip_district);
                            //城市选择框变化
                            if(isInArray(pro_city[ip_province],ip_district))
                            {
                                $("#"+pro_value).prev().text(ip_district);
                                city_value = city_code[ip_province][ip_district]
                                $("#"+pro_value+" option[value='"+city_value+"']").attr("selected", "selected");
                            }
                        }
                        else{
                            $("#shenfen").text(ip_province);
                            $("#chengshi").text(ip_city);
                            //城市选择框变化
                            if (isInArray(pro_city[ip_province],ip_city))
                            {
                                $("#"+pro_value).prev().text(ip_city);
                                city_value = city_code[ip_province][ip_city]
                                $("# "+pro_value+" option[value='"+city_value+"']").attr("selected", "selected");
                            }
                        }
                    }
                });
            }else {
                console.error('baidu-map-failed'+this.getStatus());
            }
        });


        //背景变化——白天——夜
        var d = new Date();
        d= d.toString();
        d = d.split(" ");
        bg_time = (d[4].split(':'))[0];
        if (bg_time>=6 && bg_time <=18)
        {
            $("body").attr('background',"../static/imgs/bag3.png")
        }
        else{
            $("body").attr('background',"../static/imgs/bag1.png")
        }
        $("#provinceSel").change(function(){
        var str='';
        //选项框变化,省份改变同时省份下显示的城市
        str =  $("#provinceSel").val();
        var code = ['ATJ',"ABJ","AHE",'ASX','ANM','ALN','AJL','AHL','ASH','AJS','AZJ','AAH','AFJ','AJX','ASD','AHA','AHB','AHN','AGD','AGX','AHI','ACQ','ASC','AGZ','AYN','AXZ','ASN','AGS','AQH','ANX','AXJ','AXG','AAM','ATW'];
        for (i in code)
        {
            judge = code[i];
            if (str == judge)
            {
                ind = "#"+judge;
                $(ind).show();
            }
            else if(str != judge){
                ind = "#"+judge;
                $(ind).hide();
            }
        }
    });
        $("button").click(function(){  //按钮点击事件——表单提交
            var pro = $("#provinceSel").val()   //省份名称获取
            //初始化显示的选择框位置
            var index_day = ['d1','d2','d3','d4','d5','d6','d7']
            for (i in index_day){
                  $('#'+index_day[i]).attr({
                                "class": "weather pull-left"
                              });
                   }

            //对提交的省份等进行处理，便于后续ajax的post请求传输data
            pro = pro.substr(1,pro.length);
            the_city = "#"+pro;
            C = 'A'+pro;
            var item = $(the_city).val();
            var usermsg = new Array();
            usermsg.push({message:item});
            usermsg.push({City:C});
            var message=JSON.stringify(usermsg);

            $.ajax({  //对数据进行post请求
                type:'POST',
                url:'http://localhost:5000/deal',
                dataType:'json',
                contentType: 'application/json; charset=utf-8',
                data:message,//发送的得到的数据
                success:function(serverdata){       //对返回的数据进行处理
                //msg代表此次查询的情况，成功时的情况如下
                if (serverdata.msg !='error'){
                    console.log(serverdata);        //控制查看后端返回的数据
                    if(serverdata.msg == 'success'){
                        layer.msg("查询成功!");
                    }
                    else{
                        layer.msg("查询失败，加载已加载过的信息");
                    }
                    //相关形式变化——按钮右边内容
                    $(".col-xs-12").show();  //
                    $(".rect1").show();  //
                    $(".rect3").css({
                                "background-color": "rgba(255, 255, 255, 0.2)",
                                "border-radius":"10px",
                                "left":"10px",
                                "display": "flex"
                      });
                    $(".rect2").show();

                    //选择框已经点击的位置显示
                    $('#d1').attr({
                                        "class": "weather pull-left selected"
                                      });
                    //python处理之后的数据导入
                    //预测数据处理
                    var date = serverdata.predict.date; //温度预测日期7天
                    var temperature = serverdata.predict.temperature; //7天温度预测
                    var temperature_low = serverdata.predict.temperature_lowest; //7天最低温度预测
                    var humidity = serverdata.today.humidity; //今日的湿度
                    var weather_7 = serverdata.predict.info; //7天预测的天气
                    var feelst_7 = serverdata.predict.feel_tem;  //7天预测的体感温度
                    var humidity_7 = serverdata.predict.humidity;  //7天预测的湿度
                    var week_7 = serverdata.predict.week; //周几
                    var img_7 = serverdata.predict.img; //天气图片
                    var wind_7 = serverdata.predict.power; //风强
                    var direct_7 = serverdata.predict.direct; //风向


                    //查询当天数据异常处理
                    var AQI = serverdata.today.aqi; //今日的AQI
                    if(AQI == ''){
                        AQI = 30;
                    }
                    var city = serverdata.today.city;//查询的城市
                    var province = serverdata.today.province;//查询的省份
                    var rain = serverdata.today.weather.rain;//今日的降水量
                    var feelst = serverdata.today.feelst; //体感温度
                    var tem = serverdata.today.weather.temperature; //今日的温度
                    var descri = serverdata.today.weather.info; //今日天气描述
                    var direct_today = serverdata.today.direct;//今日风向
                    var power_today = serverdata.today.power;//今日风强描述——微风
                    var pass_today_date = serverdata.one_day.time;//过去时间的日期
                    var pass_today_temperature = serverdata.one_day.temperature;//过去时间的温度
                    var imgs = serverdata.today.weather.img; //图片
                    var pass_today_wind = serverdata.one_day.wind;//过去时间的风强度
                    var AQI_level;
                    var pass_today_date_ = pass_today_date[0];
                    var pass_today_temperature_ = pass_today_temperature[0];
                    var pass_today_wind_ = pass_today_wind[0] ;
                    //日期获取

                    d= date[0];

                    //空气质量判断
                    if(Number(AQI)>0){
                        AQI_level="优";
                    }
                    if(Number(AQI)>50){
                        AQI_level="良"
                    }
                    if(Number(AQI)>100){
                        AQI_level="轻度污染"
                    }
                    if(Number(AQI)>150){
                        AQI_level="中度污染"
                    }
                    if(Number(AQI)>200){
                        AQI_level="重度污染"
                    }
                    if(Number(AQI)>300){
                        AQI_level="严重污染"
                    }
                    //AQI异常处理
                    $("#AQI_level").text(AQI_level);
                    if(imgs=='9999'){
                        imgs = '0';
                        img_7[0] = '0';
                        weather_7[0] = '晴';
                        descri = '晴';
                    };
                    //天气和图片异常处理
                    if(img_7[0]== null){
                        imgs = '0';
                        weather_7[0] = '晴';
                        img_7[0] = '0';
                        descri = '晴天';
                    };
                    //总体内容展示
                    $("#shenfen").text(province);
                    $("#chengshi").text(city);
                    $("#date").text(d);
                    $("#tianqi").text(descri);
                    //echarts设置
                    var option1 = {         //7天温度图——折线
                        backgroundColor: 'rgba(21,33,14,0)',
                        title: {
                            text:"7日温度预测图",
                            show:true,
                            color:"white",
                        },
                        tooltip: {},
                        legend: {
                            data:['最高温度',"最低温度"]
                        },
                        xAxis: {
                            data: date,
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                            interval: 0,
                            rotate: 40,//倾斜度数
                        },
                        },
                        yAxis: {},
                        series: [{
                            name: '最高温度',
                            type: 'line',
                            data: temperature
                        },
                        {
                            name: '最低温度',
                            type: 'line',
                            data: temperature_low
                        }]
                    };
                    var option3 = {     //AQI速度图
                          tooltip: { //显示值
                            formatter: "{b} : {c}%"
                          },
                          series: [{
                            startAngle: 210, //开始角度
                            endAngle: -30, //结束角度
                            type: 'gauge',
                            progress: {
                              show: true,
                              width: 18
                            },
                            axisLine: {
                              lineStyle: {
                                width: 23,
                                   color: [
                                        [1,new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                          {
                                            offset: 0.1,
                                            color: "#59c4e6"
                                          },
                                          {
                                            offset: 0.6,
                                            color: "grey"
                                          },
                                          {
                                            offset: 1,
                                            color: "rgba(255, 255, 255, 0.2)"
                                          }
                                        ])
                                      ]
                                    ]
                              }
                            },
                            //分隔线样式。
                            splitLine: {
                              show: false,
                            },
                            //刻度样式。
                            axisTick: {
                              show: true,
                            },
                            //刻度标签。
                            axisLabel: {
                              distance: 4,
                              color: '#fff',
                              fontSize: 15
                            },
                            pointer: {
                              show: true,
                            },
                            anchor: {
                              show: true,
                              showAbove: true,
                              size: 0,
                              itemStyle: {
                                borderWidth: 10
                              }
                            },
                            title: { //标题样式
                              show: true,
                              text: '今日AQI',
                              color:"fff",
                            },
                            detail: {
                              valueAnimation: true,
                              color:"white",
                              fontSize: 23, //字体大小
                              offsetCenter: [0, '30%'], //百分比位置
                              formatter: function (value) {
                                return Math.round(value);
                              },
                            },
                            data: [{
                              value: AQI,
                              name: '今日AQI'
                            }]
                          }]
                        };

                    //点击切换不同时间的天气内容变化
                    var ind_cli = ['d1','d2','d3','d4','d5','d6','d7'];
                    function cli(ind)
                    {
                        $("#"+ind_cli[ind]).click(function(){
                        for (i in index_day){
                           if (index_day[i]==ind_cli[ind])
                           {
                              $('#'+ind_cli[ind]).attr({
                                "class": "weather pull-left selected"
                              });
                              $("#realRain").text(rain+'mm');
                              $(".im2").attr('src',"./static/imgs/"+img_7[i]+".png")
                              $("#realWindDirect").text(direct_7[i]);
                              $("#realWindPower").text(wind_7[i]);
                              $("#realHumidity").text(humidity_7[i]+"%");
                              $("#realFeelst").text(feelst_7[i]+"℃");
                              $("#realTemperature").text(temperature[i]+"℃");
                              pass_today_wind_ = pass_today_wind[i];
                              pass_today_date_ = pass_today_date[i];
                              pass_today_temperature_ = pass_today_temperature[i];
                              //点击echart图也会变化
                              var option4 = { //双指标图
                         title: {
                            text:"过去24小时内温度与风速表",
                            show:true,
                            textStyle:{
                                color:"white",
                                fontSize:20
                            },
                        },
                          tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                              type: 'cross',
                            }
                          },
                          legend: { //顶部标题
                            top: "5%",
                            data: ['过去温度', '过去风速'],
                          },
                          xAxis: [{ //x轴
                            type: 'category',
                            data: pass_today_date_,
                            color:"white",
                            axisPointer: {
                              type: 'shadow', //类型
                            },
                          }],

                          yAxis: [{ //y轴
                              type: 'value',
                              color:"white",
                              splitLine: { //网格线隐藏
                                show: false
                              },
                              name: '风速（m/s）', //顶部文字描述

                              axisLabel: {
                                formatter: '{value}',
                                color:"white",
                              }
                            },
                            {
                              type: 'value',
                              splitLine: { //网格线隐藏
                                show: false
                              },
                              name: '温度（℃）', //右边顶部文字描述

                              axisLabel: {
                                formatter: '{value}'
                              }
                            }
                          ],
                          series: [{
                              name: '温度', //顶部标题
                              type: 'line', //类型 折线
                              color: ["rgb(84,112,198)"], //颜色
                              yAxisIndex: 1, //使用的x轴的 index，在单个图表实例中存在多个x轴的时候有用
                              data: pass_today_temperature_,
                              itemStyle:{
                                  normal:{
                                    lineStyle:{
                                      width:3,  // 设置虚线宽度
                                      type:'solid'  // 虚线'dotted' 实线'solid'
                                    }
                                  }
                                }
                            },
                            {
                              name: '风速', //顶部标题
                              type: 'bar', //类型 柱状
                              color: '#59c4e6', //颜色
                              barWidth: 12, //柱体宽度
                              data: pass_today_wind_
                            }
                          ]
                        };
                              myChart4.setOption(option4);
                                  window.addEventListener("resize", function () {
                                  myChart4.resize(); //图表自适应的一个方法
                                });
                           }
                           else{
                                $('#'+index_day[i]).attr({
                                    "class": "weather pull-left"
                                  });
                           }
                        }
                    });
                    };

                    var option4 = { //双指标图
                         title: {
                            text:"过去24小时内温度与风速表",
                            show:true,
                            textStyle:{
                                color:"white",
                                fontSize:20
                            },
                        },
                          tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                              type: 'cross',
                            }
                          },
                          legend: { //顶部标题
                            top: "5%",
                            data: ['过去温度', '过去风速'],
                          },
                          xAxis: [{ //x轴
                            type: 'category',
                            data: pass_today_date_,
                            color:"white",
                            axisPointer: {
                              type: 'shadow', //类型
                            },
                          }],

                          yAxis: [{ //y轴
                              type: 'value',
                              color:"white",
                              splitLine: { //网格线隐藏
                                show: false
                              },
                              name: '风速（m/s）', //顶部文字描述

                              axisLabel: {
                                formatter: '{value}',
                                color:"white",
                              }
                            },
                            {
                              type: 'value',
                              splitLine: { //网格线隐藏
                                show: false
                              },
                              name: '温度（℃）', //右边顶部文字描述

                              axisLabel: {
                                formatter: '{value}'
                              }
                            }
                          ],
                          series: [{
                              name: '温度', //顶部标题
                              type: 'line', //类型 折线
                              color: ["rgb(84,112,198)"], //颜色
                              yAxisIndex: 1, //使用的x轴的 index，在单个图表实例中存在多个x轴的时候有用
                              data: pass_today_temperature_,
                              itemStyle:{
                                  normal:{
                                    lineStyle:{
                                      width:3,  // 设置虚线宽度
                                      type:'solid'  // 虚线'dotted' 实线'solid'
                                    }
                                  }
                                }
                            },
                            {
                              name: '风速', //顶部标题
                              type: 'bar', //类型 柱状
                              color: '#59c4e6', //颜色
                              barWidth: 25, //柱体宽度
                              data: pass_today_wind_
                            }
                          ]
                        };
                    cli(0);
                    cli(1);
                    cli(2);
                    cli(3);
                    cli(4);
                    cli(5);
                    cli(6);


                    //第一块空气信息内容填充
                    $("#realRain").text(rain+'mm');
                    $(".im2").attr('src',"./static/imgs/"+imgs+".png")
                    $("#realWindDirect").text(direct_today);
                    $("#realWindPower").text(power_today);
                    $("#realHumidity").text(humidity+"%");
                    $("#realFeelst").text(feelst+"℃");
                    $(".cityName").text(city);
                    $("#realTemperature").text(tem+"℃");

                    //7天展示区域内容填充
                    var index_num = [['d10', 'd20', 'd30', 'd40', 'd50', 'd60', 'd70'], ['d11', 'd21', 'd31', 'd41', 'd51', 'd61', 'd71'], ['d12', 'd22', 'd32', 'd42', 'd52', 'd62', 'd72'], ['d13', 'd23', 'd33', 'd43', 'd53', 'd63', 'd73'], ['d14', 'd24', 'd34', 'd44', 'd54', 'd64', 'd74'], ['d15', 'd25', 'd35', 'd45', 'd55', 'd65', 'd75'], ['d16', 'd26', 'd36', 'd46', 'd56', 'd66', 'd76'], ['d17', 'd27', 'd37', 'd47', 'd57', 'd67', 'd77'], ['d18', 'd28', 'd38', 'd48', 'd58', 'd68', 'd78'], ['d19', 'd29', 'd39', 'd49', 'd59', 'd69', 'd79']];
                    //内容填充格式函数
                    function content_add(index,index_num,data,content)
                    {
                        for (i in index_num[index]){//湿度
                            $("#"+index_num[index][i]).text(data[i]+content);
                        };
                    };
                    content_add(0,index_num,humidity_7,'%(湿度)');
                    for (i in index_num[1]){//日期
                        $("#"+index_num[1][i]).text(date[i].replace('2022-',''));
                    };
                    content_add(2,index_num,week_7,'');
                    content_add(3,index_num,weather_7,'');
                    for (i in index_num[4]){//图片
                        $("."+index_num[4][i]).attr('src',"./static/imgs/"+img_7[i]+".png")
                    };
                    content_add(5,index_num,direct_7,'');
                    content_add(6,index_num,wind_7,'');
                    content_add(7,index_num,temperature,'℃');
                    content_add(8,index_num,temperature_low,'℃');
                    content_add(9,index_num,feelst_7,'℃(体感温度)');
                    //第二块图片展示
                    myChart1.setOption(option1);
                    window.addEventListener("resize", function () {
                      myChart1.resize(); //图表自适应的一个方法
                    });
                  //  myChart2.setOption(option2);
                  //第三块图片展示
                    myChart3.setOption(option3);
                    window.addEventListener("resize", function () {
                      myChart3.resize(); //图表自适应的一个方法
                    });
                    myChart4.setOption(option4);
                    window.addEventListener("resize", function () {
                      myChart4.resize(); //图表自适应的一个方法
                    });
                    };

                    //切换不同天时的数据改变
                    //pass_today_temperature,pass_today_wind


            //表单信息发送的请求错误
            if (serverdata.msg != 'success'){
                $('#d1').attr({
                     "class": "weather pull-left selected"
                });
                layer.msg("查询错误")
                };
            }
           });
           });
           });

