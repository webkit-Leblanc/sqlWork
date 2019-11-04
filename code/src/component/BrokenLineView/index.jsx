import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';

//导入echarts
// var echarts = require('echarts/lib/echarts'); //必须
// require('echarts/lib/chart/line'); //图表类型
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/legend');
// require('echarts/lib/component/title'); //标题插件\
import echarts from 'echarts'

import './index.scss';

class BrokenLineView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    Fetch.getMonthCount().then(res => {
      BrokenLineFun(res.data);
    })

  }

  render() {

    return (
      <div style={{ height: '100%', width: '100%' }} id="broken-line-view" >
        折线图
      </div>
    );
  }
}

export default BrokenLineView;

function BrokenLineFun(data) {
  var myChart = echarts.init(document.getElementById('broken-line-view'));
  const option = {
    // grid: {
    //   left: '1%',
    //   right: '3%',
    //   top: '5%',
    //   bottom: '10%',
    //   containLabel: true
    // },
    grid: {
      top: '16%',   // 等价于 y: '16%'
      left: '3%',
      right: '8%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      show: true,
      left:"10%",    
      x: 'center',
      y: '0',
      icon: 'stack',
      itemWidth: 24,
      itemHeight: 8,
      textStyle: {
        color: '#fff'
      },
      data: ['调解申请数', '调解成功数', '司法确认数']
    },

    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#fff'
        },
        name: '月份',
        nameTextStyle: {
          color: '#fff'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#397cbc'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#195384'
          }
        },
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ]
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '数量',
        nameTextStyle: {
          color: '#fff'
        },
        min: 0,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#fff'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#397cbc'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#11366e'
          }
        }
      }
    ],
    series: [
      {
        name: '调解申请数',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: '#F92D2D',
            lineStyle: {
              color: '#F92D2D',
              width: 2
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FF5252'
                },
                {
                  offset: 1,
                  color: '#5C2742'
                }
              ])
            }
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        data: data.zsList || []
      },
      {
        name: '调解成功数',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        symbolSize: 8,
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(255,175,88)',
            lineStyle: {
              color: 'rgb(255,175,88)',
              width: 2
            },
            areaStyle: {
              // color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: '#8C7356' // 0% 处的颜色
              },
              {
                offset: 1, color: '#4A4B4D' // 100% 处的颜色
              }])
            }
          }
        },
        markPoint: {
          itemStyle: {
            normal: {
              color: 'red'
            }
          }
        },
        data: data.tjcgList || []
      },
      {
        name: '司法确认数',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        symbolSize: 8,
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        itemStyle: {
          normal: {
            color: '#51F8FC',
            lineStyle: {
              color: '#51F8FC',
              width: 2
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#012E58'
                },
                {
                  offset: 1,
                  color: '#012450'
                }
              ])
            }
          }
        },
        data: data.sfqrList || []
      }

    ]
  };
  myChart.setOption(option);
}


