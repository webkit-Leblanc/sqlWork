import React from 'react';

// import { Layout, Card, Modal } from 'antd';
import { Layout, Icon, Button, Input, Row, Table, message, Tabs } from 'antd';
const { Sider } = Layout;
const { TextArea } = Input;
import TreeView from '../../component/TreeView';
import TableListView from '../../component/TableListView';
import EditableFormView from '../../component/EditableFormView';
import EditableConcatIdFormView from '../../component/EditableConcatIdFormView';
import SaveResultView from '../../component/SaveResultView';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/eclipse.css';

import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/sql-hint.js'


import Fetch from '../../fetch';
import './index.scss';
import ListBodyWrapper from 'antd/lib/transfer/renderListBody';
const { TabPane } = Tabs;


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
      dataSource: [],
      page: 1,

      fieldList: [],

      saveResultData: {
        // factTableName: '**_statistics_res_table'

      },
      saveLoading: false,
      columnsList: [],

      panes: [{ sql: '' }],
      activeKey: '0'


    };
  }

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `${panes.length}`;
    panes.push({ sql: '' });
    console.log('panes', panes);
    this.setState({ panes, activeKey });
  };

  remove = targetKey => {
    console.log('targetKey', targetKey);
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (`${i}` === targetKey) {
        lastIndex = i - 1;
      }
    });
    console.log('lastIndex', lastIndex);
    const panes = this.state.panes.filter((pane, idx) => `${idx}` !== targetKey);
    if (panes.length) {
      if (lastIndex >= 0) {
        activeKey = `${lastIndex}`;
      } else {
        activeKey = '0';
      }
    }
    this.setState({ panes, activeKey });
  };

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

  onSaveFun = () => {
    let { saveResultData, fieldList, panes, activeKey } = this.state;
    console.log('fieldList', fieldList);
    if (!saveResultData.factTableName) {
      return layer.msg('请填写统计结果表名');
    }
    if (!saveResultData.factTableDesc) {
      return layer.msg('请填写描述');
    }
    if (!saveResultData.chartType) {
      return layer.msg('请选择图表类型');
    }
    // if (Object.keys(fieldList[0]).length !== 6) {
    //   return layer.msg('表格数据不完整');
    // }
    // if (Object.keys(fieldList[1]).length !== 6) {
    //   return layer.msg('表格数据不完整');
    // }
    this.setState({
      saveLoading: true
    });

    Fetch.saveStatisticResult({
      sql: panes[activeKey].sql,
      ...saveResultData,
      fieldList: fieldList.map(({ fieldDesc, fieldName, fieldType1 }) => ({
        fieldDesc, fieldName,
        fieldType: fieldType1 ? 1 : 2
      }))
    }).then(res => {
      console.log('res', res);
      if (res.status == 200) {
        layer.msg(res.msg);
        this.setState({
          page: 1,
          saveLoading: false,
          fieldList: [],
          saveResultData: {
            // factTableName: '**_statistics_res_table'
          },
        })
      } else {
        layer.msg(res.msg + ',请稍候重试！');
        this.setState({
          saveLoading: false
        })
      }
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
    let { tableDataList, formDataSource, concatDataSource, selectedKeysList, panes, activeKey } = this.state;
    this.setState({ currentStatus: key }); //

    let selectFields = tableDataList.length && tableDataList.map(({ id, logSampleId, data }) => ({
      tableId: logSampleId,
      fields: data.filter(({ checked }) => (checked)).map(({ fieldName, aggrFunc }) => ({ fieldName, aggrFunc }))
    }));

    let joinRelationship = concatDataSource.length ? concatDataSource.map(({
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
    })) : [];

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
          layer.msg(res.msg);
          if (res.status == 200) {
            panes[activeKey].sql = res.data;
            this.setState({
              panes,
              renderLoading1: false
            })
          } else {
            panes[activeKey].sql = res.data;
            console.log('panes',panes);
            this.setState({
              panes,
              renderLoading1: false
            });
          }
        })
        return;
      case 'renderSearch':
        console.log('执行查询');
        this.setState({
          renderLoading2: true
        });
        if (!panes[activeKey].sql) {
          layer.msg('查询语句为空，无法查询！');
          this.setState({
            renderLoading2: false
          });
          return;
        } else {
          return Fetch.getDynamicSqlDataList({
            sql: panes[activeKey].sql
          }).then(res => {

            console.log('res', res);
            if (res.status == 200) {
              layer.msg(res.msg);
              this.setState({
                columns: res.data.columnNames.split(',').map((a) => ({
                  title: a,
                  dataIndex: a
                })),
                dataSource: res.data.data,
                renderLoading2: false,
                columnsList: res.data.columnNames.split(','),
                fieldList: res.data.columnNames.split(',').map((a, idx) => ({ id: idx, key: idx, fieldName: a }))
              })
            } else {
              layer.msg(res.msg);
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
        if (!panes[activeKey].sql) {
          layer.msg('查询语句为空，无法保存结果！');
          this.setState({
            renderLoading3: false
          });
          return;
        }
        else if (this.state.columnsList.length == 0) {
          layer.msg('未执行查询或者执行查询有误，无法保存结果！');
          this.setState({
            renderLoading3: false
          });
          return;
        }
        else {
          this.setState({
            renderLoading3: false,
            page: 2
          });
          // return window.sql = this.state.sqlWord;
          return;
        }
    }
  }

  render() {
    const { selectedKeysList, treeData, currentStatus, columns, dataSource, page, activeKey, panes } = this.state;

    return (
      <React.Fragment>
        {
          page == 1 ?
            <React.Fragment>
              <Layout style={{ height: '100%', overflowY: 'auto', overflowX: 'auto' }}>
                <Sider style={{ overflowY: 'auto', overflowX: 'auto' }}>
                  <TreeView treeData={treeData} setSelectedKeysList={this.setSelectedKeysList} {...this.state} />
                </Sider>
                <Layout style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: 10 }}>
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
                      <CodeMirror
                        ref="editorsql"
                        value={this.state.sqlWord}
                        options={{
                          // theme: 'monokai',
                          theme: 'eclipse',
                          tabSize: 2,
                          lineNumbers: true,
                          keyMap: 'sublime',
                          mode: 'text/x-sql',
                          lineNumbers: true,                     //显示行号
                          extraKeys: { "Ctrl": "autocomplete" },   //自动提示配置
                        }}
                        onChange={(editor) => {
                          console.log(editor.getValue());
                          this.setState({
                            sqlWord: editor.getValue()
                          })
                        }}
                      />

                      <Tabs
                        onChange={this.onChange}
                        activeKey={this.state.activeKey}
                        type="editable-card"
                        onEdit={this.onEdit}
                      >
                        {panes.map((pane, idx) => (
                          <TabPane tab={'Editor' + `${idx + 1}`} key={`${idx}`} closable={true}>
                            <TextArea
                              value={pane.sql}
                              // onChange={this.onChange}
                              // placeholder="Controlled autosize"
                              autosize={{ minRows: 3, maxRows: 5 }}
                              onChange={(e) => {
                                let { panes, activeKey } = this.state;
                                panes[activeKey].sql = e.target.value
                                this.setState({
                                  panes
                                });
                                // this.setState({
                                //   sqlWord: e.target.value
                                // })
                              }}
                            />
                          </TabPane>
                        ))}
                      </Tabs>


                      {
                        currentStatus == 'renderSearch' && columns.length > 0 &&
                        <div style={{ padding: 10, marginTop: 10, background: '#fff' }}>
                          <div style={{ paddingBottom: 10, color: '#000' }}>
                            统计结果：
                      </div>
                          {
                            columns.length > 0 &&
                            <Table columns={columns} dataSource={dataSource} size="small" scroll={{ x: true }} />
                          }
                        </div>
                      }

                    </div>

                  </div>

                </Layout>

              </Layout>
            </React.Fragment >
            :
            <SaveResultView {...this.state} setData={this.setData} onSaveFun={this.onSaveFun}>
            </SaveResultView>
        }
      </React.Fragment>

    );
  }

}
