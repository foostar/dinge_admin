import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Form, Input, Button, Modal, Checkbox } from 'antd'
import * as UserListActions from '../../reducers/user/userlist'
import ModalDetail from '../../components/modaldetail'

const FormItem = Form.Item
const confirm = Modal.confirm
const columns = [ {
    key: 0,
    title: '用户id：',
    dataIndex: '_id'
}, {
    key: 1,
    title: '签名：',
    dataIndex: 'sign'
}, {
    key: 2,
    title: '性别：',
    dataIndex: 'sex'
}, {
    key: 3,
    title: '城市：',
    dataIndex: 'city'
}, {
    key: 4,
    title: '生日：',
    dataIndex: 'birthday'
}, {
    key: 5,
    title: '用户名：',
    dataIndex: 'nickname'
}, {
    key: 6,
    title: '头像：',
    dataIndex: 'avatar',
    isImg: true
}, {
    key: 7,
    title: '关注的人：',
    dataIndex: 'lovedTo'
}, {
    key: 8,
    title: '粉丝：',
    dataIndex: 'lovedFrom'
}, {
    key: 9,
    title: '注册时间：',
    dataIndex: 'createdAt'
}, {
    key: 10,
    title: '用户是否封号：',
    dataIndex: 'valid',
    isBooleans: true
} ]
class UserList extends React.Component {
    componentDidMount() {
        this.fetchData()
    }
    fetchData(page) {
        page = page || 1
        const { isFetching } = this.props.userlist
        if (isFetching) return
        const fromData = this.props.form.getFieldsValue()
        const data = this.getFormData(fromData, page)
        this.props.getUserList(data)
    }
    getFormData(fromData, page) {
        page = page || this.props.userlist.page
        const data = {
            page
        }
        if (fromData.id) {
            data._id = fromData.id
        }
        if (fromData.name) {
            data.nickname = fromData.name
        }
        if (fromData.valid) {
            data.valid = 3
        }
        return data
    }
    rowSelection = {
        onSelect: (record, selected, selectedRows) => {
            const rowsKey = selectedRows.map((v) => {
                return v.key
            })
            this.props.changeSelectRows(rowsKey)
        },
        onSelectAll: (selected, selectedRows) => {
            const rowsKey = selectedRows.map((v) => {
                return v.key
            })
            this.props.changeSelectRows(rowsKey)
        }
    }
    handleSubmit(e) {
        e.preventDefault()
        this.fetchData()
    }
    pageChange(page) {
        this.fetchData(page)
    }
    tableActionhandler(type) {
        const { selectKeys } = this.props.userlist
        if (type == 'delete') {
            return this.deleteConfirm(selectKeys)
        }
    }
    shieldConfirm(id, valid) {
        const { isFetching } = this.props.userlist
        const self = this
        if (isFetching) return
        confirm({
            title: valid == 2 ? '你确定要解封这个用户吗?' : '你确定要封这个用户吗?',
            onOk() {
                self.props.shield({ userId: id, type: valid == 2 ? 'unshut' : 'shut' })
            },
            onCancel() {},
        })
    }
    columns = [ {
        title: '用户id',
        dataIndex: '_id',
        width: 120
    }, {
        title: '用户名',
        dataIndex: 'nickname'
    }, {
        title: '影评篇数',
        dataIndex: 'comments'
    }, {
        title: '粉丝数',
        dataIndex: 'lovedFrom'
    }, {
        title: '创建时间',
        dataIndex: 'createdAt'
    }, {
        title: '操作',
        render: (text) => {
            return (
              <span>
                <a href="javascript:;" onClick={ () => this.props.checkUser(text._id) }>查看</a>
                <span className="ant-divider" />
                <a href="javascript:;" onClick={ () => this.shieldConfirm(text._id, text.valid) }>{ text.valid == 2 ? '已封号' : '封号' }</a>
              </span>
            )
        }
    } ]
    render() {
        const { getFieldDecorator } = this.props.form
        const { list, totalNum, isFetching, user, modalShow } = this.props.userlist
        return (
          <div>
            <div className="tableform">
              <Form inline={ true } onSubmit={ this.handleSubmit.bind(this) }>
                <FormItem>
                  {getFieldDecorator('valid', {
                      valuePropName: 'checked',
                      initialValue: false,
                  })(
                    <Checkbox>只显示被屏蔽的评论</Checkbox>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('id', {
                      rules: [],
                  })(
                    <Input placeholder="用户id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('name', {
                      rules: [],
                  })(
                    <Input placeholder="用户名" />
                  )}
                </FormItem>
                <FormItem className="tablesubmit">
                  <Button type="primary" htmlType="submit">搜索</Button>
                </FormItem>
              </Form>
            </div>
            <Table rowSelection={ this.rowSelection } pagination={ { total: totalNum, onChange: this.pageChange.bind(this), pageSize: 10 } } columns={ this.columns } dataSource={ list } loading={ isFetching } />
            <ModalDetail setModalVisible={ this.props.setModalVisible } dataSource={ user } columns={ columns } modalShow={ modalShow } />
          </div>
        )
    }
}
UserList = Form.create()(UserList)
const mapStateToProps = (state, props) => {
    return {
        userlist: state.userlist,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(UserListActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
