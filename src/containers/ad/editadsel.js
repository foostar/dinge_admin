import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { Form, Input, Button } from 'antd'
import * as EditAdSelActions from '../../reducers/ad/editadsel'

const FormItem = Form.Item
class EditAdSel extends React.Component {
    componentDidMount() {
        const { carouselId } = this.props.router.location.query
        if (!carouselId) return
        this.props.getCarouselById({ page: 1, _id: carouselId })
    }
    editCarousel(data) {
        const { carouselId } = this.props.router.location.query
        if (carouselId) {
            data._id = carouselId
            data = JSON.stringify(data)
            return this.props.editCarousel({ data })
        }
        data = JSON.stringify(data)
        return this.props.addCarousel({ data })
    }
    handlesubmit(e) {
        e.preventDefault()
        if (this.props.isFetching) return
        this.props.form.validateFields((err, values) => {
            if (err) return
            this.editCarousel(values)
            .then(() => {
                browserHistory.replace('/app/adcarsousel')
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { editadsel } = this.props
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6,
            }
        }
        return (
          <Form onSubmit={ this.handlesubmit.bind(this) }>
            <FormItem
                { ...formItemLayout }
                label="广告名称"
                hasFeedback={ true }
            >
              {getFieldDecorator('title', {
                  rules: [ {
                      required: true, message: '请输入广告标题!',
                  } ],
                  initialValue: editadsel.title || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="广告内容"
                hasFeedback={ true }
            >
              {getFieldDecorator('content', {
                  rules: [ {
                      required: true, message: '请输入广告内容!',
                  } ],
                  initialValue: editadsel.content || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="广告链接"
                hasFeedback={ true }
            >
              {getFieldDecorator('url', {
                  rules: [ {
                      required: true, message: '请输入广告链接!',
                  } ],
                  initialValue: editadsel.url || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem { ...tailFormItemLayout }>
              <Button type="primary" htmlType="submit" size="large">提交</Button>
            </FormItem>
          </Form>
        )
    }
}
EditAdSel = Form.create()(EditAdSel)
const mapStateToProps = (state, props) => {
    return {
        editadsel: state.editadsel,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(EditAdSelActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditAdSel)
