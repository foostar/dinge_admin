import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory, Link } from 'react-router'
import { Table, Form, Input, Button, Modal } from 'antd'
import * as movieListActions from '../../reducers/movie/movielist'
import TableAction from '../../components/tableaction'

const FormItem = Form.Item
const confirm = Modal.confirm
const tableData = [ {
    type: 'delete',
    name: '删除'
} ]
class MovieList extends React.Component {
    componentDidMount() {
        this.fetchData()
    }
    fetchData(page) {
        page = page || 1
        const { isFetching } = this.props.movielist
        if (isFetching) return
        const fromData = this.props.form.getFieldsValue()
        const data = this.getFormData(fromData, page)
        this.props.getMovieList(data)
    }
    getFormData(fromData, page) {
        page = page || this.props.movielist.page
        const data = {
            page
        }
        if (fromData.id) {
            data._id = fromData.id
        }
        if (fromData.title) {
            data.title = encodeURIComponent(fromData.title)
        }
        return data
    }
    deleteConfirm(ids) {
        const { isFetching } = this.props.movielist
        const self = this
        if (isFetching) return
        confirm({
            title: '你确定要删除这个电影吗?',
            onOk() {
                self.delete(ids)
            },
            onCancel() {},
        })
    }
    delete(ids) {
        const { page } = this.props.movielist
        this.props.deleteMovie({ movieId: JSON.stringify(ids) })
        .then(() => {
            if (this.props.movielist.list.length == 0) {
                this.fetchData(page - 1)
            }
        })
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
    columns = [ {
        title: '电影名称',
        dataIndex: 'title'
    }, {
        title: '电影id',
        dataIndex: '_id',
    }, {
        title: '创建时间',
        dataIndex: 'createdAt',
    }, {
        title: '操作',
        render: (text) => {
            return (
              <span>
                <a href="javascript:;" onClick={ () => browserHistory.replace(`/app/editmovie?movieId=${text._id}`) }>编辑</a>
                <span className="ant-divider" />
                <a href="javascript:;" onClick={ () => this.deleteConfirm([ text._id ]) }>删除</a>
              </span>
            )
        }
    } ]
    handleSubmit(e) {
        e.preventDefault()
        this.fetchData()
    }
    pageChange(page) {
        this.fetchData(page)
    }
    tableActionhandler(type) {
        const { selectKeys } = this.props.movielist
        if (type == 'delete') {
            return this.deleteConfirm(selectKeys)
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { list, totalNum, isFetching } = this.props.movielist
        return (
          <div>
            <div className="tableform">
              <Form inline={ true } onSubmit={ this.handleSubmit.bind(this) }>
                <FormItem>
                  <Button type="primary"><Link to="/app/editmovie">新增电影</Link></Button>
                </FormItem>
                <FormItem>
                  {getFieldDecorator('id', {
                      rules: [],
                  })(
                    <Input placeholder="电影id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('title', {
                      rules: [],
                  })(
                    <Input placeholder="电影名称" />
                  )}
                </FormItem>
                <FormItem className="tablesubmit">
                  <Button type="primary" htmlType="submit">搜索</Button>
                </FormItem>
              </Form>
            </div>
            <Table rowSelection={ this.rowSelection } pagination={ { total: totalNum, onChange: this.pageChange.bind(this), pageSize: 10 } } columns={ this.columns } dataSource={ list } loading={ isFetching } />
            <TableAction data={ tableData } action={ this.tableActionhandler.bind(this) } />
          </div>
        )
    }
}
MovieList = Form.create()(MovieList)

const mapStateToProps = (state, props) => {
    return {
        movielist: state.movielist,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(movieListActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MovieList)
