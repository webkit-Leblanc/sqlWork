import React from 'react';
import { Tree, Icon, message, Card, Form, Input, Select, Table, Checkbox, Button, Row, Col } from 'antd';
const { Option } = Select;
import Fetch from '../../fetch';

import './index.scss';

class TreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartTypeList: []
    };
  }

  componentDidMount() {
    let { selectedKeysList, saveResultData } = this.props;
    Fetch.getEchartsList().then(res => {
      if (res.status == 200) {
        this.setState({
          chartTypeList: res.data
        })
      }
    });
    Fetch.getBussinessNameByLogSampleId({
      logSampleId: selectedKeysList[0].logSampleId
    }).then(res => {
      console.log('res', res);
      if (res.status == 200) {
        this.props.setData({
          saveResultData: {
            ...saveResultData,
            ...res.data
          }
        })
      }
    })
  }

  handleOnchange = (index, key, val) => {
    console.log('索引:', index, 'key:', key, 'val:', val);
    let { fieldList } = this.props;
    if (key == 'fieldType1' && val) {
      fieldList = fieldList.map(({ fieldType1, fieldType2, ...a }, idx) => {
        if (idx == index) {
          return {
            fieldType2: false,
            fieldType1: true
          }
        } else {
          return {
            fieldType2,
            fieldType1: false
          }
        }
      })
      // fieldList[index].fieldType2 = false;
    }
    if (key == 'fieldType2' && val) {
      // fieldList[index].fieldType1 = false;
      fieldList = fieldList.map(({ fieldType1, fieldType2, ...a }, idx) => {
        if (idx == index) {
          return {
            fieldType2: true,
            fieldType1: false
          }
        } else {
          return {
            fieldType2: false,
            fieldType1
          }
        }
      })
    }

    fieldList[index] = {
      ...fieldList[index],
      [key]: val
    }
    console.log('fieldList', fieldList);
    this.props.setData({
      fieldList
    })
  }

  handleOnFormchange = (key, val) => {
    let { saveResultData } = this.props;
    this.props.setData({
      saveResultData: {
        ...saveResultData,
        [key]: val
      }
    })
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
        render: (cur, item, index) => (
          <Input placeholder="请输入字段名" onChange={(e) => {
            this.handleOnchange(index, 'fieldName', e.target.value)
          }} value={this.props.fieldList[index].fieldName} disabled />
          // <Select placeholder="请选择" size="small" onChange={(v) => {
          //   this.handleOnchange(index, 'fieldName', v);
          // }} value={this.props.fieldList[index].fieldName}>
          //   {
          //     this.props.selectedKeysList.find(({ logSampleId }) => (logSampleId == this.props.selectedKeysList[0].logSampleId)).fieldList.map(({ fieldName }, index) => (
          //       <Option value={fieldName} key={index}>{fieldName}</Option>
          //     ))
          //   }
          // </Select>
        )
      },
      {
        title: '描述',
        dataIndex: 'fieldDesc',
        render: (cur, item, index) => (
          <Input placeholder="请输入描述" onChange={(e) => {
            this.handleOnchange(index, 'fieldDesc', e.target.value)
          }} value={this.props.fieldList[index].fieldDesc} />
        )
      },
      {
        title: '维度',
        dataIndex: 'fieldType1',
        className: 'text-center',
        render: (cur, item, index) => (
          <Checkbox onChange={(e) => {
            this.handleOnchange(index, 'fieldType1', e.target.checked);
          }} checked={this.props.fieldList[index].fieldType1}></Checkbox>
        )
      },
      {
        title: '指标',
        dataIndex: 'fieldType2',
        className: 'text-center',
        render: (cur, item, index) => (
          <Checkbox onChange={(e) => {
            this.handleOnchange(index, 'fieldType2', e.target.checked);
          }} checked={this.props.fieldList[index].fieldType2}></Checkbox>
        )
      }
    ];
    let { fieldList, saveResultData } = this.props;
    let { chartTypeList } = this.state;

    return (

      <div className="save-result-view">
        <Card bordered={false}>

          {/* <div style={{ paddingBottom: 10, }}>
            <span style={{
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer'
            }} onClick={() => {
              this.props.setData({
                page: 1
              })
            }}>
              返回
            </span>
          </div> */}
          <div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>

              <Form.Item label={<React.Fragment>统计结果表名<span style={{ color: 'red' }}>&nbsp;*</span></React.Fragment>}>
                <Input onChange={(e) => { this.handleOnFormchange('factTableName', e.target.value) }} value={saveResultData.factTableName || ''} placeholder="**_statistics_res_table" />
              </Form.Item>
              <Form.Item label={<React.Fragment>描述<span style={{ color: 'red' }}>&nbsp;*</span></React.Fragment>}>
                <Input onChange={(e) => { this.handleOnFormchange('factTableDesc', e.target.value) }} value={saveResultData.factTableDesc || ''} placeholder="请输入" />
              </Form.Item>
              <Form.Item label={<React.Fragment>图表类型<span style={{ color: 'red' }}>&nbsp;*</span></React.Fragment>}>
                <Select onChange={(v) => { this.handleOnFormchange('chartType', v) }} placeholder="请选择">
                  {
                    chartTypeList.map((item) => (
                      <Option value={item.chartType} key={item.chartId}>{item.chartDesc}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="业务名">
                <Input onChange={(e) => { this.handleOnchange('systemName', e.target.value) }} disabled value={saveResultData.systemName || ''} />
              </Form.Item>
              <Form.Item label="子业务名">
                <Input onChange={(e) => { this.handleOnchange('businessName', e.target.value) }} disabled value={saveResultData.businessName} />
              </Form.Item>

              <Table columns={columns} size="small" dataSource={fieldList} className="save-result-table" pagination={false} bordered />

              <Row style={{ marginTop: 10 }} type="flex" gutter={20}>
                <Col>
                  <Button type="primary" onClick={this.props.onSaveFun} loading={this.props.saveLoading}>保存</Button>
                </Col>
                <Col>
                  <Button onClick={() => {
                    this.props.setData({
                      page: 1
                    })
                  }}>返回</Button>
                </Col>

              </Row>
            </Form>

          </div>
        </Card>

      </div>
    );
  }
}

export default TreeView;


