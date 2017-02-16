import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory, Link } from 'react-router'
import { Table, Form, Input, Button, Modal, Checkbox, Select } from 'antd'
import * as AdCarsouselActions from '../../reducers/ad/adcarsousel'
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
    title: '广告id：',
    dataIndex: '_id'
}, {
    key: 1,
    title: '广告标题：',
    dataIndex: 'title'
}, {
    key: 2,
    title: '广告内容：',
    dataIndex: 'content',
    isImg: true
}, {
    key: 3,
    title: '跳转地址：',
    dataIndex: 'url'
}, {
    key: 4,
    title: '权重：',
    dataIndex: 'weight'
}, {
    key: 5,
    title: '创建时间：',
    dataIndex: 'createdAt'
} ]
class AdCarsousel extends React.Component {
    componentDidMount() {
        this.fetchData()
    }
    fetchData(page) {
        page = page || 1
        const { isFetching } = this.props.adcarsousel
        if (isFetching) return
        const fromData = this.props.form.getFieldsValue()
        const data = this.getFormData(fromData, page)
        this.props.getCarousel(data)
    }
    getFormData(fromData, page) {
        page = page || this.props.adcarsousel.page
        const data = {
            page
        }
        if (fromData.id) {
            data._id = fromData.id
        }
        if (fromData.title) {
            data.title = encodeURIComponent(fromData.title)
        }
        if (fromData.weight) {
            data.weight = fromData.weight
        }
        return data
    }
    deleteConfirm(ids) {
        const { isFetching } = this.props.adcarsousel
        const self = this
        if (isFetching) return
        confirm({
            title: '你确定要删除这个广告吗?',
            onOk() {
                self.delete(ids)
            },
            onCancel() {},
        })
    }
    delete(ids) {
        const { page } = this.props.adcarsousel
        this.props.deleteCarousel({ carouselId: JSON.stringify(ids) })
        .then(() => {
            if (this.props.adcarsousel.list.length == 0) {
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
        title: '轮播id',
        dataIndex: '_id'
    }, {
        title: '广告名称',
        dataIndex: 'title'
    }, {
        title: '跳转地址',
        dataIndex: 'url',
    }, {
        title: '广告图片地址',
        dataIndex: 'content'
    }, {
        title: '权重',
        render: (text) => {
            return (
              <Select defaultValue={ text.weight.toString() } onChange={ value => this.props.changeWeight({ weight: value, _id: text._id }) }>
                <Option value="90">首页评论</Option>
                <Option value="80">普通评论</Option>
              </Select>
            )
        }
    }, {
        title: '操作',
        render: (text) => {
            return (
              <span>
                <a href="javascript:;" onClick={ () => this.props.checkCarousel(text._id) }>查看</a>
                <span className="ant-divider" />
                <a href="javascript:;" onClick={ () => browserHistory.replace(`/app/editadsel?carouselId=${text._id}`) }>编辑</a>
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
        const { selectKeys } = this.props.adcarsousel
        if (type == 'delete') {
            return this.deleteConfirm(selectKeys)
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { list, totalNum, isFetching, carousel, modalShow } = this.props.adcarsousel
        return (
          <div>
            <div className="tableform">
              <Form inline={ true } onSubmit={ this.handleSubmit.bind(this) }>
                <FormItem>
                  <Button type="primary"><Link to="/app/editadsel">新增广告</Link></Button>
                </FormItem>
                <FormItem>
                  {getFieldDecorator('weight', {
                      valuePropName: 'checked',
                      initialValue: false,
                  })(
                    <Checkbox>只显示首页轮播</Checkbox>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('id', {
                      rules: [],
                  })(
                    <Input placeholder="广告id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('title', {
                      rules: [],
                  })(
                    <Input placeholder="广告名称" />
                  )}
                </FormItem>
                <FormItem className="tablesubmit">
                  <Button type="primary" htmlType="submit">搜索</Button>
                </FormItem>
              </Form>
            </div>
            <Table rowSelection={ this.rowSelection } pagination={ { total: totalNum, onChange: this.pageChange.bind(this), pageSize: 10 } } columns={ this.columns } dataSource={ list } loading={ isFetching } />
            <TableAction data={ tableData } action={ this.tableActionhandler.bind(this) } />
            <ModalDetail setModalVisible={ this.props.setModalVisible } dataSource={ carousel } columns={ columns } modalShow={ modalShow } />
          </div>
        )
    }
}
AdCarsousel = Form.create()(AdCarsousel)
const mapStateToProps = (state, props) => {
    return {
        adcarsousel: state.adcarsousel,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(AdCarsouselActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdCarsousel)
