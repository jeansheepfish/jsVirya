
// var 不一定是用来定义局部变量的
// jscript的全局变量和局部变量的分界是这样的：
//  过程体(包括方法function,对象Object o ={})外的所有变量不管你有没有加var保留字,他都是全局变量
//  而在过程体内(包括方法function(){},对象Object o={})内的对象加var保留字则为局部变量,而不加var保留字即为全局变量
// js的全局作用域应该是在看着办的的范围内,不一定是同一个页面,比如说在一个iframe里就不可以调用嵌入他的页面的JS

console.log('-----aaa----');
a=1;//全局变量 
aa();
function  aa() 
{ 
      console.log(a); 
      a=2;     //z为函数里，没有用var声明的全局变量 
      console.log(a); 
} 

console.log(a); 


console.log('-----bbb----');
var b=1;//全局变量 
function   bb() 
{ 
      var   b;
      console.log(b);//结果为undefined 
      b=2;     //z为函数里，用var声明的局部变量 
      console.log(b);//结果为2 
} 
bb(); 
console.log(b)//结果为1 


console.log('-----ccc----');
c=1;//全局变量 
function   cc() 
{ 
      var   c;
      console.log(this.c);//结果为1.用到对象的方法去考虑！ 
      //console.log(window.c);//浏览器场景 
      c=2;     //z为函数里，用var声明的局部变量 
      console.log(c);//结果为2 
} 
cc(); 
console.log(c)//结果为1 

