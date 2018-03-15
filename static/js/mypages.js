/**
 * Created by Administrator on 2017/12/21.
 */
function MyPages(count) {
    this.oUl = document.querySelector("#pages .page-list");
    this.oFrag = document.createDocumentFragment();
    this.count = count || 1;//总记录数
    this.pages = Math.ceil(this.count / 4);//实际页码
    this.showPage = this.pages;
    (this.pages > 6) && (this.showPage = 6);//最多展示6页
}
MyPages.prototype.init = function () {
    for(var i=0;i<this.showPage;i++){//根据实际的页数生成页码 最多展示6页
        if(i === 0) {
            var firstLi = document.createElement("li");
            firstLi.innerHTML = "上一页";
            this.oFrag.appendChild(firstLi);
        }
        var aLi = document.createElement("li");
        aLi.innerHTML = `${i+1}`;
        this.oFrag.appendChild(aLi);
        if( i === this.showPage-1 ){
            var lastLi = document.createElement("li");
            lastLi.innerHTML = "下一页";
            this.oFrag.appendChild(lastLi);
        }
    }
    this.oUl.appendChild(this.oFrag);
};
MyPages.prototype.event = function(){
    var liList = this.oUl.querySelectorAll("li");//获取li集合
    var len = liList.length;
   // console.log(liList);
    liList[1].className = "active";//选中第一页 设置选中样式
    this.oUl.addEventListener("click",function (e) {
        var e = e || window.event;
        var target = e.target;
        var oActLi = document.querySelector(".active");
        liIndex = parseInt(oActLi.innerHTML);
        if(target.tagName.toLowerCase()==="li"){
            switch (target.innerHTML){
                case  "上一页":
                    if(liIndex <= 1){//当前页面为第一页时直接退出
                        alert("别点了，前面没有了新闻了！");
                        return;
                    }
                    for (var i=1;i<len-1;i++ ){
                        liList[i].className = "";
                    }
                    if(liIndex > this.showPage){//如果当前页码大于6 则所有的页码标签减少1 选中第六个li
                        for (var i=1;i<len-1;i++ ){
                            liList[i].innerHTML = parseInt(liList[i].innerHTML) - 1;
                        }
                        liList[len-2].className = "active";
                    }else {//否则 选中的标签依次向前移动一个
                        liList[liIndex-1].className = "active";
                    }
                    break;
                case  "下一页":
                    if(liIndex >= this.pages){ //如果当前页码 大于或等于实际的页码 直接退出
                        alert("别点了，这已经是最后一页了！");
                        return;
                    }
                    for (var i=1;i<len-1;i++ ){
                        liList[i].className = "";
                    }
                    if(liIndex >= this.showPage){
                        for (var i=1;i<len-1;i++ ){
                            liList[i].innerHTML =parseInt(liList[i].innerHTML) + 1;
                        }
                        liList[len-2].className = "active";
                    }else {
                        liList[liIndex+1].className = "active";
                    }
                    break;
                default:
                    for (var i=1;i<len-1;i++ ){
                        liList[i].className = "";
                    }
                    target.className = "active";
                    break;
            }
        }
    }.bind(this),false);
};

