window.onload = function() {
  setInterval(function() {
    var date = moment(new Date()).format('YYYY年MM月DD日 HH:mm:ss'); // 计算当前时间
    document.getElementById('now-time').innerHTML = date;
  }, 1000);

  line();
  barRowGraph(['340', '420', '439', '542', '1041']);
  barRowGraph2(['150', '184', '194', '204', '214']);
  gauge(120);
  getCount();
  var mySwiper = new Swiper('.swiper-container-count', {
    autoplay: 2000, //可选选项，自动滑动
    // slidesPerView: 5,
    speed: 2000
    // effect: 'fade',
    // fade: {
    //   crossFade: true
    // }
  });
};

function getCount() {
  $.ajax({
    type: 'get',
    url: _path + '/api/bigScreen/getCount',
    success: function(res) {
      if (res.code === 200) {
        var data = res.data;
        // servOrdersCount 服务单
        // chanceCount 商机单
        // contractCount 签约单

        Circle({
          name: '邀约成功率',
          value: (data.servOrdersCount / data.chanceCount) * 100
        }); //饼图1
        Circle2({
          name: '签约成功率',
          value: (data.contractCount / data.servOrdersCount) * 100
        }); //饼图2
        barGraph([data.chanceCount, data.servOrdersCount, data.contractCount]); //柱状图
      } else {
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function setLinearColor1(color, pos) {
  var color1 = '',
    color2 = '';
  if (color === 'red') {
    color1 = '#fa859d';
    color2 = '#f83e64';
  } else {
    color2 = '#5a88e7';
    color1 = '#8cc8ef';
  }
  var x = 0,
    y = 1;
  if (pos && pos === 'column') {
    x = 1;
    y = 0;
  }
  return new echarts.graphic.LinearGradient(0, 0, x, y, [
    { offset: x, color: color1 },
    { offset: y, color: color2 }
  ]);
}

//饼图1
function Circle(data) {
  var charts = echarts.init(document.getElementById('index-content-right-t'));
  option = {
    title: {
      text: data.name,
      left: '45%',
      top: '80%',
      x: 'center',
      textAlign: 'center',
      textStyle: {
        fontSize: 14,
        color: '#ffffff'
      }
    },
    series: [
      {
        name: data.name,
        type: 'pie',
        clockWise: true,
        startAngle: 270, //起始角度
        radius: [25, 35],
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: '#0233B9'
              },
              {
                offset: 1,
                color: '#38E3FF'
              }
            ]),
            shadowBlur: 0,
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        },
        hoverAnimation: true,
        center: ['50%', '40%'],
        data: [
          {
            value: data.value,
            label: {
              normal: {
                formatter: function(params) {
                  return params.value + '%';
                },
                position: 'center',
                show: true,
                textAlign: 'center',
                textStyle: {
                  fontSize: '14',
                  color: '#fff'
                }
              }
            }
          },
          {
            value: 100 - data.value,
            width: '12%',
            itemStyle: {
              normal: {
                color: 'transparent',
                itemWidth: 10
              }
            }
          }
        ]
      },
      {
        type: 'pie',
        radius: [30, 35],
        startAngle: 270, //起始角度
        center: ['50%', '40%'],
        hoverAnimation: false,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        data: [
          {
            value: data.value,
            itemStyle: {
              color: 'transparent'
            }
          },
          {
            value: 100 - data.value,
            itemStyle: {
              color: '#0E175C'
            }
          }
        ]
      }
    ]
  };
  charts.setOption(option);
}
//饼图2
function Circle2(data) {
  var charts = echarts.init(document.getElementById('index-content-right-t-2'));
  option = {
    title: {
      text: data.name,
      left: '45%',
      top: '80%',
      x: 'center',
      textAlign: 'center',
      textStyle: {
        fontSize: 14,
        color: '#ffffff'
      }
    },
    series: [
      {
        name: data.name,
        type: 'pie',
        clockWise: true,
        startAngle: 270, //起始角度
        radius: [25, 35],
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: '#8301B5'
              },
              {
                offset: 1,
                color: '#FE2768'
              }
            ]),
            shadowBlur: 0,
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        },
        hoverAnimation: true,
        center: ['50%', '40%'],
        data: [
          {
            value: data.value,

            label: {
              normal: {
                formatter: function(params) {
                  return params.value + '%';
                },
                position: 'center',
                show: true,
                textAlign: 'center',
                textStyle: {
                  fontSize: '14',
                  color: '#fff'
                }
              }
            }
          },
          {
            value: 100 - data.value,
            width: '12%',
            itemStyle: {
              normal: {
                color: 'transparent',
                itemWidth: 10
              }
            }
          }
        ]
      },
      {
        type: 'pie',
        radius: [30, 35],
        startAngle: 270, //起始角度
        center: ['50%', '40%'],
        hoverAnimation: false,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        data: [
          {
            value: data.value,
            itemStyle: {
              color: 'transparent'
            }
          },
          {
            value: 100 - data.value,
            itemStyle: {
              color: '#0E175C'
            }
          }
        ]
      }
    ]
  };
  charts.setOption(option);
}

