import React from 'react';
import { Tree, Icon, message } from 'antd';
const { TreeNode } = Tree;

import Fetch from '../../fetch';

import './index.scss';

class TreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  onSelect = (selectedKeys, { selected: bool, selectedNodes, node, event }) => {
    let { selectedKeysList } = this.props;
    console.log('selected', selectedKeys, bool, selectedNodes, node);
    if (bool) {
      if (node.props.children) {
        layer.msg('请选择到子节点处');
      } else {
        if (selectedKeysList.map(({ id }) => (id)).includes(selectedKeys.join())) {
          return layer.msg('当前节点已经添加，请勿重新添加！')
        } else {
          layer.msg('添加成功');
          this.props.setSelectedKeysList({ id: selectedKeys.join(), name: selectedNodes[0].props.title, logSampleId: selectedNodes[0].props.logSampleId });
        }
      }
    }
  };

  renderTreeNodes = data => data.map((item) => {
    if (item.childNodes) {
      return (
        <TreeNode title={item.businessName} key={item.id} dataRef={item} >
          {this.renderTreeNodes(item.childNodes)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.businessName} key={item.id} {...item} dataRef={item} />;
  })

  render() {
    const { selectedKeysList } = this.props;

    return (
      <div className="tree-view" key={JSON.stringify(this.props.treeData)}>
        <Tree onSelect={this.onSelect} showLine defaultExpandAll >
          {this.renderTreeNodes(this.props.treeData)}
        </Tree>
      </div>
    );
  }
}

export default TreeView;


