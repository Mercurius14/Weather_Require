import requests
import numpy as np
import pandas as pd
import json
import bs4,re
from url_and_dataStore import get_the_urls




class Weather_query():

    # pandas 对后七天预测数据进行分析展示
    def predict_data_check(self):
        data = self.data
        data = pd.DataFrame(data['predict'])
        print(data)

        
    # pandas 对查询当天数据进行分析展示
    def day_data_check(self):
        today_data = self.data['today']['weather']
        today_data['city'] = self.data['today']['city']
        today_data['aqi'] = self.data['today']['aqi']
        today_data['province'] = self.data['today']['province']
        data = pd.Series(today_data)
        print(data)

    #整理获得的数据，并且将其整理为字典形式便于json传回
    def deal_data(self ,message,data2): #传入的为字典文件
        try:
            city =message["data"]["real"]['station']["city"]  #得到城市信息，
            province =message["data"]["real"]['station']["province"]  #省份，
            weather =message["data"]["real"]['weather']  #天气总数据，
            temperature = weather['temperature'] #天气的温度
            temperature_low = message['data']['tempchart'][0]['min_temp']
            humidity = weather['humidity']  #相对湿度
            rain = weather['rain']  #降雨量
            rain_condu = weather['info']  #雨量总结  ——小雨，中雨，大雨
            feelst = weather['feelst']  #体感温度
            wind_data = message["data"]["real"]["wind"]  #相关风的总数据
            direct = wind_data['direct']#风向
            power = wind_data['power']  #风的强弱 ——微风，
            predict = message["data"]["predict"]['detail']  #预测的具体细节
            aqi = message['data']['air']['aqi'] #aqi数据提取
            date_all = []  #预测的所有日期
            info_all = []  #预测的所有介绍
            temperature_all = []  #预测的所有温度
            temperature_night_all=[]  #预测的所有夜晚温度——最低温度
            direct_all=[]  #预测的风向
            power_all = []  #预测的风强
            img_all = []  #预测的图片编号
            rain_all = [] #降水量
            humidity_all = [] #湿度
            feelst_all = [] #体感温度
            one_day_date = data2[-3] #[humidity_all,feel_tem_all,wind,week,date,wind,tem]
            one_day_wind = data2[-2]
            one_day_tem = data2[-1]
            k=0  #作为一个索引
            #预测数据提取
            for i in predict:
                if k==0:
                    k+=1
                    continue
                date_all.append(i['date'])
                day = i['day']
                night = i['night']
                w = i['day']['wind']
                info_all.append(day['weather']['info'])
                temperature_all.append(day['weather']['temperature'])
                temperature_night_all.append(night['weather']['temperature'])
                direct_all.append(w['direct'])
                power_all.append(w['power'])
                img_all.append(day['weather']['img'])


            #今日数据和与预测数据结合形成完整数据
            data1 = message['data']['predict']["detail"]
            date_all.insert(0,data1[0]["date"])
            temperature_all.insert(0,message['data']['tempchart'][0]['max_temp'])
            info_all.insert(0,rain_condu)
            direct_all.insert(0,direct)
            power_all.insert(0,power)
            img_all.insert(0,weather['img'])
            temperature_night_all.insert(0,temperature_low)
            #设置post返回的json文件格式
            data2[0][0] = humidity
            data2[1][0] = feelst
            data2[2][0] = direct
            data = {"msg":"success",
                    "today":
                         {"city": city,"aqi":aqi ,"province":province, "weather":weather, "temperature":temperature, "humidity":humidity,
                            "rain":rain,"rain_condu":rain_condu,"feelst":feelst,"direct":direct,"power":power}
                    ,
                    "one_day":
                        {
                            "time":one_day_date,"temperature":one_day_tem,"wind":one_day_wind
                        }
                    ,
                    "predict":
                         {"date":date_all, "info":info_all, "temperature_lowest":temperature_night_all ,"temperature":temperature_all, "direct":direct_all, "power":power_all,
                          'img':img_all,'humidity':data2[0],'feel_tem':data2[1],'wind':data2[2],'week':data2[3]
                          }

                        }
            self.data = data
            return data
        except:#处理有误——请求数据有误——网络请求失败
            return "error"

    #网站get请求
    def req_url(self, urls):
        url1 = urls[0]
        url2 = urls[1]
        res = requests.get(url1)
        res2 = self.get_init_codeData(url2)
        return res.json(), res2

    #对源代码进行数据提取
    def get_init_codeData(self,url2):
        res = requests.get(url2)
        res.encoding= 'utf-8'
        text = res.text
        #湿度提取
        reu = r'<div> (?P<num>.*?)% </div>'
        k = re.compile(reu, re.S)
        result = k.finditer(text)
        humidity = []
        for i in result:
            get_data = i.group('num')
            a = get_data.split(' ')
            humidity.append((float(a[-1])))

        humidity = np.array(humidity)
        humidity = humidity.reshape(7, -1)
        humidity_all = [round((i.sum(axis=0)) / 8, 1) for i in humidity]
        #体感温度提取
        reu = r'<div> (?P<num>.*?)℃ </div>'
        k = re.compile(reu, re.S)
        result = k.finditer(text)
        feel_tem = []
        for i in result:
            get_data = i.group('num')
            a = get_data.split(' ')
            feel_tem.append((float(a[-1])))

        feel_tem = feel_tem[1:]
        feel_tem = np.array(feel_tem)
        feel_tem = feel_tem.reshape(7, -1)
        feel_tem_all = [round((i.sum(axis=0)) / 8, 1) for i in feel_tem]
        #风向提取
        reu = r'<div class=windd> (?P<wind>.*?) </div><div class=winds>'
        k = re.compile(reu, re.S)
        result = k.finditer(text)
        wind = []
        for i in result:
            get_data = i.group('wind')
            wind.append(get_data)
        wind = [wind[2 * i] for i in range(0, 7)]
        #每周时间提取
        reu = f'<br>周(?P<week>.*?) </div>'
        k = re.compile(reu, re.S)
        result = k.finditer(text)
        week = []
        for i in result:
            get_data = i.group('week')
            week.append("周"+get_data)


        #每周一天的时间
        reu = '<div class="hour3 .*?"><div> (?P<hour>.*?) </div>'
        k = re.compile(reu, re.S)
        result = k.finditer(text)
        date = []
        for i in result:
            get_data = i.group('hour')
            date.append((get_data.split(' '))[-1])
        date = np.array(date)
        date = date.reshape(7, -1)
        #每周一天的风速
        reu = '<div> (?P<w_v>.*?)m/s </div>'
        k = re.compile(reu, re.S)
        result = k.finditer(text)
        winds = []
        for i in result:
            get_data = i.group('w_v')
            winds.append(float((get_data.split(' '))[-1]))
        winds = winds[:56]
        winds = np.array(winds)
        winds = winds.reshape(7,-1)
        winds = winds.tolist()
        date = date.tolist()
        feel_tem = feel_tem.tolist()
        #每周一天的tem

        result = [humidity_all,feel_tem_all,wind,week,date,winds,feel_tem]
        return result

    def data_back(self,data):
        urls = get_the_urls(data)  # 获取实际的url
        res1, res2 = self.req_url(urls)  # 传入url进行解析
        data = self.deal_data(res1, res2)  # 传入res 的json文件进行数据爬取
        return data