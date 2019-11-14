import React from 'react';

// import { Layout, Card, Modal } from 'antd';
import { Layout, Icon, Button, Input, Row, Table } from 'antd';
const { Sider } = Layout;
const { TextArea } = Input;
import TreeView from '../../component/TreeView';
import TableListView from '../../component/TableListView';
import EditableFormView from '../../component/EditableFormView';
import EditableConcatIdFormView from '../../component/EditableConcatIdFormView';
import SaveResultView from '../../component/SaveResultView';


import Fetch from '../../fetch';
import './index.scss';
import ListBodyWrapper from 'antd/lib/transfer/renderListBody';


export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      selectedKeysList: [],  //所有选中表的id的集合数组
      currentSelectKey: '',

      tableDataList: [],  //表列表集合数组
      // formDataSource: [{ key: Date.now() }],  //条件数组
      // concatDataSource: [{ key: Date.now() }], //联合关系数组  
      formDataSource: [],  //条件数组
      concatDataSource: [], //联合关系数组  
      treeData: [],

      renderLoading1: false,
      renderLoading2: false,
      renderLoading3: false,

      currentStatus: '',
      sqlWord: '',

      columns: [],
      page: 1,

      fieldList: [{
        id: 1,
        key: 1
      },{
        id: 2,
        key: 2
      }],

      SaveResultData: {

      }

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

  handleClick = (key) => {
    let { tableDataList, formDataSource, concatDataSource, selectedKeysList } = this.state;
    this.setState({ currentStatus: key }); //

    let selectFields = tableDataList.length && tableDataList.map(({ id, logSampleId, data }) => ({
      tableId: logSampleId,
      fields: data.filter(({ checked }) => (checked)).map(({ fieldName, aggrFunc }) => ({ fieldName, aggrFunc }))
    }));

    let joinRelationship = concatDataSource.length && concatDataSource.map(({
      leftJoinField,
      leftTableId,
      rightJoinField,
      rightTableId
    }) => ({
      leftJoinField,
      leftTableId,
      rightJoinField,
      rightTableId,
      leftTableName: selectedKeysList.find(({ id }) => (id == leftTableId)) && selectedKeysList.find(({ id }) => (id == leftTableId)).name,
      rightTableName: selectedKeysList.find(({ id }) => (id == leftTableId)) && selectedKeysList.find(({ id }) => (id == leftTableId)).name,
    }));

    let whereCondition = formDataSource.filter(({ checked }) => (checked)).map(({ fieldName, desc, judge, value, sort, sortType, group, sourceTableId }) => ({
      fieldName, desc, sort, sortType, group, sourceTableId,
      condition: {
        judge, value: judge == 0 ? '' : value,
      }
    }));
    console.log(joinRelationship, whereCondition, selectFields);

    switch (key) {
      case 'renderSql':
        console.log('renderSql');
        this.setState({
          renderLoading1: true
        })
        Fetch.getDynamicSql({
          joinRelationship: JSON.stringify(joinRelationship) == '[{}]' ? [] : joinRelationship, whereCondition, selectFields
        }).then(res => {
          console.log('res', res);
          this.setState({
            sqlWord: res.data,
            renderLoading1: false
          })
        })
        return;
      case 'renderSearch':
        console.log('执行查询');
        this.setState({
          renderLoading2: true
        });
        if (!this.state.sqlWord) {
          layer.msg('查询语句为空，无法查询！');
          this.setState({
            renderLoading2: false
          });
          return;
        } else {
          return Fetch.getDynamicSqlDataList({
            sql: this.state.sqlWord
          }).then(res => {

            console.log('res', res);
            if (res.status == 200) {
              layer.msg('执行查询成功！');
              this.setState({
                columns: res.data.columnNames.split(',').map((a) => ({
                  title: a,
                  dataIndex: a
                })),
                dataSource: res.data.data,
                renderLoading2: false
              })
            } else {
              layer.msg('执行查询出错，请稍后重试！')
              this.setState({
                renderLoading2: false
              });
            }
          })

        }
      case 'renderResult':
        // this.setState({
        //   renderLoading3: true
        // })
        console.log('保存结果');
        // if (!this.state.sqlWord) {
        //   layer.msg('查询语句为空，无法保存结果！');
        //   this.setState({
        //     renderLoading3: false
        //   });
        //   return;
        // } else {
        //   this.setState({
        //     renderLoading3: false,
        //     page: 2
        //   });
        //   return window.sql = this.state.sqlWord;
        // }
    }
  }

  render() {
    const { selectedKeysList, treeData, currentStatus, columns, dataSource, page } = this.state;

    return (
      <React.Fragment>
        {
          page == 1 ?
            <React.Fragment>
              <Layout style={{ height: '100%', overflow: 'scroll' }}>
                <Sider style={{ overflow: 'scroll' }}>
                  <TreeView treeData={treeData} setSelectedKeysList={this.setSelectedKeysList} {...this.state} />
                </Sider>
                <Layout style={{ height: '100%', overflow: 'scroll', padding: 10 }}>
                  <div className="index-content-flex">
                    <div className="index-content-top" >
                      <TableListView {...this.state} key={selectedKeysList.join(',')} setTableDataList={this.setTableDataList} setData={this.setData} />
                    </div>

                    <div className="index-content-middle">
                      <EditableConcatIdFormView {...this.state} setData={this.setData} />
                      <EditableFormView {...this.state} setData={this.setData} />
                    </div>
                    <div className="index-content-bottom">
                      <Row>
                        <Button onClick={() => { this.handleClick('renderSql') }} type="primary" size="small" style={{ margin: 10 }} loading={this.state.renderLoading1}>
                          生成语句
                    </Button>
                        <Button onClick={() => { this.handleClick('renderSearch') }} type="primary" size="small" style={{ margin: 10 }} loading={this.state.renderLoading2}>
                          执行查询
                    </Button>
                        <Button onClick={() => { this.handleClick('renderResult') }} type="primary" size="small" style={{ margin: 10 }} loading={this.state.renderLoading3}>
                          保存统计结果
                    </Button>
                      </Row>
                      <TextArea
                        value={this.state.sqlWord}
                        // onChange={this.onChange}
                        // placeholder="Controlled autosize"
                        autosize={{ minRows: 3, maxRows: 5 }}
                        onChange={(e) => {
                          this.setState({
                            sqlWord: e.target.value
                          })
                        }}
                      />
                      {
                        currentStatus == 'renderSearch' &&
                        <div style={{ padding: 10, marginTop: 10, background: '#fff' }}>
                          <div style={{ paddingBottom: 10, color: '#000' }}>
                            统计结果：
                      </div>
                          {
                            columns.length > 0 &&
                            <Table columns={columns} dataSource={dataSource} size="small" />

                          }
                        </div>
                      }

                    </div>

                  </div>

                </Layout>

              </Layout>
            </React.Fragment >
            :
            <SaveResultView {...this.state}  setData={this.setData} > 
            </SaveResultView>
        }
      </React.Fragment>

    );
  }

}
