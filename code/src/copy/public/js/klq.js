$(document).ready(function() {
  let dayCount = 123456789;
  let monthCount = 45123678;
  trendData();
  Reimbursement(); //报账数据
  realTimeData(); //业务实时数据
});

//业务实时数据
function realTimeData() {
  $.ajax({
    type: 'get',
    url: _path + '/api/bigScreen/getBusInfo',
    success: function(res) {
      if (res.code === 200) {
        var d = res.data.bigScreens;
        var data = res.data;
        let liveTimeData_dom = '';
        let obj = '';
        for (let i = 0; i < d.length; i++) {
          liveTimeData_dom += `<div class="swiper-slide live-data-item">
                        <div class="live-data-item-left">
                            ${d[i].data}
                        </div>
                        <div class="live-data-item-center">
                            ${d[i].busType}
                        </div>
                        <div class="live-data-item-right">
                            ${d[i].busInfo}
                        </div>
                    ${i}
                </div>`;
        }
        obj +=
          '<div class="index-content-right-b-countContent">' +
          '<div class="index-content-right-b-countItem-1">' +
          '<div class="index-content-right-b-countItem-top">' +
          data.callMount +'人'+
          '</div>' +
          '<div class="index-content-right-b-countItem-bottom">电话咨询总数' +
          '</div>' +
          '</div>' +
          '<div class="index-content-right-b-countItem-2">' +
          '<div class="index-content-right-b-countItem-top">' +
          data.imCount +'人'+
          '</div>' +
          '<div class="index-content-right-b-countItem-bottom">小程序咨询总数' +
          '</div>' +
          '</div>' +
          '<div class="index-content-right-b-countItem-3">' +
          '<div class="index-content-right-b-countItem-top">' +
          data.invCount +'人'+
          '</div>' +
          '<div class="index-content-right-b-countItem-bottom">邀约总数' +
          '</div>' +
          '</div>' +
          '<div class="index-content-right-b-countItem-4">' +
          '<div class="index-content-right-b-countItem-top">' +
          data.contractCount +'件'+
          '</div>' +
          '<div class="index-content-right-b-countItem-bottom">签约总数' +
          '</div>' +
          '</div>' +
          '<div class="index-content-right-b-countItem-5">' +
          '<div class="index-content-right-b-countItem-top">' +
          data.reimbursesCount +''+
          '</div>' +
          '<div class="index-content-right-b-countItem-bottom">报账数' +
          '</div>' +
          '</div>' +
          '</div>';
        $('#real-Time').html(obj);
        $('#index-content-right-b-main-swiper-wrapper').html(liveTimeData_dom);
        var mySwiper = new Swiper(
          '.index-content-right-b-main-swiper-container',
          {
            autoplay: true,
            direction: 'vertical',
            slidesPerView: 5,
            speed: 2000
            //   loop: true,
          }
        );
      } else {
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

//报账数据
function Reimbursement() {
  $.ajax({
    type: 'get',
    url: _path + '/api/bigScreen/getReimbursement',
    success: function(res) {
      if (res.code === 200) {
        var d = res.data;
        var obj = '';
        obj +=
          '<div class="index-content-left-t-dayCount">' +
          '<div class="index-content-left-t-dayCount-title">今日报账额：</div>' +
          '<div class="index-content-left-t-dayCount-data">' +
          handleData(d.todayMoney) +
          '<div class="index-content-left-t-dayCount-data-div"><span>元</span></div>' +
          '</div>' +
          '<div class="index-content-left-t-dayCount-more">' +
          '<div class="index-content-left-t-dayCount-more-left">昨日报账' +
          '<div class="index-content-left-t-yerCount-data">' +
          handleData(d.yesMoney) +
          '</div></div>' +
          '<div class="index-content-left-t-dayCount-more-right">' +
          '<img class="icon-down" src="./image/icon_down.png" />' +
          '<img class="icon-up" src="./image/icon_up.png" />/比增' +
          '<div class="index-content-left-t-dayCount-more-data"></div>' +
          (d.rate ? d.rate : 0) +
          '%' +
          '</div></div></div>';
        var obj2 = '';
        obj2 +=
          '<div class="index-content-left-t-monthCount">' +
          '<div class="index-content-left-t-monthCount-title">月日报账额：</div>' +
          '<div class="index-content-left-t-monthCount-data">' +
          handleData(d.monthMoney) +
          '<div class="index-content-left-t-monthCount-data-div"><span>元</span></div>' +
          '</div></div>';
        $('#index-content-left-t-today').html(obj);
        $('#index-content-left-t-month').html(obj2);
      } else {
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

//数字处理函数
function handleData(num) {
  num = num.toString();
  // console.log(num)
  //没处理一次，后三个数据就不需要处理了
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      ',' +
      num.substring(num.length - (4 * i + 3));
  }
  return num;
}

function trendData() {
  var charts = echarts.init(
    document.getElementById('income-trent-echart-main')
  );
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        textStyle: {
          color: '#fff'
        }
      }
    },
    grid: {
      show: false,
      left: '1%',
      right: '3%',
      top: '10%',
      bottom: '4%',
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: ['10%', '10%'],
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
        '12月'
      ],
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      axisTick: {
        show: false
      },
      nameTextStyle: {
        //---坐标轴名称样式
        color: '#fff',
        padding: [0, 0, 0, -5] //---坐标轴名称相对位置
      }
    },
    yAxis: {
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        type: 'line',
        name: '环比增长',
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: '#f14343'
              },
              {
                offset: 1,
                color: '#f2d552'
              }
            ]),
            barBorderRadius: 50,
            label: {
              show: false,
              position: 'top',
              formatter: function(p) {
                return p.value > 0 ? p.value : '';
              }
            }
          }
        },
        data: [42, 17, 32, 22, 20, 37, 36, 32, 42, 40, 25, 35].map(function(
          val
        ) {
          return val;
        })
      },
      {
        type: 'bar',
        name: '收入',
        stack: '1',
        barGap: '20',
        barWidth: '35',
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
            ])
          }
        },
        // barWidth:'30%',
        data: [40, 15, 30, 20, 18, 35, 34, 30, 40, 38, 23, 33]
      }
    ]
  };
  charts.setOption(option);
}
