import React from 'react';

import { Layout, Card, Modal } from 'antd';

import IndexHeader from '../../component/IndexHeader';
import IndexContent from '../../component/IndexContent';
import IndexFooter from '../../component/IndexFooter';



import Fetch from '../../fetch';
import './index.scss';


export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    parent.document.title = '白云区矛盾纠纷多元化解平台数据实时动态';

  }

  render() {
    const { online, tableKey, rows, total, loading, person, barList } = this.state;
    return (
      // <div style={{
      //   background: 'url(' + img + ')', width: '100%', height: '100%', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'
      // }}>

      // </div>
      <React.Fragment>
        <div className="index-main">
          {/* <IndexHeader />
          <IndexContent />
          <IndexFooter /> */}
        </div>
      </React.Fragment>
    );
  }

}
