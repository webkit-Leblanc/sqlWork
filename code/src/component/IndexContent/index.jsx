import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';
import ScaleDrawingView from '../ScaleDrawingView';
import GaugeView from '../GaugeView';
import RankingSwiperView from '../RankingSwiperView';
import MapView from '../MapView';

import './index.scss';

class IndexContentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    this.time();
    var timer = setInterval(() => {
      this.time();
    }, 5000)
  }

  time = () => {
    let _this = this;
    Fetch.getMediationCount().then(res => {
      _this.setState({
        data: res.data
      })
    })
  }

  render() {
    const { data } = this.state;
    return (
      <div className="index-content-view">
        <div className="index-content-view-left">
          <div className="index-content-view-left-top">
            <GaugeView />
          </div>
          {/* <div style={{ height: '10px'}}> */}
          {/* </div> */}
          <div className="index-content-view-left-bottom">
            <RankingSwiperView />
          </div>

        </div>
        <div className="index-content-view-middle">
          <div className="index-content-view-middle-top">
            <div className="index-content-view-middle-top-item">
              <div className="index-content-view-middle-top-item-title" style={{ color: '#fff' }}>
                调解申请总数
              </div>
              <div className="index-content-view-middle-top-item-value backgroundColor1" key={data.zsCount}>
                {data.zsCount}
              </div>
            </div>

            <div className="index-content-view-middle-top-item">
              <div className="index-content-view-middle-top-item-title" style={{ color: '#fff' }}>
                正在调解数
              </div>
              <div className="index-content-view-middle-top-item-value backgroundColor2" key={data.tjCount}>
                {data.tjCount}
              </div>
            </div>

            <div className="index-content-view-middle-top-item">
              <div className="index-content-view-middle-top-item-title" style={{ color: '#fff' }}>
                调解成功数
              </div>
              <div className="index-content-view-middle-top-item-value backgroundColor2" key={data.tjcgCount}>
                {data.tjcgCount}
              </div>
            </div>

        

            <div className="index-content-view-middle-top-item">
              <div className="index-content-view-middle-top-item-title" style={{ color: '#fff' }}>
                司法确认总数
              </div>
              <div className="index-content-view-middle-top-item-value backgroundColor3" key={data.sfqrcgCount}>
                {data.sfqrcgCount}
              </div>
            </div>
          </div>
          <div className="index-content-view-middle-bottom">
            <MapView />
          </div>

        </div>
        <div className="index-content-view-right">
          <ScaleDrawingView />
        </div>

      </div>
    );
  }
}

export default IndexContentView;
