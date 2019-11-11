import React from 'react';

// import { Layout, Card, Modal } from 'antd';
import { Layout, Icon, Button, Input } from 'antd';
const { Sider } = Layout;
const { TextArea } = Input;
import TreeView from '../../component/TreeView';
import TableListView from '../../component/TableListView';
import EditableFormView from '../../component/EditableFormView';
import EditableConcatIdFormView from '../../component/EditableConcatIdFormView';


import Fetch from '../../fetch';
import './index.scss';


export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      selectedKeysList: [],  //所有选中表的id的集合数组
      currentSelectKey: '',

      tableDataList: [],  //表列表集合数组
      formDataSource: [{ key: Date.now() }],  //条件数组
      concatDataSource: [{ key: Date.now()}], //联合关系数组  
      treeData: [],

      leftorRightTableList: [],
      // rightTableList: []

    };
  }

  componentDidMount() {
    let _this = this;
    Fetch.getLogTableList().then(res => {
      console.log(res);
      _this.setState({
        treeData: [
          {
            businessName: '日志表列表',
            id: 'partant',
            childNodes: res.data
          }
        ]
      })
    })
  }

  setSelectedKeysList = (list) => {
    let { selectedKeysList } = this.state;
    this.setState({
      selectedKeysList: selectedKeysList.concat(list),
      currentSelectKey: list.id
    })
  }

  setData = (data) => {
    this.setState({
      ...data
    })
  }

  setTableDataList = list => {
    this.setState({
      tableDataList: list
    })
  }

  render() {
    const { selectedKeysList, treeData } = this.state;
    let obj = {
      "selectFields": [
        {
          "tableId": "1",
          "fields": [
            {
              "fieldName": "",
              "aggrFunc": ""
            },
            {
              "fieldName": "",
              "aggrFunc": ""
            }
          ]
        },
        {

        },
        {

        }
      ],
      "joinRelationship": [
        {
          "leftTableId": "1",
          "leftTableName": "t1",
          "leftJoinField": "no",
          "rightTableId": "2",
          "rightTableName": "t2",
          "rightJoinField": "no"
        }

      ],
      "whereCondition": [
        {
          "fieldName": "age",
          "desc": "年龄",
          "condition": {
            "judge": "3",
            "value": "18"
          },
          "sort": "1",
          "sortType": "",
          "group": "1"
        },
        {
          "fieldName": "sex",
          "desc": "性别",
          "condition": {

          },
          "sort": "",
          "sortType": "",
          "group": ""
        }
      ]

    }

    console.log('obj', obj);

    return (


      <React.Fragment>

        <Layout style={{ height: '100vh', overflow: 'scroll' }}>
          <Sider style={{ overflow: 'scroll' }}>
            <TreeView treeData={treeData} setSelectedKeysList={this.setSelectedKeysList} {...this.state} />
          </Sider>
          <Layout>
            <div className="index-content-flex">
              <div className="index-content-top" >
                <TableListView {...this.state} key={selectedKeysList.join(',')} setTableDataList={this.setTableDataList} setData={this.setData} />
              </div>

              <div className="index-content-middle">
                <EditableConcatIdFormView {...this.state} setData={this.setData} />
                <EditableFormView {...this.state} setData={this.setData} />
              </div>
              <div className="index-content-bottom">
                <Button onClick={()=>{ this.handleClick('renderSql')}} type="primary" size="small" style={{ margin: 10 }}>
                  生成语句
                </Button>
                <TextArea
                  // value={value}
                  // onChange={this.onChange}
                  // placeholder="Controlled autosize"
                  autosize={{ minRows: 3, maxRows: 5 }}
                />

              </div>


            </div>

          </Layout>

        </Layout>
      </React.Fragment >
    );
  }

}
