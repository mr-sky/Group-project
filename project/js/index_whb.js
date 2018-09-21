$(function(){
    $("#myCarousel").carousel('cycle');
    $("#myCarousela").carousel('cycle');
    MVC
    .addModel('nest',{

    })
    .addView('nest',function(model,template){
        var data = model.get('nest');
        var html = '';
        for (let i = 0; i < data.data.length; i++) {
            html += template($('#tem').html(),data.data[i]);
        }
        $('.first_list ul').html(html);
    })
    .addCtrl('nest',function(model,view){
        $.get('json/module_first_whb.json',function(data){
            var data = typeof data == "string"?eval('('+data+')'):data;
            model.add('nest',data);
            view.create('nest');
        })
    })
    .initial();
})