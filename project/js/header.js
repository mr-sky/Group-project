$(function(){
    function strFn(str, data) {
        return str.replace(/\@(\w+)\@/g, function (match, $1, index, string) {
            return data[$1];
        })
    }
    $.get('json/nav.json', function (data) {
        data = typeof data == 'object' ? data : eval('(' + data + ')');
        for (let i = 0; i < data.data.length; i++) {
            $('#chanpin').append(strFn($('#chanpin_box').html(), data.data[i]));
        }
    })
})