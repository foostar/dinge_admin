import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Form, Input, Button } from 'antd'
import * as ReportUserActions from '../../reducers/user/reportuser'

const FormItem = Form.Item
class ReportUser extends React.Component {
    componentDidMount() {
        this.fetchData()
    }
    fetchData(page) {
        page = page || 1
        const { isFetching } = this.props.reportuser
        if (isFetching) return
        const fromData = this.props.form.getFieldsValue()
        const data = this.getFormData(fromData, page)
        this.props.getReportsList(data)
    }
    getFormData(fromData, page) {
        page = page || this.props.reportuser.page
        const data = {
            page,
            type: 'user'
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
        title: '举报原因',
        dataIndex: 'reason'
    }, {
        title: '创建时间',
        dataIndex: 'createdAt'
    } ]
    render() {
        const { getFieldDecorator } = this.props.form
        const { list, totalNum, isFetching } = this.props.reportuser
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
ReportUser = Form.create()(ReportUser)
const mapStateToProps = (state, props) => {
    return {
        reportuser: state.reportuser,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ReportUserActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReportUser)
