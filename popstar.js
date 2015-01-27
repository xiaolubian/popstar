/**
 * 初始化单元格宽 、 高
 */
var _X = _Y = 50;
/**
 * box颜色集合
 */
var colors = ["red","green","yellow","blue","orange"];
/**
 * stars
 */
var array = new Array();
/*
 * 所有星星
 */
var allStars = new Array();
/*
 * 分数
 */
var score = 0;
/**
 * 方块对象
 * 
 * @param x X坐标
 * @param y Y坐标
 * @param left 左边的对象
 * @param up 上边的对象
 * @param right 右边的对象 
 * @param down 下边的对象
 * @param cls 样式
 */
function Box(boxDiv) {
	this.boxDiv = boxDiv;
};
/**
 * 清除单个box
 * 
 * @param box
 * @returns
 */
function removeBox(i,boxId) {
	_$(boxId).style.display = "none";// 不显示
	// 从选中的数组中删除
	//array.splice(i,1);
}
/**
 * 检查该对象关联的star数
 */
function getStars() {
	array = [];
	var id = this.id;
	array = getCount(id);
	log(array);
	if(array.length >= 2) {
		showMsg("count","你可以消灭 "+array.length+ " 个星星,共得 "+getScore(array.length)+" 分");
	}
};
/**
 * 消除点击的对象相关的star
 */
function clearStars() {
	// 如果数组个数为1，不消除
	if(array.length == 1) {
		return;
	}
	log("选中的数组元素 ："+array);
	log("清除前 ： " + allStars.length);
	for(var i in array) {
		var _star = _$(array[i]);
		if(!isNull(_star)){
			// 移除数组
			removeBox(i,array[i]);
			var id_x = parseInt(_star.id.split("_")[0]);
			var id_y = parseInt(_star.id.split("_")[1]);
			log(id_x +" : " + id_y + " : "+allStars[id_x][id_y]);
			var star_ = allStars[id_x][id_y];
			// 从全局数组中移除
			if(!isNull(star_)) {
				allStars[id_x].splice(id_y,1);
			}
			log(allStars[id_x]);
		}
	}
	log("清除的数组元素 ："+array);
	log("清除后 ： "+allStars.length);
	score = parseInt(score) + parseInt(getScore(array.length));
	//showMsg("score",("分数 " + score));
	moveY();
	moveX();
};
/**
 * 水平方向的移动
 */
function moveX() {
	// 先进行竖直方向，在进行水平方向移动，
	// if 最下面的一行有空
	// else nothing
};
/**
 * 竖直方向的移动
 */
function moveY() {
	for(var i=1;i<=10;i++) {
		for(var j=1;j<=10;j++) {
			var _id = i+"_"+j;
			// 是否已消除
			if(isHide(_id) && !isInAllStars(_id)) {
				for(var k=j+1;k<=10;k++) {
					var _star = _$(i+"_"+k);
					log(_star +" "+isNull(_star) +" "+ ((parseInt(_star.style.top.split("px")[0]) + _Y) + "px"))
					if(!isNull(_star) && isInAllStars(_star.id)) {
						_star.style.top = ((parseInt(_star.style.top.split("px")[0]) + _Y) + "px");
					}
				}
			}
		}
	}
};
/*判断是否死局*/
function isEnd() {
	var _flag = true;
	for(var i=1;i<=10;i++) {
		for(var j=1;j<=10;j++) {
			var _id = i+"_"+j;
			if(getLURD(_id).length == 0) {
				_flag = false;
				break;
			}
		}
	}
	return _flag;
};
/**
 * 初始化
 */
function init(){
	// 清空center中的所有原有star对象
	var center = _$("center");
	var childrens = center.childNodes;// childNodes属性
	var len = childrens.length;
	for(var i=0;i<len;i++) {
		document.removeChild(childrens[i]);
	}
	// 创建新的star对象
	for(var i=1;i<=10;i++) {
		// 一维数组
		var starArr = new Array();
		for(var j=1;j<=10;j++) {
			var box = createBox(i,j);
			// 将box对象添加到center中
			center.appendChild(box);
			starArr.push(box.id);
		}
		// 二维数组
		allStars.push(starArr);
	}
};
/**
 * 创建一个box
 */
