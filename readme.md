--config
----user-xxx 用户配置文件目录

--deploy 生成的模板
--history
----user-xxx.txt 生成的记录

--src 源码

--templates  模板目录 比如： casinowww-avia
----casinowww-avia


/build
参数
{
  "template": "default1", // 模板名称
  "path": "D:/node/build/pcode1/default1/tmp_6_v_3_id13"  // 后台生成的用户配置目录
}


---- final 
babel -d ./lib/ ./src/

cd lib

nodemon --verbose ./main.js &

pm2 start ./main.js
pm2 list
pm2 restart main.js
比nodemon好用

curl -d '{"template":"DEFAULT1", "path":"\/data\/www\/template_server\/auto-generator\/tmp_2_v_5_id6"}' -H "Content-Type: text/plain" -X POST http://localhost:9999/build

nohup node main.js &