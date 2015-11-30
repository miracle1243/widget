/**
 * jquery.tabs.js 1.0
 * http://passer-by.com
 */
;(function($, window, document, undefined) {
    $.fn.tabs = function(parameter,getApi) {
        if(typeof parameter == 'function'){ //重载
            getApi = parameter;
            parameter = {};
        }else{
            parameter = parameter || {};
            getApi = getApi||function(){};
        }
        var defaults = {
            contentCls: 'content',      //内容列表的class
            navCls: 'nav',              //导航列表的class
            activeCls: 'active',        //导航选中时的class
            effect:'none',              //切换的效果
            triggerType: 'mouse',       //切换时的触发事件
            triggerCondition: '*',      //导航项的条件
            activeIndex: 0,             //默认选中导航项的索引
            beforeEvent: function() {   //切换前执行,返回flase时不移动;传入一个对象,包含：target当前导航项对象,tabs导航列表对象,panels内容列表对象,index当前导航项索引,event事件对象;
            },
            afterEvent: function() {//切换后执行;传入一个对象,包含：target当前导航项对象,tabs导航列表对象,panels内容列表对象,index当前导航项索引,event事件对象;
            }
        };
        var options = $.extend({}, defaults, parameter);
        return this.each(function() {
            //对象定义
            var $this = $(this);
            var $content = $this.find("." + options.contentCls);
            var $panels = $content.children();
            var $triggers = $this.find("." + options.navCls + ">" + options.triggerCondition);
            //全局变量
            var _api = {};
            var _size = $panels.length;
            var _index = options.activeIndex;
            options.triggerType += options.triggerType === "mouse" ? "enter" : "";  //使用mouseenter防止事件冒泡
            //样式
            if(options.effect=='fade'){
                $content.css('position','relative');
                $panels.css('position','absolute');
            }
            //选择某标签
            _api.select = function(index){
                $triggers.removeClass(options.activeCls).eq(index).addClass(options.activeCls); 
                switch(options.effect){
                    case 'fade':
                        if(_index!=index){
                            var $select = $panels.eq(_index).css('z-index',_size+1);
                            $panels.each(function(i){
                                if(i!=_index){
                                    $(this).css('z-index',(index+_size-i-1)%_size+1);
                                }
                            });
                            $select.fadeOut('normal',function(){
                                $select.css({
                                    'display':'block',
                                    'z-index':(index+_size-_index-1)%_size+1
                                });
                                _index = index;
                            });
                        }else{
                            $panels.each(function(i){
                                $(this).css('z-index',(index+_size-i-1)%_size+1);
                            });
                        }
                        break;
                    default:
                        $panels.hide().eq(index).show();        
                }
            }
            //初始化  
            _api.select(_index);   //默认选中状态
            $triggers.bind(options.triggerType, function(e) { //事件绑定
                var i = $triggers.index($(this));
                var status = {
                    target:$this,
                    triggers:$triggers,
                    panels:$panels,
                    index:i,
                    event:e
                }
                if(options.beforeEvent(status)!=false){
                    _api.select(i);
                    options.afterEvent(status);
                }
            });
            getApi(_api);
        });
    };
})(jQuery, window, document);