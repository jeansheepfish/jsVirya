var oneSecond = 1000 * 1; // one second = 1000 x 1 ms

setTimeout(function() {
    console.log('timeout only once');
}, oneSecond);


//setInterval允许以指定的时间间隔重复执行函数。
setInterval(function() {
    console.log('interval will be repeat per second');
 }, oneSecond);