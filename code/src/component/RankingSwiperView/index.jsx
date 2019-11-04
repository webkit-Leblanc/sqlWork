import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import echarts from 'echarts'

import './index.scss';

class RankingSwiperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
  }

  componentDidMount() {
    let _this = this;
    Fetch.getMediationRanking().then(res => {
      _this.setState({
        dataList: res.data.sort((a, b) => (b.tjcgTotal - a.tjcgTotal)) || []
      })
      // res.data.map((item, idx) => {
      //   barRowGraph([item.tjcgTotal, 10], 'column' + idx)
      // })
      let mySwiper = new Swiper(
        '#ranking-swiper-view',
        {
          autoplay: {
            disableOnInteraction: false
          },
          initialSlide: 0,
          direction: 'vertical',
          speed: 1500,
          slidesPerView: 'anto',
          // slidesPerView: 8,
          loop: false
        }
      );

      var comtainer = document.getElementById('ranking-swiper-view');
      comtainer.onmouseenter = function () {
        mySwiper.autoplay.stop();
      };
      // 鼠标离开 继续轮播
      comtainer.onmouseleave = function () {
        mySwiper.autoplay.start();
      }
    });
    var timer = setInterval(() => {
      this.time();
    }, 5000)
  }

  time = () => {
    let _this = this;
    Fetch.getMediationRanking().then(res => {
      _this.setState({
        dataList: res.data.sort((a, b) => (b.tjcgTotal - a.tjcgTotal)) || []
      })
    });
  }

  render() {
    const { dataList } = this.state;

    return (
      <React.Fragment>
        <div className="ranking-swiper-view-title" style={{ fontWeight: 'bold' }}>
          <div style={{ paddingLeft: 10 }}>
            成员单位
          </div>
          <div>
            调解申请数
          </div>
          <div>
            司法确认数
          </div>
          <div>
            调解成功数
          </div>

        </div>
        <div className="swiper-container" id="ranking-swiper-view" style={{ flex: 1, width: '100%', height: '100%' }}>
          <div className="swiper-wrapper">
            {
              dataList.length > 0 && dataList.map((item, idx) => (
                <div className="swiper-slide ranking-swiper-view-item" key={idx} style={{ background: idx % 2 == 0 ? '#0A2150' : '', cursor: 'default' }}>
                  <div style={{ paddingLeft: 10, fontSize: 10 }}>
                    {item.unitName.replace('白云区', '')  || ''}
                  </div>
                  <div>
                    {item.zsTotal || 0}
                  </div>
                  <div>
                    {item.sfqrcgTotal || 0}
                  </div>
                  <div id={"column" + idx} style={{ height: '100%', width: '100%' }}>
                    <span style={{ width: '20%', textAlign: 'right' }}>
                      {
                        item.tjcgTotal || 0
                      }
                    </span>
                    <div style={{ flex: 1, height: '18px', paddingRight: '10%', paddingLeft: '4%' }}>
                      <span style={{ height: '100%', width: percent(item.tjcgTotal, dataList[0].tjcgTotal) + '%' }} className={percent(item.tjcgTotal, item.total) > 33 ? 'color66' : 'color33'}>

                      </span>
                    </div>
                  </div>

                </div>
              ))
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}



export default RankingSwiperView;

// 柱状图-排行榜
function barRowGraph(chartData, dom) {
  var charts = echarts.init(
    document.getElementById(dom)
  );
  var barGraphColor = [
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#0233B9'
      },
      {
        offset: 1,
        color: '#38E3FF'
      }
    ]),
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#0233B9'
      },
      {
        offset: 1,
        color: '#38E3FF'
      }
    ]),
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#0233B9'
      },
      {
        offset: 1,
        color: '#38E3FF'
      }
    ]),
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#0233B9'
      },
      {
        offset: 1,
        color: '#38E3FF'
      }
    ]),
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#F14843'
      },
      {
        offset: 1,
        color: '#F3D852'
      }
    ])
  ];
  const option = {
    grid: {
      left: '0%',
      // right: '50%',
      bottom: '90%',
      // top: '10%',
      containLabel: true
    },
    xAxis: [
      {
        show: false,
        type: 'value'
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: 'none',
        axisLine: 'none',
        offset: '2',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#fff',
            fontSize: '12'
          }
        },
        data: chartData
      }
    ],

    series: [
      //亮色条 百分比
      {
        show: true,
        type: 'bar',
        barGap: '20',
        barWidth: '15',
        itemStyle: {
          normal: {
            color: function (params) {
              var num = barGraphColor.length;
              return barGraphColor[params.dataIndex % num];
            }
          }
        },
        label: {
          normal: {
            show: false,
            textStyle: {
              color: function (params) {
                var num = color.length;
                return color[params.dataIndex % num];
              },
              fontSize: 15,
              fontWeight: 'bold'
            },
            position: 'right'
          }
        },
        data: chartData
      }
    ]
  };
  charts.setOption(option);
}

function colorRender(num, sum) {
  var res = (num / sum).toFixed(2);
  if (res >= 0 && res <= 0.33) {
    return '#FBCCCB';
  } else if (res > 0.33 && res <= 0.66) {
    return '#43F183';
  } else {
    return '#F14743';
  }
}


function percent(num, sum) {
  return (num / sum).toFixed(2) * 100
}

