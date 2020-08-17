$(function() {
    // 点击切换注册页面 登录页面
    $(".login-cut").click(function() {
        $("#login-form").hide();
        $("#reg-form").show();
    });
    // 点击切换注登录页面
    $(".login-reg").on("click", function() {
        $("#reg-form").hide();
        $("#login-form").show();
    });

    var layer = layui.layer;
    var form = layui.form;
    // form表单 验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        username: function(value) {
            if (value.length > 6) {
                return "用户名在1~6个字符";
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return "用户名不能有特殊字符";
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return "用户名首尾不能出现下划线'_'";
            }
            if (/^\d+\d+\d$/.test(value)) {
                return "用户名不能全为数字";
            }
        },
        repwd: function(value) {
            if (value !== $("#reg-form [name=password]").val()) {
                return "两次输入的密码不一致！";
            }
        },
    });
    // 监听注册表单提交事件
    $("#reg-form ").on("submit", function(e) {
        // 注册账号数据请求
        //阻止默认提交行为
        e.preventDefault();
        var data = {
            username: $("#reg-form [name=username]").val(),
            password: $("#reg-form [name=password]").val(),
        };
        $.post("/api/reguser", data, function(
            res
        ) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg("注册失败！");
            }
            layer.msg("注册成功！");
            $(".login-reg").click();
        });
    });

    // 登录页面表单提交登录
    $("#login-form").on("submit", function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: {
                username: $("#login-form [name=username]").val(),
                password: $("#login-form [name=password]").val(),
            },
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功！");
                localStorage.setItem("token", res.token);
                //跳转到主页
                location.href = "/index.html";
            },
        });
    });
});