import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';
import styleJson from './styleJson'
import arr from './address';

import './index.scss';

import waveGif from '../../asset/image/wave.gif';
import coverIcon from '../../asset/image/cover.png';
import { init } from 'echarts';

let arrList = ['法院', '检察院', '公安局', '人社局', '卫计局', '国土规划局', '住房和建设局', '工会', '妇联', '工商联', '公安局', '江高镇', '人和镇', '太和镇', '钟落潭镇', '三元里镇', '松洲街', '景泰街', '黄石街', '同德街', '棠景街', '新市街', '同和街', '京溪街', '永平街']

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
  }

  async componentDidMount() {
    // 百度地图API功能
    initMap();
    this.time();

    // Fetch.findAllUnit().then(res => {
    //   console.log('findAllUnit res', res);
    //   var _arr = res.data.map(({ ...a, longLat, caseCount }) => ({
    //     ...a,
    //     color: colorRender(caseCount.zsCount, caseCount.total),
    //     lng: longLat.split(',')[0],
    //     lat: longLat.split(',')[1]
    //   }))
    //   window.sessionStorage.setItem('addressInfo', JSON.stringify(_arr));
    //   _arr.length > 0 && _arr.forEach((item) => {
    //     var pt = new BMap.Point(item.lng, item.lat);
    //     // 创建水波涟漪图形
    //     var circles = new CircleShow(400, 5, pt, {
    //       fillColor: item.color,
    //       fillOpacity: 0.9
    //     });
    //     circles.start(1000, 3000);

    //     // 显示街道名称
    //     var opts = {
    //       position: pt, // 指定文本标注所在的地理位置
    //       offset: new BMap.Size(0, 10) //设置文本偏移量
    //     };

    //     var label = new BMap.Label(item.name, opts); // 创建文本标注对象
    //     label.setStyle({
    //       color: 'white',
    //       fontSize: '10px',
    //       height: '20px',
    //       lineHeight: '20px',
    //       fontFamily: '微软雅黑',
    //       backgroundColor: '0.000000000001', //通过这个方法，去掉背景色
    //       border: '0'
    //     });
    //     // map.addOverlay(label);

    //     // 创建覆盖层点击事件
    //     var myIcon = new BMap.Icon(coverIcon, new BMap.Size(14, 14));
    //     var marker = new BMap.Marker(pt, { icon: myIcon });  // 创建标注
    //     map.addOverlay(marker);
    //     marker.addEventListener("click", getAttr);
    //     var coverOpts = {
    //       width: 200, // 信息窗口宽度
    //       height: 130, // 信息窗口高度
    //       title: item.name, // 信息窗口标题
    //       enableMessage: true, //设置允许信息窗发送短息
    //       enableAutoPan: false
    //     };
    //     var infoWindow = new BMap.InfoWindow(
    //       "调解申请总数：" + item.caseCount.zsCount + "<br>调解成功数：" + item.caseCount.tjcgCount + "<br>司法确认总数：" + item.caseCount.sfqrcgCount,
    //       coverOpts
    //     ); // 创建信息窗口对象
    //     function getAttr() {
    //       map.openInfoWindow(infoWindow, pt); //开启信息窗口
    //     }
    //   })
    // })

  }

  time = () => {
    Fetch.findAllUnit().then(res => {
      var _arr = res.data.map(({ ...a, longLat, caseCount }) => ({
        ...a,
        color: colorRender(caseCount.zsCount, caseCount.total)[0],
        lng: longLat.split(',')[0],
        lat: longLat.split(',')[1],
        radius: colorRender(caseCount.zsCount, caseCount.total)[1]
      }))
      window.sessionStorage.setItem('addressInfo', JSON.stringify(_arr));
      _arr.length > 0 && _arr.forEach((item) => {
        // 显示街道名称
        // var opts = {
        //   position: pt, // 指定文本标注所在的地理位置
        //   offset: new BMap.Size(0, 0) //设置文本偏移量
        // };
        // var label = new BMap.Label(item.name.replace('白云区', ''), opts); // 创建文本标注对象
        // label.setStyle({
        //   color: 'white',
        //   fontSize: '9px',
        //   height: '20px',
        //   lineHeight: '20px',
        //   fontFamily: '微软雅黑',
        //   backgroundColor: '0.000000000001', //通过这个方法，去掉背景色
        //   border: '0'
        // });
        // map.addOverlay(label);

        var pt = new BMap.Point(item.lng, item.lat);
        // 创建水波涟漪图形
        var circles = new CircleShow(item.radius, 5, pt, {
          fillColor: item.color,
          fillOpacity: 0.9
        });
        circles.start(1000, 3000);



        // 创建覆盖层点击事件
        var myIcon = new BMap.Icon(coverIcon, new BMap.Size(14, 14));
        var marker = new BMap.Marker(pt, { icon: myIcon });  // 创建标注
        map.addOverlay(marker);
        marker.addEventListener("click", getAttr);
        var coverOpts = {
          width: 200, // 信息窗口宽度
          height: 130, // 信息窗口高度
          title: item.name, // 信息窗口标题
          enableMessage: true, //设置允许信息窗发送短息
          enableAutoPan: false
        };
        var infoWindow = new BMap.InfoWindow(
          "调解申请总数：" + item.caseCount.zsCount + "<br>调解成功数：" + item.caseCount.tjcgCount + "<br>司法确认总数：" + item.caseCount.sfqrcgCount,
          coverOpts
        ); // 创建信息窗口对象
        function getAttr() {
          map.openInfoWindow(infoWindow, pt); //开启信息窗口
        }
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="map-view" id="mapContainer">
        </div>
        <div id="l-map"></div>
        <div id="r-result"></div>
      </React.Fragment>
    );
  }
}

export default MapView;

function colorRender(num, sum) {
  var res = (num / sum).toFixed(2);
  if (res >= 0 && res <= 0.33) {
    return ['#29A9D6', 200 ];
  } else if (res > 0.33 && res <= 0.66) {
    return ['#FB9600', 400];
  } else {
    return ['#FF4242', 600];
  }
}