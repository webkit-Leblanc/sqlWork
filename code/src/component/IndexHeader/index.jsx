import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';
import moment from 'moment';
import './index.scss';

class IndexHeaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment(new Date()).format('YYYY年MM月DD日 HH:mm:ss')
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        time: moment(new Date()).format('YYYY年MM月DD日 HH:mm:ss')
      })
    }, 1000);
  }

  render() {

    return (
      <div className="index-header-view">
        <div className="index-header-view-top"></div>
        <div className="index-header-view-bottom">
          <div className="index-header-view-bottom-left">

          </div>
          <div className="index-header-view-bottom-right">
            {/* <span>
              {
                this.state.time
              }
            </span> */}
          </div>

        </div>
        <div className="index-header-view-middleWord">
          白云区矛盾纠纷多元化解平台数据实时动态
        </div>
        <div className="index-header-view-middleTime">
          {
            this.state.time
          }
        </div>

      </div>
    );
  }
}

export default IndexHeaderView;


