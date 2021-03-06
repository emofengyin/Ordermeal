function showPeople(){  //将users.json文件里的内容显示在页面上的方法
	var str = ''; 
	$.each(users,function(index,value){ //依次遍历users对象
			str += "<li><a href='#' onclick='selectPeople(\""+value.name+"\")'>" //当点击某一个人名时，调用该方法
			+ value.name + "</a></li>"; //创建li标签，并将users对象里的name属性写入
	});
	$("#userslist").html(str);//将创建的li标签及其内容显示在页面上
};


function showRestaurants(){ //将restaurants.json文件的里内容显示在页面上的方法
	var str = '';
	$.each(restaurants,function(index,value){  //依次遍历restaurants对象
			str += "<li><a href='#' onclick='selectRestaurants(\""+value.name+"\")'>" //当点击某一个餐厅时，调用该方法
			+ value.name + "</a></li>";  //创建li标签,并将restaurants对象里的name属性写入
	});
	$("#restaurantslist").html(str); //将创建的li标签及其内容显示在页面上
};


function showFoods(){  //将restaurants.json文件的里内容显示在页面上的方法
	var str = '';
	var restaurants = window.localStorage.restaurants;  //获取当前选择的餐厅，用localStorage方法本地存储
	$.each(foods[restaurants],function(index,value){ //根据当前选择的餐厅，依次遍历该餐厅对象
		str += "<li><a href='#' onclick='selectFoods(\""+value.name+"\",\""+value.price+"\")'>" //当点击某一个套餐时，调用该方法
		+ value.name + "<p class='ui-li-aside'>" 
		+ '￥' + value.price + "</p></a></li>";   //创建li标签并将各个餐厅里foods的name和price属性写入
	});
	$("#mealslist").html(str);  //将创建的li标签及其内容显示在页面上
};

//点击选套餐按钮，判断餐厅是否已选的函数
function isOrnot(){
	var restaurant = $("input")[1].value;
	if(restaurant != ""){
		location="./selectmeals.html";
	}else{
		alert("未选餐厅，请重新选择!");
	}
};

function selectPeople(name){  //选人方法
		window.localStorage.users = name; //本地存储所选之人
		location="index.html"; //跳回主页面
};

function selectRestaurants(name){ //选餐厅方法
		window.localStorage.restaurants = name; //本地存储所选餐厅
		location="index.html"; //跳回主页面
};

function selectFoods(name,price){  //选套餐方法
		window.localStorage.foods = name;  //本地存储所选套餐
		window.localStorage.prices = price;
		location="index.html"; //跳回主页面
};

function initOrder(){
	$("#users").attr("value",window.localStorage.users);
	$("#restaurants").attr("value",window.localStorage.restaurants);
	$("#foods").attr("value",window.localStorage.foods);
};  //将姓名，餐厅，套餐显示在主页的input控件内


//点击确定按钮执行的函数
function confirm(){ //判断如果信息没有选择完整，点击确定按钮会有提示
	var item = 0;
	for(var i=0;i<3;i++)
	{
		if($("input")[i].value == "")
		{
			item++;
		}
	}
	if(item != 0)
	{
		alert("信息填写不全，请重新填写!"); //提示信息
	}else{
	window.localStorage.people += localStorage.getItem("users")+"*"; //获取当前人名
	window.localStorage.room += localStorage.getItem("restaurants")+"*"; //获取当前餐厅
	window.localStorage.meal += localStorage.getItem("foods")+"*"; //获取当前套餐
	window.localStorage.pri += localStorage.getItem("prices")+"*"; //获取当前套餐价格
	localStorage.removeItem("users"); //清空users
	localStorage.removeItem("foods"); //清空foods
	location = "./index.html";
	}
};


//订单展示页面的函数
function showOrder(){
	var user = new Array(); //定义数组
	var res = new Array();
	var food = new Array();
	var price = new Array();
	//将订单里的信息按*分隔后传到对应的数组中
	user = localStorage.people.split("*");
	res = localStorage.room.split("*");
	food = localStorage.meal.split("*");
	price = localStorage.pri.split("*");

	//判断user数组中是否有重复值
	var iscount = user.length-1;
	for(var j=0;j<user.length-1;j++){
		for(var k=1;k<user.length-1;k++){
			if(user[j] == user[k+j])
			iscount--;
		}
	}

	var str1 = "";
	str1 += "<li data-role='list-divider'>"+iscount+"人已定"+"</li>";

	for(var i=0; i<user.length-1;i++){
		str1 += "<li><h3>" + user[i] + "</h3>";
		str1 += "<p class='ui-li-desc'>" 
		+ res[i] + " " + food[i] + "</p>";
		if(price[i]>12){
			str1 += "<p class='ui-li-aside ui-li-desc'>"+"<font color='red'>"+"￥"+
			price[i]+"(超出" +(price[i]-12)+"元)"+"</font></p>";
		}else{
			str1 += "<p class='ui-li-aside ui-li-desc'>" + "￥" + price[i] + "</p>";
		}
		str1 += "</li>";
	}
	$("#isOrder").html(str1);
		

	var str2 = "";
	str2 += "<li data-role='list-divider'>"+(users.length-iscount)+"人未定"+"</li>";


	//将users.json里的元素和user里的元素比较，输出user里没有的元素
	for(var m=0;m<users.length;m++){
		var count = 0;
		for(var n=0;n<user.length-1;n++)
		{
			if(users[m].name == user[n])
				count++;
		}
		if(count==0)//count=0表示2个数组里不相同的元素
		{
			str2 += "<li>"+users[m].name+"</li>";
		}
	}
	$("#notOrder").html(str2);


	//计算总价
	var sum = 0;
	for(var i=0;i<price.length-1;i++)
	{
		sum = parseFloat(sum) + parseFloat(price[i]);
	}

	var h = "";
	h += "<h4>"+iscount+"人已定，"+(users.length-iscount)+"人未定，总计"+sum+"元"+"</h4>";
	$("#sum").html(h);
};


$(document).ready(function(){
	//当页面加载完成时，如果是undefined,则赋空值
	if(!localStorage.people) 
	 localStorage.people = "";
	if(!localStorage.room)
	 localStorage.room = "";
	if(!localStorage.meal)
	 localStorage.meal = "";
	if(!localStorage.pri)
	 localStorage.pri = "";
});


