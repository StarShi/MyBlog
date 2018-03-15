/**
 * Created by Administrator on 2017/12/13.
 */

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
        console.log(target);
        if( target.tagName.toLowerCase() === "li"){
            switch (target.innerText){
                case  "新闻":
                    document.querySelector("#news").scrollIntoView(true);
                    break;
                case  "博文":
                    document.querySelector("#blogs").scrollIntoView(true);
                    break;
                case  "作品":
                    document.querySelector("#instros").scrollIntoView(true);
                    break;
                case  "爱站":
                    document.querySelector("#friends").scrollIntoView(true);
                    break;
                case  "关于我":
                    document.querySelector("#aboutme").scrollIntoView(true);
                    break;
                case  "联系我":
                    document.querySelector("#msgs").scrollIntoView(true);
                    break;
                default:
                    break;
            }
        }
    }