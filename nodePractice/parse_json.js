var fs = require('fs'); 
var excelExport = require('excel-export');
var path = process.cwd()+'\\json\\';

var filename = 'trello_export';  //只支持字母和数字命名
var conf = {};
var count = 0;

conf.cols = [
    {caption:'客户', type:'string'},
    {caption:'现场需求（问题）', type:'string'},
    {caption:'状态', type:'string'}
];

conf.rows = [];


// process.exit();


fs.readdir(path, function(err, files) {  
    console.log('read file from ' + path);
    if (err) {  
        console.log('read dir error');  
    } else {  
        files.forEach(function(item) {

            if(item.lastIndexOf('.json') > 0 && item !== 'package.json'){
                var tmpPath = path + '\\' + item;  
                fnName(tmpPath);
                //console.log(tmpPath);                
            }
        });  
    }  
});  

var oneSecond = 2000 * 1; // one second = 1000 x 1 ms

setTimeout(function() {
    console.log(conf.rows.length);

    // 导出到excel
    var result = excelExport.execute(conf);
    //var random = Math.floor(Math.random()*10000+0);

    var uploadDir = '';
    var filePath = uploadDir + filename + (new Date()).Format("yyyy-M-d") + ".xlsx";

    console.log(filePath);

    fs.writeFile(filePath, result, 'binary',function(err){
        if(err){
            console.log(err);
        }
    });

}, oneSecond);


function fnName(path){

    fs.readFile(path,function(err, data){

        if(err){
            console.error(err);
        } else {
            
            var str = JSON.parse(data.toString());
            console.log('----------'+str.name);
            //conf.rows[count++] = str.name;

            //方式一：使用eval解析
              var obj = eval(str);
              //console.log(obj.constructor);


              var boardMap={};
              for(var list in obj.lists){
                boardMap[obj.lists[list].id] = obj.lists[list].name;
                //console.log(obj.lists[list].name + obj.lists[list].idBoard);
              }  
              //console.log(boardMap);
                
                // count = count + 1;

              for(var c in obj.cards){  
                //console.log(obj.cards[c].name+'|'+boardMap[obj.cards[c].idList]);

                conf.rows[count++] = 
                     [str.name, obj.cards[c].name, boardMap[obj.cards[c].idList]];                
              }  
            console.log(conf.rows.length);
        }
        
    })

}


Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 