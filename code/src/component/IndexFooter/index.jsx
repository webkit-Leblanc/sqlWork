import React from 'react';
import { Row, Col } from 'antd';
import Fetch from '../../fetch';
import BrokenLineView from '../BrokenLineView';

import './index.scss';

class IndexFooterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }


  render() {

    return (
      <div className="index-footer-view">
        <div className="index-footer-view-content">
          <BrokenLineView />
        </div>
      </div>
    );
  }
}

export default IndexFooterView;


