function changecolor(d) {
    var list = document.getElementsByName("li1");
    for (var i = 0; i < list.length; i++) {
        if (list[i].id != d) {
            list[i].style.backgroundColor = "transparent";
            list[i].className = "unselected";
        } else {
            list[i].style.backgroundColor = "#1E9FFF";
            list[i].className = "selected";
        }
    }
}

function changecolor2(d) {
    var list = document.getElementsByName("li2");
    for (var i = 0; i < list.length; i++) {
        if (list[i].id != d) {
            list[i].style.backgroundColor = "transparent";
            list[i].className = "unselected";
        } else {
            list[i].style.backgroundColor = "#1E9FFF";
            list[i].className = "selected";
        }
    }
}

function mouseover(d) {
    var se = document.getElementById(d);
    if (se.className != "selected") {
        se.style.backgroundColor = "rgba(0,0,0,0.2)";
    }
}

function mouseout(d) {
    var se = document.getElementById(d);
    if (se.className != "selected") se.style.backgroundColor = "transparent";
}


function new_a_post() {
    $("body").append("<div id='dialog'></div>");
    $("body").append("<div id='write'>" + "<div id='write-title'><span>标题:</span><input id='input-title' placeholder='输入标题'>" +
        "<span>类型:</span>" +
        "<select id='input-kind'>" +
        "<option value='1'>Java</option>" +
        "<option value='2'>C/C++</option>" +
        "<option value='3'>C#</option>" +
        "<option value='4'>PHP</option>" +
        "<option value='5'>HTML/CSS/JS</option>" +
        "<option value='6'>Python</option>" +
        "<option value='7'>SQL</option>" +
        "<option value='8'>VB</option>" +
        "<option value='9'>Pascal</option>" +
        "<option value='10'>其他</option>" +
        "</select></div>"
        + "<div id='write-content'><textarea id='input-content' placeholder='输入正文'></textarea></div> "
        + "<div id='write-button'><input type='button' class='btn btn-primary' onclick=$('#dialog').remove();$('#write').remove(); value='取消'>" +
        "<input type='button' class='btn btn-primary' onclick=sendPost(); value='发布'></div></div>");

}

$('#new-post').on('click', function () {
    new_a_post();
});

function sendPost() {
    var kind = $('#input-kind option:selected').val();
    var title = $('#input-title').val();
    var content = $('#input-content').val();
    if (kind == null) {
        toastr.warning('请选择种类');
    } else if (title == null) {
        toastr.warning('请输入标题');
    } else if (content == null) {
        toastr.warning('请输入内容');
    } else {
        newPost({kindName: kind, title: title, content: content}, function (data) {
            if (data.code == 100) {
                toastr.success('发布成功');
                setTimeout(function () {
                    getPostList();
                }, 1000);
            } else {
                toastr.error('发布失败');
            }
        });
        $('#dialog').remove();
        $('#write').remove();
    }
}


var postList;

function getPostList() {

    $('.pagediv').empty();
    var js = {currentPage: 1};
    showPostList(js, function (data) {
        if (data.code == 100) {
            postList = data.data.list;
            if (postList != null) {
                $(".pagediv").createPage({
                    pageNum: Math.ceil(data.data.total / 10),
                    current: 1,
                    backfun: function (e) {
                        var json = {currentPage: e.current};
                        showPostList(json, function (data) {
                            console.log(data);
                            postList = data.data.list;
                            createPostList();
                        });
                    }
                });
                console.log(data);
                createPostList();
            }
        } else {
            toastr.error('获取失败');
        }
    });
}

getPostList();

function createPostList() {
    $('.post-list-body').empty();
    var htmlstr = "";
    var temp;
    for (var i in postList) {
        var time = new Date(postList[i].createdTime);
        var posttime = time.getFullYear() + "-" + filterNum(time.getMonth() + 1) + "-" + filterNum(time.getDate()) + " "
            + filterNum(time.getHours()) + ":" + filterNum(time.getMinutes());


        temp = "<div class='one-post' onclick='window.open(&quot;post.html?id=" + postList[i].id + "&quot;)'><div class='post-top-info'> <div class='post-top-info-left'>"
            + "<img class='post-head-img' src='https://nebula-head.oss-cn-shenzhen.aliyuncs.com/" + postList[i].headimg + "/head100'></div><div class='post-top-info-right'>"
            + "<div class='post-title'>" + postList[i].title + "</div>"
            + "<span class='post-content'>" + postList[i].content + "</span>"
            + "</div></div><div class='post-bottom-info'><div class='post-bottom-info-left'>"
            + "<span class='post-name'>" + postList[i].nickName + "</span>"
            + "<div class='post-time'>" + posttime + "</div></div>"
            + "<div class='post-bottom-info-right'>"
            + "<img class='likeimg' src='res/like.png'>"
            + "<span class='starnum'>" + postList[i].star + "</span>"
            + "<img src='res/star.png'>"
            + "<span class='likenum'>" + postList[i].like + "</span>"
            + "</div></div></div>";
        htmlstr += temp;
    }
    $('.post-list-body').append(htmlstr);
}
