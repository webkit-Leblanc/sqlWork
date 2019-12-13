import React from 'react';

import { Table, Input, Button, Popconfirm, Form, Checkbox, Select } from 'antd';
const { Option } = Select;

import './index.scss';


class EditableConcatIdFormView extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '左表名',
        dataIndex: 'leftTableId',
        render: (cur, item, index) => (
          <div>
            <Select style={{ width: 160 }} placeholder="请选择" size="small" onChange={(v) => {
              this.handleOnchange(index, 'leftTableId', v);
            }} value={this.props.concatDataSource[index].leftTableId}>
              {
                this.props.selectedKeysList.map(({ id, name, logSampleId }) => (
                  <Option value={logSampleId} key={id}>{name}</Option>
                ))
              }
            </Select>
          </div>
        )
      },
      {
        title: '左字段名',
        dataIndex: 'leftJoinField',
        render: (cur, item, index) => (
          this.props.concatDataSource[index].leftTableId && this.props.selectedKeysList.length ?
            <Select style={{ width: 160 }} placeholder="请选择" size="small" onChange={(v) => {
              this.handleOnchange(index, 'leftJoinField', v);
            }} value={this.props.concatDataSource[index].leftJoinField}>
              {
                this.props.selectedKeysList.find(({ logSampleId }) => (logSampleId == this.props.concatDataSource[index].leftTableId)).fieldList.map(({ fieldName }, index) => (
                  <Option value={fieldName} key={index}>{fieldName}</Option>
                ))
              }
            </Select>
            :
            <Input onChange={(e) => { this.handleOnchange(index, 'leftJoinField', e.target.value) }} placeholder="请输入"/>
        )
      },
      {
        title: '右表名',
        dataIndex: 'rightTableId',
        render: (cur, item, index) => (
          <div>
            <Select style={{ width: 160 }} placeholder="请选择" size="small" onChange={(v) => {
              this.handleOnchange(index, 'rightTableId', v);
            }}  value={this.props.concatDataSource[index].rightTableId}>
              {
                this.props.selectedKeysList.map(({ id, name, logSampleId }) => (
                  <Option value={logSampleId} key={id}>{name}</Option>
                ))
              }
            </Select>
          </div>
        )
      },
      {
        title: '右字段名',
        dataIndex: 'rightJoinField',
        render: (cur, item, index) => {
          return (
            // <Input onChange={(e) => { this.handleOnchange(index, 'rightJoinField', e.target.value) }} />
            this.props.concatDataSource[index].rightTableId  && this.props.selectedKeysList.length?
              <Select style={{ width: 160 }} placeholder="请选择" size="small" onChange={(v) => {
                this.handleOnchange(index, 'rightJoinField', v);
              }} value={this.props.concatDataSource[index].rightJoinField}>
                {
                  this.props.selectedKeysList.find(({ logSampleId }) => (logSampleId == this.props.concatDataSource[index].rightTableId)).fieldList.map(({ fieldName }, index) => (
                    <Option value={fieldName} key={index}>{fieldName}</Option>
                  ))
                }
              </Select>
              :
              <Input onChange={(e) => { this.handleOnchange(index, 'rightJoinField', e.target.value) }} placeholder="请输入"/>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.props.concatDataSource.length >= 1 ? (
            // <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
            <div style={{ textAlign: 'center', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { this.handleDelete(record.key) }}>
              <a>删除</a>
            </div>
            // </Popconfirm>
          ) : null,
      },

    ];

    this.state = {
      count: 2,
    };
  }

  handleOnchange = (index, key, val) => {
    console.log('索引:', index, 'key:', key, 'val:', val);
    let { concatDataSource } = this.props;
    concatDataSource[index] = {
      ...concatDataSource[index],
      [key]: val
    }
    console.log('concatDataSource', concatDataSource);
    this.props.setData({
      concatDataSource
    })
  }

  handleDelete = key => {
    let { concatDataSource } = this.props;
    this.props.setData({ concatDataSource: concatDataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    let { concatDataSource } = this.props;
    const newData = {
      key: Date.now()
    };
    this.props.setData({
      concatDataSource: [...concatDataSource, newData]
    })
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { concatDataSource } = this.props;

    return (
      <div style={{ background: '#fff', borderBottom: '10px solid #f0f2f5' }} className="edit-table-form">
        <Button onClick={this.handleAdd} type="primary" icon="plus" size="small" style={{ margin: 10 }}>
          添加联合关系
        </Button>
        <Table
          // components={components}
          bordered
          dataSource={concatDataSource}
          columns={this.columns}
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}
export default EditableConcatIdFormView;
