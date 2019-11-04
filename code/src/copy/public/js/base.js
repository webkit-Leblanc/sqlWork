var map;
function initMap(showTip) {
  map = new BMap.Map('mapContainer', { enableMapClick: false, minZoom: 12, maxZoom: 13 }); // 创建地图实例，禁止点击地图底图
  map.setMapStyle({ styleJson });
  // var map = new BMap.Map("allmap",{minZoom:4,maxZoom:8}); // 创建Map实例,设置地图允许的最小/大级别

  // map.disableDragging();//禁止拖动
  // map.disableDoubleClickZoom(); //禁止双击缩放
  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

  var blist = [];
  var districtLoading = 0;

  function getBoundary() {
    addDistrict('广州白云区');
  }

  /**
   * 添加行政区划
   * @param {} districtName 行政区划名
   * @returns  无返回值
   */
  function addDistrict(districtName) {
    //使用计数器来控制加载过程
    districtLoading++;
    var bdary = new BMap.Boundary();
    bdary.get(districtName, function(rs) {
      //获取行政区域
      var count = rs.boundaries.length; //行政区域的点有多少个
      if (count === 0) {
        alert('未能获取当前输入行政区域');
        return;
      }
      for (var i = 0; i < count; i++) {
        blist.push({ points: rs.boundaries[i], name: districtName });
      }
      //加载完成区域点后计数器-1
      districtLoading--;
      if (districtLoading == 0) {
        //全加载完成后画端点
        drawBoundary();
      }
    });
  }

  /**
   * 各种鼠标事件绑定
   */
  function click(evt) {
    // alert(evt.target.name);
    // console.log(evt)
  }

  function mouseover(evt) {
    evt.target.label.setZIndex(99);
    evt.target.label.setPosition(evt.point);
    evt.target.label.show();
  }

  function mousemove(evt) {
    evt.target.label.setPosition(evt.point);
  }

  function mouseout(evt) {
    evt.target.label.hide();
  }

  function drawBoundary() {
    //包含所有区域的点数组
    var pointArray = [];

    /*画遮蔽层的相关方法
     *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
     *      这样就做出了一个经过多次西北角的闭合多边形*/
    //定义中国东南西北端点，作为第一层
    var pNW = { lat: 59.0, lng: 73.0 }; //西北
    var pNE = { lat: 59.0, lng: 136.0 }; //东北
    var pSE = { lat: 3.0, lng: 136.0 }; //东南
    var pSW = { lat: 3.0, lng: 73.0 }; //西南
    //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
    var pArray = [];
    pArray.push(pNW);
    pArray.push(pSW);
    pArray.push(pSE);
    pArray.push(pNE);
    pArray.push(pNW);
    //循环添加各闭合区域
    for (var i = 0; i < blist.length; i++) {
      //添加显示用标签层
      var label = new BMap.Label(blist[i].name, {
        offset: new BMap.Size(20, -10)
      });
      label.hide();
      map.addOverlay(label);

      //添加多边形层并显示
      var ply = new BMap.Polygon(blist[i].points, {
        strokeWeight: 5,
        strokeColor: '#2C5AD1',
        fillOpacity: 0.01,
        fillColor: ' #2C5AD1'
      }); //建立多边形覆盖物
      ply.name = blist[i].name;
      ply.label = label;
      ply.addEventListener('click', click);
      // ply.addEventListener("mouseover", mouseover);
      ply.addEventListener('mouseout', mouseout);
      ply.addEventListener('mousemove', mousemove);
      map.addOverlay(ply);

      //添加名称标签层
      var centerlabel = new BMap.Label(blist[i].name, {
        offset: new BMap.Size(0, 0)
      });
      centerlabel.setPosition(ply.getBounds().getCenter());
      // map.addOverlay(centerlabel);

      //将点增加到视野范围内
      var path = ply.getPath();
      pointArray = pointArray.concat(path);
      //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
      pArray = pArray.concat(path);
      pArray.push(pArray[0]);
    }

    //限定显示区域，需要引用api库
    var boundply = new BMap.Polygon(pointArray);
    BMapLib.AreaRestriction.setBounds(map, boundply.getBounds());
    // map.setZoom(12);
    map.centerAndZoom(new BMap.Point(113.279148, 23.16497), 12);
    // map.setViewport(pointArray);    //调整视野

    //添加遮蔽层
    var plyall = new BMap.Polygon(pArray, {
      strokeOpacity: 0.0000001,
      strokeColor: '#000000',
      strokeWeight: 0.00001,
      fillColor: '#010A36',
      fillOpacity: 0.9
    }); //建立多边形覆盖物
    map.addOverlay(plyall);
    // var top_left_control = new BMap.ScaleControl({
    //   anchor: BMAP_ANCHOR_TOP_LEFT
    // });
    // map.addControl(top_left_control);
    map.enableAutoResize();
  }

  setTimeout(function() {
    getBoundary();
  }, 100);
}

function showTip() {
  // // 百度地图API功能
  // var map = new BMap.Map("mapContainer");
  var pt = new BMap.Point(113.267617, 23.20013);

  var coverOpts = {
    width: 200, // 信息窗口宽度
    height: 100, // 信息窗口高度
    title: '海底捞王府井店', // 信息窗口标题
    enableMessage: true, //设置允许信息窗发送短息,
    enableAutoPan: false
  };

  var infoWindow = new BMap.InfoWindow(
    '当事人:' +
      '柯礼钦' +
      '<br>案由:' +
      '劳动纠纷' +
      '<br>时间:' +
      '2019/9/17 14:57',
    coverOpts
  ); // 创建信息窗口对象
  setTimeout(function() {
    map.openInfoWindow(infoWindow, pt); //开启信息窗口
  }, 200);
  // document.getElementById("mapContainer").click();
}

