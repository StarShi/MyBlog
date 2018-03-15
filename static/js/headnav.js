/**
 * Created by Administrator on 2017/12/14.
 */
~~function () {
    var oDiv = document.querySelector(".nav-right .icon");
    var oUl = document.querySelector("#nav-ul ul");
    var flag = true;
    oDiv.onclick = function (e) {
        var e = e || window.event;
        var target = e.target;
//				flag && (target.style.color = "red");
        if(flag){
            target.style.color = "red" ;
            oUl.style.display = "block";
            flag = false;

        }else {
            target.style.color = "#fff" ;
            oUl.style.display = "none";
            flag = true;
        }
        return flag;
    };
    oUl.addEventListener("click",links,false);
    function links(e) {
        var e = e || window.event;
        var target = e.target;
        if ( target.tagName.toLowerCase() === 'li'){
            console.log(target.innerText);
            switch (target.innerText){
                case  "首页":
                    window.location.href = "./index.html";
                    break;
                case  "新闻":
                    window.location.href = "./morenews.html";
                    break;
                case  "博文":
                    window.location.href = "./moreblogs.html";
                    break;
                case  "作品":
                    window.location.href = "./intros.html";
                    break;
                default:
                    break;
            }
        }
    }
}();
