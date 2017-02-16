import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Form, Input, Button } from 'antd'
import * as ReportCommentActions from '../../reducers/user/reportuser'

const FormItem = Form.Item
class ReportComment extends React.Component {
    componentDidMount() {
        this.fetchData()
    }
    fetchData(page) {
        page = page || 1
        const { isFetching } = this.props.reportcomment
        if (isFetching) return
        const fromData = this.props.form.getFieldsValue()
        const data = this.getFormData(fromData, page)
        this.props.getReportsList(data)
    }
    getFormData(fromData, page) {
        page = page || this.props.reportcomment.page
        const data = {
            page,
            type: 'comment'
        }
        if (fromData.id) {
            data._id = fromData.id
        }
        if (fromData.reportTo) {
            data.reportTo = fromData.reportTo
        }
        if (fromData.reportFrom) {
            data.reportFrom = fromData.reportFrom
        }
        if (fromData.reportComment) {
            data.reportComment = fromData.reportComment
        }
        return data
    }
    handleSubmit(e) {
        e.preventDefault()
        this.fetchData()
    }
    pageChange(page) {
        this.fetchData(page)
    }
    columns = [ {
        title: '举报单id',
        dataIndex: '_id',
        width: 120
    }, {
        title: '举报人id',
        dataIndex: 'reportFrom'
    }, {
        title: '被举报人id',
        dataIndex: 'reportTo'
    }, {
        title: '被举报影评id',
        dataIndex: 'reportComment'
    }, {
        title: '举报原因',
        dataIndex: 'reason'
    }, {
        title: '创建时间',
        dataIndex: 'createdAt'
    } ]
    render() {
        const { getFieldDecorator } = this.props.form
        const { list, totalNum, isFetching } = this.props.reportcomment
        return (
          <div>
            <div className="tableform">
              <Form inline={ true } onSubmit={ this.handleSubmit.bind(this) }>
                <FormItem>
                  {getFieldDecorator('id', {
                      rules: [],
                  })(
                    <Input placeholder="举报id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('reportFrom', {
                      rules: [],
                  })(
                    <Input placeholder="举报人id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('reportTo', {
                      rules: [],
                  })(
                    <Input placeholder="被举报人id" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('reportComment', {
                      rules: [],
                  })(
                    <Input placeholder="被举报影评id" />
                  )}
                </FormItem>
                <FormItem className="tablesubmit">
                  <Button type="primary" htmlType="submit">搜索</Button>
                </FormItem>
              </Form>
            </div>
            <Table pagination={ { total: totalNum, onChange: this.pageChange.bind(this), pageSize: 10 } } columns={ this.columns } dataSource={ list } loading={ isFetching } />
          </div>
        )
    }
}
ReportComment = Form.create()(ReportComment)
const mapStateToProps = (state, props) => {
    return {
        reportcomment: state.reportuser,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ReportCommentActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReportComment)