let requestAnimationFrame =
  window.requestAnimationFrame || window.webkitRequestAnimationFrame;
let cancelAnimationFrame =
  window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
/**
 * sos告警圆形范围绘制(只有存在map对象时才可以使用)
 * @param radius 半径
 * @param level 层数
 * @param point BMap.Point对象，圆的中心点
 * @param color  颜色对象，包含{fillColor,fillOpacity}
 * @constructor
 */

function CircleShow(radius, level, point, color) {
  if (!window.map || !window.BMap || !window.BMap.Circle) {
    return undefined;
  }
  this.radius = radius;
  this.level = new Number(level);
  this.point = point;
  this.color = color;

  if (Number.isNaN(this.level)) {
    this.level = 1;
  } //至少1层

  if (!this.color || !this.color.fillColor) {
    this.color = {
      fillColor: 'blue', //默认蓝色
      fillOpacity: 0.5 //默认初始透明度0.5
    };
  }

  //计算平均每段扩展距离的透明度
  this.endOpacity = 0.1; //终止透明度设置为0.1
  this.speedOpacity = (this.color.fillOpacity - this.endOpacity) / this.radius; //每米的透明度

  //先加一层白色的覆盖物，加在图片上表示覆盖范围
  // this.circle0 = new BMap.Circle(this.point, this.radius, {
  //   fillColor: 'white',
  //   fillOpacity: 0.2,
  //   strokeWeight: 1,
  //   strokeColor: 'white',
  //   strokeOpacity: 0.2,
  //   enableEditing: false
  // });
  this.circle1 = new BMap.Circle(this.point, this.radius / 2, {
    fillColor: this.color.fillColor,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: 'white',
    strokeOpacity: 0.4,
    enableEditing: false
  });
  // map.addOverlay(this.circle0);
  map.addOverlay(this.circle1);

  //按层数循环构造覆盖物，并加在图片上
  this.circles = new Array();
  let circle;
  for (let i = 1; i < this.level; i++) {
    circle = new BMap.Circle(this.point, 0, {
      fillColor: this.color.fillColor,
      fillOpacity: this.color.fillOpacity,
      strokeWeight: 1,
      strokeColor: this.color.fillColor,
      strokeOpacity: this.color.fillOpacity,
      enableEditing: false
    });
    this.circles.push(circle);
    map.addOverlay(circle);
  }

  this.clock = new Array(this.level);
}

/**
 * 动画启动
 * @param distance 波纹间隔时间（单位ms）
 * @param t0 扩散一次所需的时间
 */
CircleShow.prototype.start = function(distance, t0) {
  let _self = this;

  /**
   * 定义动画函数
   * @param startTime 启动的初始时间
   * @param circle 圆形覆盖物对象
   * @param index 序号
   */
  function animateStart(startTime, circle, index) {
    //计算时间差
    let time = new Date().getTime() - startTime;
    if (time < 0) {
      circle.setRadius(0); //半径
      circle.setFillOpacity(_self.color.fillColor); //透明度
      circle.setStrokeOpacity(_self.color.fillOpacity); //透明度
      //如果未达到执行实现则直接等待
      _self.clock[index] = window.requestAnimationFrame(
        animateStart.bind(null, startTime, circle, index)
      );
      return;
    }
    //计算当前半径
    //匀减速运动下，每隔t时间，应该扩散的半径:
    //r=r0*(2*t*t0-t*t)/t0
    //其中，r0为最终的扩散半径，即this.radius
    let r = Math.floor(
      _self.radius * ((2 * time) / t0 - (time * time) / t0 / t0)
    );
    let opacity = 0;
    if (time >= t0) {
      //达到运行时间之后
      //设置圆形覆盖物的样式
      circle.setRadius(_self.radius); //半径
      circle.setFillOpacity(_self.endOpacity); //透明度
      circle.setStrokeOpacity(_self.endOpacity); //透明度

      startTime = new Date().getTime() + distance; //起始时间设置为当前时间加上1倍的时间间隔
      _self.clock[index] = window.requestAnimationFrame(
        animateStart.bind(null, startTime, circle, index)
      );
    } else {
      //计算透明度
      let opacity =
        _self.color.fillOpacity -
        Number.parseFloat((_self.speedOpacity * r).toFixed(5)); //四舍五入小数点后5位

      //设置圆形覆盖物的样式
      circle.setRadius(r); //半径
      circle.setFillOpacity(opacity); //透明度
      circle.setStrokeOpacity(opacity); //透明度

      _self.clock[index] = window.requestAnimationFrame(
        animateStart.bind(null, startTime, circle, index)
      );
    }
  }

  //循环每一层执行动画
  for (let [index, circle] of this.circles.entries()) {
    animateStart(new Date().getTime() + index * distance, circle, index);
  }
};

/**
 * 停止动画.
 */
CircleShow.prototype.stop = function() {
  for (let caf of this.clock) {
    window.cancelAnimationFrame(caf);
  }

  //重置覆盖物样式
  for (let circle of this.circles) {
    circle.setRadius(0); //半径
    circle.setFillOpacity(this.color.fillOpacity); //透明度
    circle.getStrokeOpacity(this.color.fillOpacity); //透明度
  }

  this.clock = null;
};

/**
 * 移除覆盖物.
 */
CircleShow.prototype.remove = function() {
  //停止动画
  for (let caf of this.clock) {
    window.cancelAnimationFrame(caf);
  }

  map.removeOverlay(this.circle0);
  for (let circle of this.circles) {
    map.removeOverlay(circle);
  }
};
