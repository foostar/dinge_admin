import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import localforage from 'localforage'
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd'
import * as loginActions from '../reducers/login'

const FormItem = Form.Item

class Login extends React.Component {
    handleSubmit(e) {
        e.preventDefault()
        if (this.props.isFetching) return
        this.props.form.validateFields((err, values) => {
            if (err) {
                return notification.error({
                    message: '格式出错，请重试！',
                    duration: 3
                })
            }
            if (!values.username || !values.password) {
                return notification.error({
                    message: '缺少必填项！',
                    duration: 3
                })
            }
            this.props.login(values)
            .then((data) => {
                localforage.setItem('dingeToken', data.payload.token)
                .then(() => {
                    browserHistory.replace('/app/movielist')
                })
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
          <div className="login flex-container">
            <Form onSubmit={ this.handleSubmit.bind(this) } className="login-form">
              <h3 className="title">dinge管理后台登录</h3>
              <FormItem>
                {getFieldDecorator('username', {
                    rules: [ { required: true, message: 'Please input your username!' } ],
                })(
                  <Input addonBefore={ <Icon type="user" /> } placeholder="Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                    rules: [ { required: true, message: 'Please input your Password!' } ],
                })(
                  <Input addonBefore={ <Icon type="lock" /> } type="password" placeholder="Password" />
                )}
              </FormItem>
              <FormItem className="login_handle">
                {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                })(
                  <Checkbox>记住我</Checkbox>
                )}
                <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
              </FormItem>
            </Form>
          </div>
        )
    }
}
Login = Form.create()(Login)

const mapStateToProps = (state, props) => {
    return {
        sign: state.login,
        ...props
    }
}


const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(loginActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
