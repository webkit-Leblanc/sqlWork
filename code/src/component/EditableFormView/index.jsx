import React from 'react';

import { Table, Input, Button, Popconfirm, Form, Checkbox, Select } from 'antd';
const { Option } = Select;

import './index.scss';


class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '',
        dataIndex: 'checked',
        render: (cur, item, index) => (
          <div style={{ padding: '0 5px' }}>
            <Checkbox onChange={(e) => {
              this.handleOnchange(index, 'checked', e.target.checked);
            }}></Checkbox>
          </div>
        )
      },
      {
        title: '表名',
        dataIndex: 'sourceTableId',
        render: (cur, item, index) => (
          // <Input onChange={(e) => { this.handleOnchange(index, 'fieldName', e.target.value) }} placeholder="请输入"/>
          <div>
            <Select style={{ width: 160 }} placeholder="请选择" size="small" onChange={(v) => {
              this.handleOnchange(index, 'sourceTableId', v);
            }} value={this.props.formDataSource[index].sourceTableId}>
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
        title: '字段名',
        dataIndex: 'fieldName',
        render: (cur, item, index) => (
          this.props.formDataSource[index].sourceTableId && this.props.selectedKeysList.length ?
          <Select style={{ width: 160 }} placeholder="请选择" size="small" onChange={(v) => {
            this.handleOnchange(index, 'fieldName', v);
          }} value={this.props.formDataSource[index].fieldName}>
            {
              this.props.selectedKeysList.find(({ logSampleId }) => (logSampleId == this.props.formDataSource[index].sourceTableId)).fieldList.map(({ fieldName }, index) => (
                <Option value={fieldName} key={index}>{fieldName}</Option>
              ))
            }
          </Select>
          :
          <Input onChange={(e) => { this.handleOnchange(index, 'fieldName', e.target.value) }} placeholder="请输入"/>
        )
      },
      {
        title: '注释',
        dataIndex: 'desc',
        render: (cur, item, index) => (
          <Input onChange={(e) => { this.handleOnchange(index, 'desc', e.target.value) }} placeholder="请输入"/>
        )
      },
      {
        title: '条件',
        dataIndex: 'condition',
        render: (cur, item, index) => {
          const selectBefore = (
            <Select style={{ width: 118 }} placeholder="请选择" size="small" onChange={(v) => {
              this.handleOnchange(index, 'judge', v);
            }}>
              {/* <Option value="无">无</Option> */}
              <Option value="1">{'<'}</Option>
              <Option value="2">=</Option>
              <Option value="3">></Option>
              <Option value="4">{'<='}</Option>

            </Select>
          );
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {selectBefore}
              <Input onChange={(e) => {
                this.handleOnchange(index, 'value', e.target.value);
              }} placeholder="请输入"/>
            </div>
          )
        }
      },
      {
        title: '排序',
        dataIndex: 'sort',
        type: 'select',
        render: (cur, item, index) => (
          <Select style={{ maxWidth: 90, minWidth: 40, width: 85 }} placeholder="请选择" size="small" onChange={(v) => {
            this.handleOnchange(index, 'sort', v);
          }}>
            <Option value="0">是</Option>
            <Option value="1">否</Option>
          </Select>
        )
      },
      {
        title: '排序类型',
        dataIndex: 'sortType',
        type: 'select',
        render: (cur, item, index) => (
          <Select style={{ maxWidth: 90, minWidth: 40, width: 85 }} placeholder="请选择" size="small" onChange={(v) => {
            this.handleOnchange(index, 'sortType', v);
          }}>
            <Option value="0">从小到大</Option>
            <Option value="1">从大到小</Option>
          </Select>
        )
      },
      {
        title: '分组',
        dataIndex: '分组',
        type: 'select',
        render: (cur, item, index) => (
          <Select style={{ maxWidth: 90, minWidth: 40, width: 85 }} placeholder="请选择" size="small" onChange={(v) => {
            this.handleOnchange(index, 'group', v);
          }}>
            <Option value="0">是</Option>
            <Option value="1">否</Option>
          </Select>
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.props.formDataSource.length >= 1 ? (
            // <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
            <div style={{ textAlign: 'center' }} onClick={() => { this.handleDelete(record.key) }}>
              <a style={{ color: '#95393c'}}>删除</a>
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
    let { formDataSource } = this.props;
    formDataSource[index] = {
      ...formDataSource[index],
      [key]: val
    }
    console.log('formDataSource', formDataSource);
    this.props.setData({
      formDataSource
    })
  }

  handleDelete = key => {
    let { formDataSource } = this.props;
    this.props.setData({ formDataSource: formDataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    let { formDataSource } = this.props;
    const newData = {
      key: Date.now()
    };
    this.props.setData({
      formDataSource: [...formDataSource, newData]
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
    const { formDataSource } = this.props;

    return (
      <div style={{ background: '#fff' }} className="edit-table-form">
        <Button onClick={this.handleAdd} type="primary" icon="plus" size="small" style={{ margin: 10 }}>
          添加条件
        </Button>
        <Table
          // components={components}
          bordered
          dataSource={formDataSource}
          columns={this.columns}
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}
export default EditableTable;
