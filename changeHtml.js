
/**
 * 通过在模型中写出想要加到页面中的html代码，再通过此函数将上一个ajax
 * 请求来的数据替换模型中的对应html代码，最后将要添加的html模型代码
 * 添加到页面相应的位置
 * @param obj
 * ----------obj中的属性
 * @param {string} obj.htmlURL ajax请求的作为模型的html/其他类型的文件
 * @param {elementObj} obj.element 要添加html代码的元素
 * @param {obj}obj.resultData 上一个ajax从后台中获得的数据，作为替换的内容
 * @param {function} obj.callback 回调函数
 */
function changeHtml(obj) {
    var url = obj.htmlURL;
    var ele = obj.element;
    var r = obj.resultData;
    var fn = obj.callback||new  Function();
    $.ajax({

        // <li><a href="../service/tab_table.php?id={{i.id}}">{{i.sex}}</a></li> ，模型中的代码（例）
        url: url,  //html模型所在地址
        success: function (data) { //data指的是从模型中请求回来的html字符串代码
            //存储一下data数据
            var _data = data;
            //正则表达式 匹配'{{i.'
            var regStart = /\{\{i\./g;
            //正则表达式 匹配'}}'
            var regEnd = /\}\}/g;

            //keys用来存储model中的变量名，
            // strHtml用来存储最后将要替换到页面的html代码字符串
            var keys = [], strHtml = '';

            //循环遍历data,将变量名存储在keys中(data中的变量名是数据库中存储的属性名)
            while (regStart.test(data)) {
                regEnd.test(data);
                var startIndex = regStart.lastIndex;
                var endIndex = regEnd.lastIndex;
                var key = data.substring(startIndex, endIndex - 2);
                keys.push(key);
            }

            //循环遍历将模中的数据替换成数据库中请求回来的数据r
            r.forEach(function (obj, index) {
                keys.forEach(function (k, index) {
                    data = data.replace('{{i.' + k + '}}', obj[k]);
                });
                strHtml += data;
                data = _data;
            });
            //将数据添加到页面
            ele.append(strHtml);
            //回调函数
            fn();
        }
    });
}
