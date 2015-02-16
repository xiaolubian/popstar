/**
 * 初始化单元格宽 、 高
 */
var _X = _Y = 50;
var SIZE1 = "12px";
var SIZE2 = "20px";
/**
 * box颜色集合
 */
var colors = ["red","green","yellow","blue","pink"];

var colors2 = [	"#BFBFBF","#BF3EFF","#BEBEBE","#BDBDBD",
"#BDB76B","#BCEE68","#BCD2EE","#BC8F8F",
"#BBFFFF","#BABABA","#BA55D3","#B9D3EE",
"#B8B8B8","#B8860B","#B7B7B7","#B5B5B5",
"#B4EEB4","#B4CDCD","#B452CD","#B3EE3A",
"#B3B3B3","#B2DFEE","#B23AEE","#B22222",
"#B0E2FF","#B0E0E6","#B0C4DE","#B0B0B0",
"#B03060","#AEEEEE","#ADFF2F","#ADD8E6",
"#ADADAD","#ABABAB","#AB82FF","#AAAAAA",
"#A9A9A9","#A8A8A8","#A6A6A6","#A52A2A",
"#A4D3EE","#A3A3A3","#A2CD5A","#A2B5CD",
"#A1A1A1","#A0522D","#A020F0","#9FB6CD"];                                                           
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
* time 
*/
var time = null;
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
var remove_id = 1;
/**
 * 清除单个box
 * 
 * @param box
 * @returns
 */
function removeBox(i,boxId) {
	_$(boxId).style.display = "none";// 不显示
	_$(boxId).id = remove_id;// 改变Id
	remove_id++;
}
/**
 * 检查该对象关联的star数
 */