// 柱状图
function barGraph(chartData) {
  var charts = echarts.init(
    document.getElementById('index-content-right-t-barGraph')
  );
  var color = ['#2472D1', '#38E2FF', '#FD2769'];
  var barGraphColor = [
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: '#8301B5'
      },
      {
        offset: 1,
        color: '#FE2768'
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
        color: '#261788'
      },
      {
        offset: 1,
        color: '#2472D1'
      }
    ])
  ];
  option = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '-32%',
      top: '-10%',
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
            fontSize: '14'
          }
        },
        data: ['商机单', '服务单', '签约单']
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
            color: function(params) {
              var num = barGraphColor.length;
              return barGraphColor[params.dataIndex % num];
            }
          }
        },
        label: {
          normal: {
            show: true,
            textStyle: {
              color: function(params) {
                var num = color.length;
                return color[params.dataIndex % num];
              },
              fontSize: 16,
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

// 柱状图-排行榜
function barRowGraph(chartData) {
  var charts = echarts.init(document.getElementById('index-left-bar'));
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
  option = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '5%',
      top: '0%',
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
            fontSize: '14'
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
            color: function(params) {
              var num = barGraphColor.length;
              return barGraphColor[params.dataIndex % num];
            }
          }
        },
        label: {
          normal: {
            show: false,
            textStyle: {
              color: function(params) {
                var num = color.length;
                return color[params.dataIndex % num];
              },
              fontSize: 16,
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

// 柱状图-排行榜
function barRowGraph2(chartData) {
  var charts = echarts.init(
    document.getElementById('index-content-right-center-bar2')
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
  option = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '5%',
      top: '0%',
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
            fontSize: '14'
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
            color: function(params) {
              var num = barGraphColor.length;
              return barGraphColor[params.dataIndex % num];
            }
          }
        },
        label: {
          normal: {
            show: false,
            textStyle: {
              color: function(params) {
                var num = color.length;
                return color[params.dataIndex % num];
              },
              fontSize: 16,
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

//折线图

function line() {
  var charts = echarts.init(document.getElementById('index-foot-r-line'));
  option = {
    grid: {
      left: '1%',
      right: '3%',
      top: '5%',
      bottom: '10%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    legend: {
      show: true,
      x: 'center',
      y: '0',
      icon: 'stack',
      itemWidth: 24,
      itemHeight: 8,
      textStyle: {
        color: '#1bb4f6'
      },
      data: ['商机单', '服务单', '签约单']
    },

    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
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
          '',
          '06.01',
          '06.02',
          '06.03',
          '06.04',
          '06.05',
          '06.06',
          '06.07',
          '06.08',
          '06.09',
          '06.10',
          '06.11',
          '06.12',
          '06.13',
          '06.14',
          '06.15'
        ]
      }
    ],
    yAxis: [
      {
        type: 'value',
        // name : '数量',
        nameTextStyle: {
          textShadowOffsetY: 2
        },
        min: 0,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#fff'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#27b4c2'
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
        name: '签约单',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: '#FA2969',
            lineStyle: {
              color: '#FA2969',
              width: 1
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(192,61,118)'
                },
                {
                  offset: 1,
                  color: 'rgba(107,51,102)'
                }
              ])
            }
          }
        },
        data: [
          150,
          232,
          201,
          154,
          190,
          330,
          410,
          150,
          300,
          201,
          154,
          190,
          220,
          222,
          240,
          260
        ]
      },
      {
        name: '服务单',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        symbolSize: 8,

        itemStyle: {
          normal: {
            color: '#36D9F7',
            lineStyle: {
              color: '#36D9F7',
              width: 1
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(45,180,221)'
                },
                {
                  offset: 1,
                  color: 'rgba(33,135,176)'
                }
              ])
            }
          }
        },
        data: [
          220,
          182,
          191,
          234,
          290,
          330,
          310,
          201,
          154,
          190,
          330,
          410,
          420,
          430,
          440,
          450
        ]
      },
      {
        name: '商机单',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: '#2458D1',
            lineStyle: {
              color: '#2458D1',
              width: 1
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(19,50,132)'
                },
                {
                  offset: 1,
                  color: 'rgba(14,39,112)'
                }
              ])
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
        data: [
          120,
          132,
          101,
          134,
          90,
          230,
          210,
          182,
          191,
          234,
          290,
          330,
          340,
          350,
          360,
          370
        ]
      }
    ]
  };
  charts.setOption(option);
}

