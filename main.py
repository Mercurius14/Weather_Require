# -*- coding = utf-8 -*-
from flask import Flask,request,render_template,url_for,redirect,jsonify
import json
from flask_cors import CORS
#引用函数方式
from url_and_dataStore import data_read,data_store
from weather_operate import Weather_query

#flask模块设计
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False # jsonify转变格式的时候不会转变为
#unicode编码格式，unicode编码格式无法直接看到汉字
app.config['JSONIFY_MIMETYPE'] = "application/json;charset=utf-8" # 指定
#浏览器渲染的文件类型，和解码格式
CORS(app, resources=r'/*')
@app.route('/')
def index():#主页面提供
    return render_template('index.html')

@app.route('/deal',methods = ['POST','GET'])
def deal():#接受post请求的处理函数
    try:
        data_get = request.json  # dict类型
        #实例化天气查询对象
        weather_query = Weather_query()
        data = weather_query.data_back(data_get)
       # weather_query.predict_data_check() #打印预测的数据
       # weather_query.day_data_check()  #打印今日的数据
        if data !='error':
            filename = "./static/data/"+data_get[0]['message']+"_"+data_get[1]['City'] + ".json"
            data_store(filename,data)
            data= json.dumps(data)
            return data
        else:
            data = {'msg':'error'}
            return json.dumps(data)
    except:
        filename = "./static/data/" + data_get[0]['message'] +"_"+ data_get[1]['City'] + ".json"
        data = data_read(filename)
        return json.dumps(data)


if __name__=='__main__':
    app.run(port=5000,debug=True,host='0.0.0.0')

