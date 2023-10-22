# -*- coding = utf-8 -*-
import requests
import json
#获得爬取需要的Url
def get_the_urls(data):
    message = data[0]['message']
    # http://www.nmc.cn/rest/weather?stationid=57511&_=1656591348553
    # http://www.nmc.cn/publish/forecast/ACQ/beibei.html
    # 数据爬取的第一个url
    urls = []
    url = f"http://www.nmc.cn/rest/weather?stationid={message}&_=1661267022753"
    urls.append(url)
    # 获得数据爬取的第二个url
    city = data[1]['City']
    u = f'http://www.nmc.cn/rest/province/{city}?_=1660880477837'
    res = (requests.get(u)).json()
    for i in res:
        if message == i['code']:
            url2 = "http://www.nmc.cn" + i['url']
            urls.append(url2)
    return urls
#存储当前数据
def data_store(file,data):
    try:
        with open(file, 'w') as file_obj:
            json.dump(data, file_obj)
        print('存储成功')
        return True
    except:
        return False

#读取上一次的数据
def data_read(file):
    try:
        with open(file, "r") as f:
            data = json.load(f)
            data['msg']='error'
        print("读取成功")
        return data
    except:
        data= {'msg':"fail"}
        return data