//仪表盘

function colortype(code) {
  if (code <= 50) {
    return [
      [
        code * 0.0067,
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#FF5C77'
          },
          {
            offset: 1,
            color: '#FE365E'
          }
        ])
      ],
      [1, '#222e7d']
    ];
  } else if (50 < code && code <= 100) {
    return [
      [
        0.35,
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#FF5C77'
          },
          {
            offset: 1,
            color: '#FE365E'
          }
        ])
      ],
      [
        code * 0.0067,
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: '#FDC35E'
          },
          {
            offset: 1,
            color: '#FFEC5F'
          }
        ])
      ],
      [1, '#222e7d']
    ];
  } else if (100 < code && code <= 150) {
    return [
      [
        0.35,
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#FF5C77'
          },
          {
            offset: 1,
            color: '#FE365E'
          }
        ])
      ],
      [
        0.67,
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: '#FDC35E'
          },
          {
            offset: 1,
            color: '#FFEC5F'
          }
        ])
      ],
      [
        code * 0.0066,
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#0CEA8D'
          },
          {
            offset: 1,
            color: '#26C6AE'
          }
        ])
      ],
      [1, '#222e7d']
    ];
  } else {
    return [
      [
        0.35,
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#FF5C77'
          },
          {
            offset: 1,
            color: '#FE365E'
          }
        ])
      ],
      [
        0.67,
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: '#FDC35E'
          },
          {
            offset: 1,
            color: '#FFEC5F'
          }
        ])
      ],
      [
        1,
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#0CEA8D'
          },
          {
            offset: 1,
            color: '#26C6AE'
          }
        ])
      ]
    ];
  }
}

function gauge(value) {
  var charts = echarts.init(
    document.getElementById('index-content-left-b-gauge')
  );

  option = {
    title: {
      text: `823万/1244万\n\n当月收入/业绩目标`,
      // subtext: '823万/1244万\n\n当月收入/业绩目标',
      left: 'center',
      top: '60%', //top待调整
      textStyle: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'PingFangSC-Regular'
      },
      itemGap: 120 //主副标题间距
    },
    series: [
      {
        type: 'gauge',
        radius: '92%',
        //splitNumber: 10,
        min: 0,
        max: 150,
        startAngle: 225,
        endAngle: -45,
        splitNumber: 6, // 仪表盘刻度的分割段数,默认 10。
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(0,0,0,0)']]
          }
        }, //仪表盘轴线
        axisTick: {
          show: true,
          splitNumber: 10,
          lineStyle: {
            color: 'rgba(255,255,255,0.6)',
            width: 1
          },
          length: -8
        }, //刻度样式
        splitLine: {
          show: true,
          length: -15,
          lineStyle: {
            color: 'rgba(255,255,255,0.6)'
          }
        }, //分隔线样式
        axisLabel: {
          show: true,
          distance: 30,
          textStyle: {
            color: '#03b7c9',
            fontSize: '14',
            fontWeight: 'bold'
          },
          formatter: '{value}'
        },
        detail: {
          show: 0
        }
      },

      // 内侧指针、数值显示
      {
        name: '达标率',
        type: 'gauge',
        radius: '70%',
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 150,
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            color: colortype(value)
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
          length: '90%',
          width: 3
        },
        detail: {
          // 仪表盘详情，用于显示数据。
          show: true, // 是否显示详情,默认 true。
          offsetCenter: [0, '15%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
          color: '#fff', // 文字的颜色,默认 auto。
          fontSize: 16, // 文字的字体大小,默认 15。
          z: 12,
          formatter: '{value}%' // 格式化函数或者字符串
        },

        itemStyle: {
          // 仪表盘指针样式。
          color: '#fff', // 指针颜色，默认(auto)取数值所在的区间的颜色
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
