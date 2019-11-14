import React from 'react';
import { Tree, Icon, message, Card, Form, Input, Select, Table, Checkbox } from 'antd';
const { Option } = Select;
import Fetch from '../../fetch';

import './index.scss';

class TreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    Fetch.getEchartsList().then( res => {
      console.log('res', res);
    })
  }

  handleOnchange(key, value) {
  
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
    };
    const columns = [
      {
        title: '字段名',
        dataIndex: 'fieldName',
        render: (cur, item) =>(
          <Input />
        )
      },
      {
        title: '维度',
        dataIndex: 'fieldType1',
        render: (cur, item) =>(
          <Checkbox></Checkbox>
        )
      },
      {
        title: '指标',
        dataIndex: 'fieldType2',
        render: (cur, item) =>(
          <Checkbox></Checkbox>
        )
      }
    ];
    let { fieldList } = this.props;

    return (

      <div className="save-result-view">
        <Card bordered={false}>

          <div style={{ cursor: 'pointer', paddingBottom: 10 }}>
            返回
          </div>
          <div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>

              <Form.Item label="统计结果表名">
                <Input onChange={(e)=>{this.handleOnchange('factTableName', e.target.value)}}/>
              </Form.Item>
              <Form.Item label="描述">
                <Input onChange={(e)=>{this.handleOnchange('factTableDesc', e.target.value)}}/>
              </Form.Item>
              <Form.Item label="图表类型">
                <Select onChange={(v)=>{this.handleOnchange('chartType', v)}}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </Form.Item>
              <Form.Item label="业务名">
                <Input onChange={(e)=>{this.handleOnchange('factTableName', e.target.value)}}/>
              </Form.Item>
              <Form.Item label="子业务名">
                <Input onChange={(e)=>{this.handleOnchange('factTableName', e.target.value)}}/>
              </Form.Item>

              {/* <Table columns={columns} size="small" dataSource={fieldList} className="save-result-table" pagination={false}/> */}

            </Form>

          </div>
        </Card>

      </div>
    );
  }
}

export default TreeView;


