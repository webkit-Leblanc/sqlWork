import React from 'react';
import { List, Card, Table, Checkbox, Icon, Tooltip, Select, Button, Modal } from 'antd';
const { Option } = Select;

import Fetch from '../../fetch';

import './index.scss';

class TableListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    console.log(this.props.selectedKeysList, this.props.currentSelectKey, this.props.tableDataList);
    let { tableDataList } = this.props;
    // 找出当前新增的表所在的索引值
    var index = this.props.selectedKeysList.findIndex(({ id }) => (id == this.props.currentSelectKey));
    console.log('index', index);
    if (index !== -1) {

      // this.props.selectedKeysList

      // 此处请求接口，获取表字段
      Fetch.getLogTableFields({
        id: this.props.selectedKeysList[index].id,
        logSampleId: this.props.selectedKeysList[index].logSampleId
      }).then(res => {
        console.log('res', res);
        let fieldList = res.data.fieldList.map((a) => ({
          ...a,
          currentIndex: index
        }));

        tableDataList[index] = {
          name: this.props.selectedKeysList[index].name,
          logSampleId: this.props.selectedKeysList[index].logSampleId,
          id: this.props.currentSelectKey,
          key: this.props.currentSelectKey,
          data: fieldList
        };
        let selectedKeysList = this.props.selectedKeysList.map(({ id, ...a }) => (
          id == this.props.currentSelectKey ? { id, ...a, fieldList } : { id, ...a }
        ));
        console.log('new selectedKeysList', selectedKeysList)
        this.props.setData({
          selectedKeysList
        })
        // this.props.setData({
        //   leftorRightTableList: this.props.selectedKeysList
        // })
        this.props.setTableDataList(tableDataList);
      })

    }

  }

  onDel = (_id) => {
    let { tableDataList, selectedKeysList, concatDataSource } = this.props;

    console.log(tableDataList, selectedKeysList, _id);
    this.props.setData({
      tableDataList: tableDataList.filter(({ id }) => id !== _id),
      selectedKeysList: selectedKeysList.filter(({ id }) => id !== _id),
      concatDataSource: concatDataSource.map(({ leftTableId, rightTableId, leftTableName, rightTableName, ...a }) => (leftTableId == _id || rightTableId == _id ? { leftTableId: '', leftTableName: '', rightTableId: '', rightTableName: '', ...a } : { leftTableId, rightTableId, leftTableName, rightTableName, ...a }))
    });
  }

  handleOnchange = (index, _idx, key, val) => {
    console.log('索引:', index, 'key:', key, 'val:', val);
    let { tableDataList } = this.props;
    tableDataList[index].data[_idx] = {
      ...tableDataList[index].data[_idx],
      [key]: val
    }
    // tableDataList[index] = {
    //   ...tableDataList[index],
    // }
    console.log('tableDataList', tableDataList);
    this.props.setData({
      tableDataList
    })
  }



  render() {
    let { tableDataList } = this.props;

    const columns = [
      {
        title: '',
        dataIndex: 'checkkeyone',
        render: (cur, item, index) => (
          <Checkbox onChange={(e) => {
            this.handleOnchange(item.currentIndex, index, 'checked', e.target.checked)
          }}></Checkbox>
        )
      },
      {
        title: '字段名',
        dataIndex: 'fieldName',
      },
      {
        title: '注释',
        dataIndex: 'fieldAnnotation',
        render: (text) => (
          <div style={{ maxWidth: '3vw' }}>
            <Tooltip placement="top" title={text} arrowPointAtCenter>
              <div className="ellipsis">{text}</div>
            </Tooltip>
          </div>
        )
      },
      {
        title: '聚合函数',
        dataIndex: 'aggrFunc',
        render: (cur, item, index) => (
          <Select style={{ maxWidth: 90, minWidth: 40, width: 85 }} placeholder="请选择" size="small" onChange={(v) => {
            this.handleOnchange(item.currentIndex, index, 'aggrFunc', v);
          }}>
            <Option value="sum">sum</Option>
            <Option value="count">count</Option>
            <Option value="avg">avg</Option>
          </Select>
        )
      },
      // {
      //   title: '联合id',
      //   dataIndex: 'linkId',
      //   render: (cur, item, index) => (
      //     <Checkbox onChange={(e) => {
      //       this.handleOnchange(item.currentIndex, index, 'linkId', e.target.checked)
      //     }}></Checkbox>
      //   )
      // }
    ];

    const columnsMoal = [];

    return (
      <div className="table-list-view">
        <List
          grid={{
            gutter: 16,
            // xs: 1,
            // sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4,
          }}
          dataSource={tableDataList}
          renderItem={(item, idx) => (
            <List.Item key={idx}>
              <div>
                {
                  item &&
                  // <Card size="small" title={item.name} extra={<React.Fragment><Button size="small" onClick={() => { this.setState({ visible: true }) }}>配置联合id</Button><span style={{ color: 'rgb(149, 57, 60)', cursor: 'pointer', marginLeft: 5 }} onClick={() => { this.onDel(item.id) }}>删除</span></React.Fragment>}>
                  <Card size="small" style={{ minWidth: 323 }} title={<React.Fragment>{item.name}<br /><span style={{ fontSize: 12}}>表名：log_detail_table_{item.logSampleId}</span></React.Fragment>} extra={<React.Fragment><a style={{ cursor: 'pointer', marginLeft: 5 }} onClick={() => { this.onDel(item.id) }}>删除</a></React.Fragment>}>
                    <div >
                      {/* <Icon type="close" style={{ position: 'absolute', right: 0, top: 10, cursor: 'pointer' }} onClick={() => {
                        this.onDel(item.id)
                      }} /> */}
                      <Table columns={columns} dataSource={item.data} size="small" pagination={false} style={{ background: '#fff' }} />
                    </div>
                  </Card>
                }
              </div>
            </List.Item>
          )}
        />

      </div>
    );
  }
}

export default TableListView;


