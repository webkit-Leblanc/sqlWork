import React from 'react';
import { Row, Col, Steps } from 'antd';
import Fetch from '../../fetch';

import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import echarts from 'echarts';
import step1 from '../../asset/image/step-1.png';
import step2 from '../../asset/image/step-2.png';
import step3 from '../../asset/image/step-3.png';
import step4 from '../../asset/image/step-4.png';

// import Viewer from '../../conf/viewJs/viewJs/viewer';
// import '../../conf/viewJs/viewJs/viewer.css'

import './index.scss';
const { Step } = Steps;

class ScaleDrawingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []

    };
  }

  componentDidMount() {
    let _this = this;
    Fetch.getCaseReasonRate().then(res => {
      res = res.data.map(({ caseReason, caseCount }) => ({
        name: caseReason,
        value: caseCount
      }));
      // res = [{ name: '1', value: 1}, { name: '2', value: 2},{ name: '3', value: 3},{ name: '4', value: 4},{ name: '56', value: 56}, ]
      ScaleDrawing(res.sort((a, b) => (a.value - b.value)));
    });

    Fetch.getMediationDynamic().then(res => {
      _this.setState({
        dataList: res.data
      })

      window.sessionStorage.setItem('caseList', JSON.stringify(res.data));

      var mySwiper = new Swiper(
        '#time-data-swiper-view',
        {
          autoplay: {
            disableOnInteraction: false
          },
          direction: 'vertical',
          // slidesPerView: 'auto',
          slidesPerView: 'auto',
          speed: 1500,
          loop: false
        }
      );
      var comtainer = document.getElementById('time-data-swiper-view');
      comtainer.onmouseenter = function () {
        mySwiper.autoplay.stop();
      };
      // 鼠标离开 继续轮播
      comtainer.onmouseleave = function () {
        mySwiper.autoplay.start();
      }
    })
    var timer = setInterval(() => {
      this.time();
    }, 5000);
  }

  time = () => {
    let _this = this;
    Fetch.getCaseReasonRate().then(res => {
      res = res.data.map(({ caseReason, caseCount }) => ({
        name: caseReason,
        value: caseCount
      }));
      ScaleDrawing(res.sort((a, b) => (a.value - b.value)));
    });

    Fetch.getMediationDynamic().then(res => {
      _this.setState({
        dataList: res.data
      })
    })
  }

  formatDate = (ts) => {
    var now = new Date(ts);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  }


  formatStep = (status) => {
    switch(status) {
      case 1:
        return step1;
      case 2: 
        return step2;
      case 3:
        return step3;
      case 4:
        return step4;
    }
  }

  zoom = () => {
    console.log(999)
  }

  
  showTip = (unitId, caseid) => {
    console.log(unitId, caseid);

    var addressInfo = JSON.parse(window.sessionStorage.getItem('addressInfo'));
    var caseList = JSON.parse(window.sessionStorage.getItem('caseList'));

    var address = addressInfo.find(({ id }) => (id == unitId));
    var caseItem = caseList.find(({ caseId }) => (caseid == caseId)).caseInfo;

    console.log(address, caseItem);
    var pt = new BMap.Point(address.lng, address.lat);

    var coverOpts = {
      width: 400, // 信息窗口宽度
      height: 370, // 信息窗口高度
      title: caseid + '  ' + caseItem.caseReason, // 信息窗口标题
      enableMessage: true, //设置允许信息窗发送短息
      enableAutoPan: false
    };

    var step = 'step' + caseItem.status

    var html = `
      <div class="map-cover-content-main" style="display: block;">
        <div class="map-cover-content" style="display: block">
          <div class="map-cover-content-left" style="display: block">
            <span class="map-cover-content-left-time">${this.formatDate(caseItem.createTime)}</span><br>
            申请人：${caseItem.plaintiff} <br>
            被申请人：${caseItem.defendant} <br>
            调解单位：${address.name}
            <span class="fontClass" style="-webkit-line-clamp: 3;">纠纷内容：${caseItem.claim || ''}</span>
          </div>
          <div class="map-cover-content-right"  style="display: block">
            <img src=${this.formatStep(caseItem.status)} style="cursor: pointer;"/>
          </div>
        </div>
        <div class="map-cover-content-swiper" style="display: block;">
        
          <div class="swiper-container" id="img-data-swiper-view" style="width: 100%;height: 100%;display: block;">
            <div class="swiper-wrapper"  style="display: flex;">
              ${caseItem.attachmentList.map(({ url, id }) => (
      `<img  src=${url} class="swiper-slide" style="display: block;cursor: pointer;top: 0;" onclick="zoom(this)"/>`
    )).join('')}
            </div>
            <div class="swiper-pagination"  style="display: block;"></div>
          </div>

        </div>
        </div>`;

    map.openInfoWindow(new BMap.InfoWindow(html, coverOpts), pt); //开启信息窗口
    var swiper = new Swiper('#img-data-swiper-view', {
      slidesPerView: 3,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        disableOnInteraction: false
      },
      speed: 1500,
      loop: false
    });

    var comtainer = document.getElementById('img-data-swiper-view');
    comtainer.onmouseenter = function () {
      swiper.autoplay.stop();
    };
    // 鼠标离开 继续轮播
    comtainer.onmouseleave = function () {
      swiper.autoplay.start();
    }

  }

  render() {
    const { dataList } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: '100%' }} id="brokenLine-view-pie" >
        </div>

        <div style={{ width: '100%', height: '50%', display: 'flex', flexDirection: 'column' }} className="ranking-swiper-div">
          {
            dataList.length > 0 &&
            <React.Fragment>
              <div className="time-data-item" onClick={() => { this.showTip(dataList[0].unitId, dataList[0].caseId) }} style={{ background: '#0F3367', borderBottom: '1px solid #091B57', cursor: 'pointer' }}>
                <div className="time-data-item-radio" style={{ background: 0 % 2 == 0 ? '-webkit-gradient(linear, 0 0, 0 100%, from(#FF5252), to(#FA1414))' : '-webkit-gradient(linear, 0 0, 0 100%, from(#FFD062), to(#FF915A))' }}>
                </div>
                <div className="time-data-item-status" >
                  <div className='color3'>
                    {dataList[0].status}
                  </div>
                </div>
                <div className="time-data-item-tips">
                  <div className='color3'>
                    {dataList[0].content}
                  </div>
                </div>
              </div>
              <div className="ranking-swiper-view swiper-container" id="time-data-swiper-view" style={{ width: '100%', height: '100%' }}>
                <div className="swiper-wrapper">
                  {
                    dataList.slice(1).map((item, idx) => (
                      <div className="swiper-slide time-data-item" key={idx} style={{ background: idx % 2 == 0 ? '#0F3367' : '#091B57', cursor: 'pointer' }} onClick={() => { this.showTip(item.unitId, item.caseId) }}>
                        <div className="time-data-item-radio" style={{ background: idx % 2 == 0 ? '-webkit-gradient(linear, 0 0, 0 100%, from(#55FDFD), to(#00B1E1))' : '-webkit-gradient(linear, 0 0, 0 100%, from(#FFD062), to(#FF915A))' }}>
                        </div>
                        <div className="time-data-item-status" >
                          <div className={idx % 2 == 0 ? 'color1' : 'color2'}>
                            {item.status}
                          </div>
                        </div>
                        <div className="time-data-item-tips">
                          <div>
                            {item.content}
                          </div>
                        </div>
                      </div>
                    ))
                  }

                </div>
              </div >
            </React.Fragment>
          }
        </div>

      </React.Fragment>
    );
  }
}

export default ScaleDrawingView;

function ScaleDrawing(data) {
  var colorList = ['#FF6ED4', '#FF3396', '#FC1968', '#E70756', '#EB0345', '#CF0B3F', '#A10000', '#922E00', '#663800', '#460000'].reverse();
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)",
      color: '#fff'
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left',
    // },
    series: [
      {
        // name: '访问来源',
        type: 'pie',
        radius: '50%',
        center: ['50%', '50%'],
        label: {
          normal: {
            show: true,
            formatter: "{b}",
            color: '#fff',
          }
        },
        // roseType: 'radius',
        // roseType: 'area',
        data: data,
        itemStyle: {
          normal: {
            color: (params) => {
              return colorList[params.dataIndex]
            }
          }
        }
      }
    ]
  };

  var myChart = echarts.init(document.getElementById('brokenLine-view-pie'));
  myChart.setOption(option);

}

function zoom ( path)  {
  console.log(path);
}


