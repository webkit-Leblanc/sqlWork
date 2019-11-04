import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';

//导入echarts
// var echarts = require('echarts/lib/echarts'); //必须
// require('echarts/lib/chart/line'); //图表类型
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/legend');
// require('echarts/lib/component/title'); //标题插件\
import echarts from 'echarts';

import './index.scss';

class GaugeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.time();
    var timer = setInterval(() => {
      this.time();
    }, 5000)
  }

  time = () => {
    Fetch.getMediationRate().then(res => {
      // console.log('getMediationRate res', res);
      res = res.data;
      gauge(res.tjcgRate, 'gauge-view', '调解成功率');
      gauge(res.sfqrcgRate, 'gauge-view2', '司法确认率');
    })
  }

  render() {

    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: '50%' }} id="gauge-view" >
          仪表盘
        </div>
        <div style={{ height: '100%', width: '50%' }} id="gauge-view2" >
          仪表盘
        </div>
      </div>
    );
  }
}

export default GaugeView;

function gauge(value, dom, txt) {
  var charts = echarts.init(
    document.getElementById(dom)
  );

  const option = {
    title: {
      text: txt,
      // subtext: '823万/1244万\n\n当月收入/业绩目标',
      left: 'center',
      top: '75%', //top待调整
      textStyle: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'PingFangSC-Regular'
      },
      itemGap: 120 //主副标题间距
    },
    series: [
      // 内侧指针、数值显示
      {
        name: '达标率',
        type: 'gauge',
        radius: '70%',
        startAngle: 180, //开始角度 左侧角度
        endAngle: 0, //结束角度 右侧
        center: ['50%', '50%'],
        min: 0,
        max: 100,
        axisLine: {
          show: true,
          lineStyle: {
            width: 18,
            // color: colortype(value)
            color: [[0.3333, '#FF5252'], [0.6667, '#FFC484'], [1, '#82FDFE']]
          }
        },
        axisTick: {
          show: 0
        },
        splitLine: {
          show: 0
        },
        axisLabel: {
          show: 0
        },
        pointer: {
          show: true,
          length: '50%',
          width: 3
        },
        detail: {
          // 仪表盘详情，用于显示数据。
          show: true, // 是否显示详情,默认 true。
          offsetCenter: [0, '50%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
          // color: '#fff', // 文字的颜色,默认 auto。
          fontSize: 20, // 文字的字体大小,默认 15。
          z: 12,
          formatter: '{value}%' // 格式化函数或者字符串
        },

        itemStyle: {
          // 仪表盘指针样式。
          // color: '#fff', // 指针颜色，默认(auto)取数值所在的区间的颜色
          opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
          borderWidth: 0, // 描边线宽,默认 0。为 0 时无描边。
          borderType: 'solid', // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
          borderColor: '#000', // 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
          shadowBlur: 20, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
          shadowColor: '#fff' // 阴影颜色。支持的格式同color。
        },

        data: [
          {
            value: value
          }
        ]
      }
    ]
  };
  charts.setOption(option);
}




