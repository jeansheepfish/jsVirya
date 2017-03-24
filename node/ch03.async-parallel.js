/**
 * Created by Administrator on 2016/5/27.
 */

console.info('---------');

var async = require('async');

async.parallelLimit([
    function(callback){
        console.log('11111');
        setTimeout(function(){
            callback(null,'one');
        },5000)
    },
    function(callback){
        console.info('22222');
        setTimeout(function(){
            callback(null,'two');
        },1000)
    }
], 2, function(err,result){
    console.log(result);
});