function getStars() {
	for(var i in array) {
		var _star = _$(array[i]);
		if(_star!=null){
			_star.style.fontSize=SIZE1;
		}
	}
	// 清空数组
	array = [];
	var id = this.id;
	array = getCount(id);
	//log(array);
	for(var i in array) {
		var _star = _$(array[i]);
		//log(_star);
		_star.style.fontSize=SIZE2;
	}
	if(array.length >= 2) {
		showMsg("count","你可以消灭 "+array.length+ " 个星星,共得 "+getScore(array.length)+" 分");
	} else {
		showMsg("count","")
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
	score += getScore(array.length);
	showMsg("score",score);
	for(var i in array) {
		var _id=array[i];
		var _star = _$(array[i]);
		if(!isNull(_star)){
			var id_x = parseInt(_star.id.split("_")[0]);
			var id_y = parseInt(_star.id.split("_")[1]);
			removeBox(i,array[i]);
			// 从将要消除的星星置为"00"
			var star_ = allStars[id_x-1][id_y-1];
			if(!isNull(star_) && star_!="00") {
				allStars[id_x-1].splice(id_y-1,1,"00");
			}
		}
	}
	
	moveY();
	moveX();
	isEnd();
	//logAllStars();
};
/**
 * 水平方向的移动
 */
function moveX() {
	// 该处算法分析:去掉空行并按照顺序排序
	//1.该行不为空
	//2.该行在数组中排序和当前顺序一致时跳出到下一次开始
	//3.不一致时,将当前所在行的数据更新,并将两列数据交换位置
	var k=9;
	for(var i=9;i>=0;i--) {
		if(allStars[i][0]!="00") {
			//log(i+" "+k);
			if(i==k) {
				k--;
				continue;
			}
			var arr = [];
			for(var j in allStars[i]) {
				if(allStars[i][j]!="00") {
					var id_y = parseInt(allStars[i][j].split("_")[1]);
					var _star = _$(allStars[i][j]);
					
					var new_id = parseInt(k+1)+"_"+id_y;
					_star.id = new_id;
					//_star.innerHTML=new_id;
					_star.style.left=(10-k)*_X+"px";
					arr[j]=new_id;
				} else {
					arr[j]=allStars[i][j];
				}
			}
			//log("arr:"+arr);
			allStars[i]=allStars[k];
			allStars[k]=arr;
			k--;
		}
	}
};
/**
 * 竖直方向的移动
 */
function moveY() {
	for(var i in allStars) {
		var k = 0;
		for(var j in allStars[i]) {
			if(allStars[i][j]!="00") {
				var _star=_$(allStars[i][j]);
				k++;
				var id_x = parseInt(allStars[i][j].split("_")[0]);
				allStars[i][j]=id_x+"_"+k;
				// 星星id改变
				_star.id = allStars[i][j];
				// 星星高度改变
				_star.style.top=(11-k)*_Y+"px";
				//_star.innerHTML = _star.id;
				var temp = allStars[i][k-1];
				allStars[i][k-1]=allStars[i][j];
				allStars[i][j]=temp;
			}
		}
	}
};
/*判断是否死局*/
function isEnd() {
	if(remove_id == 100) {
		alert("You Win! All stars you cleaned!");
		window.clearInterval(time);
		return ;
	}
	var _flag = true;
	for(var i=1;i<=10;i++) {
		for(var j=1;j<=10;j++) {
			var _id = i+"_"+j;
			//log(_id + " " + getLURD(_id).length)
			if(getLURD(_id).length != 0) {
				_flag = false;
				break;
			}
		}
	}
	//log(_flag);
	if(_flag) {
			
			if(window.confirm("Try Again?")) {
				init();
			} else {
				window.clearInterval(time);
			}
	}
};
/**
 * 初始化
 */
function init(){
	score = 0;
	remove_id = 1;
	time = setInterval(changeColor,500);
	// 清空center中的所有原有star对象
	var center = _$("center");
	var childrens = center.childNodes;// childNodes属性
	// 清空center所有星星对象
	center.innerHTML = "";
//	log(childrens)
//  var len = childrens.length;
//	for(var i=0;i<len;i++) {
//		log(childrens[i]);
//		center.removeNode(childrens[i]);
//	}
	// 创建新的star对象
	// 清空allStars数组
	allStars = [];
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
	boxDiv.style.fontSize=SIZE1;
	//boxDiv.innerHTML = id;
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
/*日志*/
function log(obj) {
	if(console != null) {
		console.info(obj);
	} else {
		alert(obj);
	}
};
/*显示信息*/
function showMsg(id,msg) {
	_$(id).innerHTML = msg;
};
/**
 * 根据Id获取上下左右相同颜色的ids,如果该元素已在数组中，则不需要重复添加
 * 
 * @param id 
 */
function getLURD(id) {
	//log("该"+id+"上下左右")
	var ids = id.split('_');
	var x_ = parseInt(ids[0]);
	var y_ = parseInt(ids[1]);
	var left_id = (x_-1)+"_"+y_;
	var right_id = (x_+1)+"_"+y_;
	var up_id = (x_)+"_"+(y_+1);
	var down_id = (x_)+"_"+(y_-1);
	
	var left = _$(left_id);//log(" left "+(x_-1)+"_"+y_+left);
	var right = _$(right_id);//log(" right "+(x_+1)+"_"+y_+right);
	var up = _$(up_id);//log(" up "+(x_)+"_"+(y_+1)+up);
	var down = _$(down_id);//log(" down "+(x_)+"_"+(y_-1)+down);
	
//	log(left_id+" "+left);
//	log(right_id+" "+right);
//	log(up_id+" "+up);
//	log(down_id+" "+down);
	
	var arr = new Array();	
	// 判断是否在allStars中
	// 判断是否在一个数组中出现
	// 判断是否颜色相同
	if(isInAllStars(left_id) && !isInArray(left_id) && compareColor(id,left_id)) {
		arr.push(left);
	}
	if(isInAllStars(up_id) && !isInArray(up_id) && compareColor(id,up_id)) {
		arr.push(up);
	}
	if(isInAllStars(right_id) && !isInArray(right_id) && compareColor(id,right_id)) {
		arr.push(right);
	}
	if(isInAllStars(down_id) && !isInArray(down_id) && compareColor(id,down_id)) {
		arr.push(down);
	}
	return arr;
};

/*通过Id获取stars数组*/
function getCount(id) {
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
/*比较两个方块颜色是否一致*/
function compareColor(id1,id2) {
	//log("颜色比较 :"+id1+"    "+id2);
	if(_$(id1) && _$(id2)) {
		return _$(id1).style.backgroundColor == _$(id2).style.backgroundColor;
	}
	return false;
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
/*是否在所有星星中*/
function isInAllStars(id) {
	var _flag = false;
	var id_x = parseInt(id.split("_")[0]);
	var id_y = parseInt(id.split("_")[1]);
	if(id_x==0 || id_y==0 || id_x==11 || id_y==11 || isNull(_$(id))){
		//log("在allStar中且没有消除:"+id+"    "+_flag);
		return _flag;
	}
	
	if(allStars[id_x-1][id_y-1] != undefined && allStars[id_x-1][id_y-1] != null  && allStars[id_x-1][id_y-1] != "00") {
			_flag = true;
	}
	//log("在allStar中且没有消除:"+id+"  "+_flag)
	return _flag;
}
/*通过数组元素个数获取分数*/
function getScore(len) {
	return 5*len*len;
};

function logAllStars() {
		log("logAllStars");
		for(var i in allStars) {
			log(i+" "+allStars[i]);
		}
}

function changeColor() {
	document.body.style.backgroundColor = colors2[parseInt(Math.random()*48)];
}
