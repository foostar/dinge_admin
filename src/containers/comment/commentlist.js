import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Form, Input, Button, Modal, Checkbox, Select } from 'antd'
import * as CommentListActions from '../../reducers/comment/commentlist'
import TableAction from '../../components/tableaction'
import ModalDetail from '../../components/modaldetail'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const tableData = [ {
    type: 'delete',
    name: '删除'
} ]
const columns = [ {
    key: 0,
    title: '评论id：',
    dataIndex: '_id'
}, {
    key: 1,
    title: '电影id：',
    dataIndex: 'movie._id'
}, {
    key: 2,
    title: '电影名称：',
    dataIndex: 'movie.title'
}, {
    key: 3,
    title: '评论用户id：',
    dataIndex: 'commentFrom._id'
}, {
    key: 4,
    title: '评论用户：',
    dataIndex: 'commentFrom.nickname'
}, {
    key: 5,
    title: '评论评分：',
    dataIndex: 'rank'
}, {
    key: 6,
    title: '评论标题：',
    dataIndex: 'title',
    isFlex: true
}, {
    key: 7,
    title: '评论内容：',
    dataIndex: 'content',
    isFlex: true
}, {
    key: 8,
    title: '评论回复数：',
    dataIndex: 'reply'
}, {
    key: 9,
    title: '评论点赞数：',
    dataIndex: 'star'
}, {
    key: 10,
    title: '评论时间：',
    dataIndex: 'createdAt'
}, {
    key: 11,
    title: '评论是否屏蔽：',
    dataIndex: 'valid',
    isBooleans: true
} ]
class CommentList extends React.Component {
    componentDidMount() {
        this.fetchData()
    }
    fetchData(page) {
        page = page || 1
        const { isFetching } = this.props.commentlist
        if (isFetching) return
        const fromData = this.props.form.getFieldsValue()
        const data = this.getFormData(fromData, page)
        this.props.getCommentList(data)
    }
    getFormData(fromData, page) {
        page = page || this.props.commentlist.page
        const data = {
            page
        }
        if (fromData.id) {
            data._id = fromData.id
        }
        if (fromData.movie) {
            data.movie = fromData.movie
        }
        if (fromData.valid) {
            data.valid = 1
        }
        if (fromData.userId) {
            data.commentFrom = fromData.userId
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
    tableActionhandler(type) {
        const { selectKeys } = this.props.commentlist
        if (type == 'delete') {
            return this.deleteConfirm(selectKeys)
        }
    }
    deleteConfirm(ids) {
        const { isFetching } = this.props.commentlist
        const self = this
        if (isFetching) return
        confirm({
            title: '你确定要删除这个评论吗?',
            onOk() {
                self.delete(ids)
            },
            onCancel() {},
        })
    }
    shieldConfirm(id, valid) {
        const { isFetching } = this.props.commentlist
        const self = this
        if (isFetching) return
        confirm({
            title: valid == 1 ? '你确定要开放这个屏蔽的评论吗?' : '你确定要屏蔽这个评论吗?',
            onOk() {
                self.props.shield({ commentId: id, type: valid == 1 ? 'unshield' : 'shield' })
            },
            onCancel() {},
        })
    }
    pageChange(page) {
        this.fetchData(page)
    }
    delete(ids) {
        const { page } = this.props.commentlist
        this.props.deleteComment({ commentsId: JSON.stringify(ids) })
        .then(() => {
            if (this.props.commentlist.list.length == 0) {
                if (page > 1) {
                    this.fetchData(page - 1)
                }
            }
        })
    }
    columns = [ {
        title: '影评id',
        dataIndex: '_id',
        width: 120
    }, {
        title: '电影id',
        dataIndex: 'movie._id',
        width: 120
    }, {
        title: '电影名称',
        dataIndex: 'movie.title'
    }, {
        title: '用户',
        dataIndex: 'commentFrom.nickname'
    }, {
        title: '创建时间',
        dataIndex: 'createdAt'
    }, {
        title: '回复数',
        dataIndex: 'reply'
    }, {
        title: '评论标题',
        dataIndex: 'title'
    }, {
        title: '权重',
        width: 120,
        render: (text) => {
            return (
              <Select defaultValue={ text.weight.toString() } onChange={ value => this.props.changeWeight({ weight: value, _id: text._id }) }>
                <Option value="3">首页评论</Option>
                <Option value="1">普通评论</Option>
              </Select>
            )
        }
    }, {
        title: '操作',
        render: (text) => {
            return (
              <span>
                <a href="javascript:;" onClick={ () => this.props.checkComment(text._id) }>查看</a>
                <span className="ant-divider" />
                <a href="javascript:;" onClick={ () => this.deleteConfirm([ text._id ]) }>删除</a>
                <span className="ant-divider" />
                <a href="javascript:;" onClick={ () => this.shieldConfirm(text._id, text.valid) }>{ text.valid == 1 ? '已屏蔽' : '屏蔽' }</a>
              </span>
            )
        }
    } ]
    render() {
        const { getFieldDecorator } = this.props.form
        const { list, totalNum, isFetching, comment, modalShow } = this.props.commentlist
        return (
          <div>
            <div className="tableform">
              <Form inline={ true } onSubmit={ this.handleSubmit.bind(this) }>
                <FormItem>
                  {getFieldDecorator('valid', {
                      valuePropName: 'checked',
                      initialValue: 0,
                  })(
                    <Checkbox>只显示被屏蔽的评论</Checkbox>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('movie', {
                      rules: [],
                  })(
                    <Input placeholder="电影id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('id', {
                      rules: [],
                  })(
                    <Input placeholder="评论id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('userId', {
                      rules: [],
                  })(
                    <Input placeholder="用户id" />
                  )}
                </FormItem>
                <FormItem className="tablesubmit">
                  <Button type="primary" htmlType="submit">搜索</Button>
                </FormItem>
              </Form>
            </div>
            <Table rowSelection={ this.rowSelection } pagination={ { total: totalNum, onChange: this.pageChange.bind(this), pageSize: 10 } } columns={ this.columns } dataSource={ list } loading={ isFetching } />
            <TableAction data={ tableData } action={ this.tableActionhandler.bind(this) } />
            <ModalDetail setModalVisible={ this.props.setModalVisible } dataSource={ comment } columns={ columns } modalShow={ modalShow } />
          </div>
        )
    }
}
CommentList = Form.create()(CommentList)
const mapStateToProps = (state, props) => {
    return {
        commentlist: state.commentlist,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(CommentListActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentList)
