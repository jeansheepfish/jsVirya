/**
 * Created by Administrator on 2016/5/27.
 */

console.info('--------');
//console.info('');

var async;
async = require('async');

async.waterfall([
    function(callback){
        callback(null,1);
    },
    function(data,callback){
        console.info(data);
        callback('test',2);
    },
    function(data,callback){
        console.info(data);
        callback(null,3);
    }
],function(err,results){
   console.log(results);
});

//console.info('');
console.info('--------');
