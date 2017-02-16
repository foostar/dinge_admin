import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import { Form, Input, notification, Button } from 'antd'
import * as UserConfirmActions from '../../reducers/user/userconfirm'

const FormItem = Form.Item
class UserConfirm extends React.Component {
    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return
            if (values.newPassword != values.confirm) {
                return notification.error({
                    message: '两次密码输入不一致',
                    duration: 3
                })
            }
            this.props.changePassword(values)
            .then(() => {
                notification.success({
                    message: '修改密码成功',
                    duration: 2
                })
                setTimeout(() => {
                    browserHistory.replace('/app/movielist')
                }, 2000)
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
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
          <Form onSubmit={ this.handleSubmit.bind(this) }>
            <FormItem
                { ...formItemLayout }
                label="旧密码"
                hasFeedback={ true }
            >
              {getFieldDecorator('oldPassword', {
                  rules: [ {
                      required: true, message: '请输入旧密码!',
                  } ],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="新密码"
                hasFeedback={ true }
            >
              {getFieldDecorator('newPassword', {
                  rules: [ {
                      required: true, message: '请输入新密码!',
                  } ],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="确认新密码"
                hasFeedback={ true }
            >
              {getFieldDecorator('confirm', {
                  rules: [ {
                      required: true, message: '请重复新密码!',
                  } ],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem { ...tailFormItemLayout }>
              <Button type="primary" htmlType="submit" size="large">提交</Button>
            </FormItem>
          </Form>
        )
    }
}
UserConfirm = Form.create()(UserConfirm)
const mapStateToProps = (state, props) => {
    return {
        userconfirm: state.userconfirm,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(UserConfirmActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserConfirm)