function createBox(x,y) {
	var id = x+"_"+y;
	// 获取样式
	var cls = colors[parseInt(Math.random()*5)];
	var X = (11-x)*_X + "px";
	var Y = (11-y)*_Y + "px";
	// 创建div对象
	var boxDiv = document.createElement("div");
	boxDiv.id = id;
	boxDiv.className = "box";
	boxDiv.style.left = X;
	boxDiv.style.top = Y;
	boxDiv.style.backgroundColor = cls;
	boxDiv.innerHTML = id;
	boxDiv.addEventListener("mouseover",getStars,false);// 给对象绑定单击查询事件
	boxDiv.addEventListener("click",clearStars,false);// 双击消除事件
	
	return boxDiv;
};
/**
 * 根据id获取对象
 * @param id
 * @returns
 */
function _$(id) {
	return document.getElementById(id);
};

function log(obj) {
	if(console != null) {
		console.info(obj);
	} else {
		alert(obj);
	}
};
/*显示信息*/
function showMsg(id,msg) {
	log(id)
	_$(id).innerHTML = msg;
};
/**
 * 根据Id获取上下左右的ids,如果该元素已在数组中，则不需要重复添加
 * 
 * @param id 
 */
function getLURD(id) {
	var ids = id.split('_');
	var x_ = parseInt(ids[0]);
	var y_ = parseInt(ids[1]);
	var left = _$((x_-1)+"_"+y_);//log(" left "+(x_-1)+"_"+y_+left);
	var right = _$((x_+1)+"_"+y_);//log(" right "+(x_+1)+"_"+y_+right);
	var up = _$((x_)+"_"+(y_+1));//log(" up "+(x_)+"_"+(y_+1)+up);
	var down = _$((x_)+"_"+(y_-1));//log(" down "+(x_)+"_"+(y_-1)+down);
	
	var arr = new Array();
//	log(isNull(left));
//	log(isInArray(left.id));
//	log(compareColor(id,left.id));
	if(!isNull(left) && !isInArray(left.id) && compareColor(id,left.id)) {
		arr.push(left);
	}
	if(!isNull(up) && !isInArray(up.id) && compareColor(id,up.id)) {
		arr.push(up);
	}
	if(!isNull(right) && !isInArray(right.id) && compareColor(id,right.id)) {
		arr.push(right);
	}
	if(!isNull(down) && !isInArray(down.id) && compareColor(id,down.id)) {
		arr.push(down);
	}
	return arr;
};
/*比较两个方块颜色是否一致*/
function compareColor(id1,id2) {
	return _$(id1).style.backgroundColor == _$(id2).style.backgroundColor;
};
/**
 * 判断一个对象是否为空
 * @param obj 要验证的对象
 */
function isNull(obj) {
	if(obj == undefined || obj == null || obj == "") {
		return true;
	}
	return false;
};
/*通过Id获取stars数组*/
function getCount(id) {
	var ar = [];
	// 此处的算法
	// 1.将该元素id加入到array中
	array.push(id);
	// 2.判断该元素的上下左右是否存在相同元素，不存在时直接返回
	var arr = getLURD(id);
	var len = arr.length;
	if(len == 0) {
		return array;
	}
	// 3.四周的数组中有大于1个相同颜色的则重复执行该步骤
	for(var i=0;i<len;i++) {
		var star = arr[i];
		getCount(star.id);
	}
	return array;
}
/**
 * 判断该id是否在array中
 */
function isInArray(id) {
	var boo = false;
	for(var i in array) {
		if(id == array[i]) {
			boo = true;
			break;
		}
	}
	return boo;
};
/*通过数组元素个数获取分数*/
function getScore(len) {
	return 5*len*len;
};

function isHide(id) {
	var _star = _$(id);
	if(_star.style.display == "none") {
		return true;
	}
	return false;
};

function isInAllStars(id) {
	var flag_ = false;
	for(var i in allStars) {
		for(var j in allStars[i]) {
			if(id == allStars[i][j]) {
				flag_ = true;
				break;
			}
		}
	}
	return flag_;
}
