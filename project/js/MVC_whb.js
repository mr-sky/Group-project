let MVC = {};
// 数据模块
MVC.Model = function () {
    // 用来存储数据层面的数据
    let __M = {};
    return {
        add(key, value) {
            let ary = key.replace(/^\./, '').split('.');
            let obj = __M;
            for (let i = 0; i < ary.length - 1; i++) {
                if (obj[ary[i]] !== undefined && typeof obj[ary[i]] !== 'object') {
                    throw new Error('不是对象不能添加属性');
                }
                if (obj[ary[i]] === undefined) obj[ary[i]] = {};
                obj = obj[ary[i]];
            }
            obj[ary[ary.length - 1]] = value;
            return this;
        },
        get(key) {
            let ary = key.replace(/^\./, '').split('.');
            let obj = __M;
            for (let i = 0; i < ary.length; i++) {
                obj = obj[ary[i]];
                if (obj === undefined) obj = null;
            }
            return obj;
        }
    }
}()
// 视图模块
MVC.View = function () {
    // 保存创建视图的所有方法的容器
    let __V = {};
    return {
        add(type, fn) {
            if (typeof __V[type] === 'function') {
                throw new Error('该方法名已存在');
            } else {
                __V[type] = fn;
            }
            return this;
        },
        replace(type, fn) {
            __V[type] = fn;
            return this;
        },
        create(type) {
            return __V[type].call(MVC, MVC.Model, MVC.template);
        }
    }
}()
// 控制器模块
MVC.Controller = function () {
    // 定义控制器容器保存所用控制器
    let __C = {};
    return {
        add(type, fn) {
            if (typeof __C[type] === 'function') {
                throw new Error('该方法名已存在');
            } else {
                __C[type] = fn;
            }
            return this;
        },
        replace(type, fn) {
            __C[type] = fn;
            return this;
        },
        init() {
            for (const key in __C) {
                if (__C.hasOwnProperty(key)) {
                    __C[key].call(MVC, MVC.Model, MVC.View, MVC.Observer);
                }
            }
        }
    }
}()
MVC.gosha = function(str){
    return {add(str){
        console.log(str);
    }};
}
// 模板引擎模块
MVC.template = function (str, data) {
    return str.replace(/\@([\w\.]+)\@/g, function (index, key) {
        let ary = key.split('.');
        let obj = data;
        for (let i = 0; i < ary.length; i++) {
            obj = obj[ary[i]];
            if (obj === undefined) return '';
        }
        return obj;
    })
}
// 简化写法
// 初始化
MVC.initial = function () {
    window.onload = function () {
        MVC.Controller.init();
    }
}
// Model的添加方法
MVC.addModel = function (key, value) {
    MVC.Model.add(key, value);
    return this;
}
// View的添加方法
MVC.addView = function (type, fn) {
    MVC.View.add(type, fn);
    return this;
}
// Controller的添加方法
MVC.addCtrl = function (type, fn) {
    MVC.Controller.add(type, fn);
    return this;
}
// 观察者模块
MVC.Observer = function () {
    let __list = {};
    return {
        regist(type, fn) {
            if (__list[type]) {
                __list[type].push(fn);
            } else {
                __list[type] = [fn];
            }
            return this;
        },
        fire(type, data) {
            for (let i = 0; i < __list[type].length; i++) {
                __list[type][i]({
                    type,
                    data
                });
            }
            return this;
        },
        remove(type, fn) {
            if (__list[type]) {
                for (let i = 0; i < __list[type].length; i++) {
                    if (__list[type][i] === fn) {
                        __list[type].splice(i, 1);
                    }
                }
            }
            return this;
        }
    }
}()