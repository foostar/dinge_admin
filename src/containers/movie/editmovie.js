import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { Form, Input, Button, notification } from 'antd'
import * as movieActions from '../../reducers/movie/editmovie'
import { stringToMap } from '../../utils/util'

const FormItem = Form.Item
class Editmovie extends React.Component {
    componentDidMount() {
        const { movieId } = this.props.router.location.query
        if (!movieId) return
        this.props.getMovieById({ page: 1, _id: movieId })
    }
    getMovie() {
        const did = this.props.form.getFieldValue('did')
        if (!did) {
            return notification.error({
                message: '请输入豆瓣id',
                duration: 3
            })
        }
        if (this.props.isFetching) return
        this.props.getDoubanMovie(did)
    }
    editMovie(data) {
        const { movieId } = this.props.router.location.query
        if (movieId) {
            data._id = movieId
            data = JSON.stringify(data)
            return this.props.exitMovie({ data })
        }
        data = JSON.stringify(data)
        return this.props.addMovie({ data })
    }
    handlesubmit(e) {
        e.preventDefault()
        if (this.props.isFetching) return
        this.props.form.validateFields((err, values) => {
            if (err) return
            const { rating } = this.props.movie
            const data = {
                title: values.title,
                rating,
                directors: stringToMap(values.directors),
                casts: stringToMap(values.casts),
                country: stringToMap(values.country),
                genres: stringToMap(values.genres),
                aka: stringToMap(values.aka),
                language: stringToMap(values.language),
                actime: values.actime,
                images: {
                    large: values.large,
                    small: values.small,
                    medium: values.medium
                },
                subject: values.subject,
                releaseTime: values.releaseTime
            }
            this.editMovie(data)
            .then(() => {
                browserHistory.replace('/app/movielist')
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { movie } = this.props
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
                label="豆瓣id"
                hasFeedback={ true }
                className={ movie.isShowDid ? '' : 'disappear' }
            >
              {getFieldDecorator('did', {
                  rules: [],
                  initialValue: movie.did || ''
              })(
                <Input onBlur={ this.getMovie.bind(this) } />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="电影名称"
                hasFeedback={ true }
            >
              {getFieldDecorator('title', {
                  rules: [ {
                      required: true, message: '请输入电影名称!',
                  } ],
                  initialValue: movie.title || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="导演"
                hasFeedback={ true }
            >
              {getFieldDecorator('directors', {
                  rules: [ {
                      required: true, message: '请输入导演!',
                  } ],
                  initialValue: movie.directors || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="主演"
                hasFeedback={ true }
            >
              {getFieldDecorator('casts', {
                  rules: [ {
                      required: true, message: '请输入主演!',
                  } ],
                  initialValue: movie.casts || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="又名"
                hasFeedback={ true }
            >
              {getFieldDecorator('aka', {
                  rules: [ {
                      required: true, message: '请输入又名!',
                  } ],
                  initialValue: movie.aka || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="类型"
                hasFeedback={ true }
            >
              {getFieldDecorator('genres', {
                  rules: [ {
                      required: true, message: '请输入类型!',
                  } ],
                  initialValue: movie.genres || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="国家"
                hasFeedback={ true }
            >
              {getFieldDecorator('country', {
                  rules: [ {
                      required: true, message: '请输入国家!',
                  } ],
                  initialValue: movie.country || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="语言"
                hasFeedback={ true }
            >
              {getFieldDecorator('language', {
                  rules: [ {
                      required: true, message: '请输入语言!',
                  } ],
                  initialValue: movie.language || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="上映时间"
                hasFeedback={ true }
            >
              {getFieldDecorator('releaseTime', {
                  rules: [ {
                      required: true, message: '请输入上映时间!',
                  } ],
                  initialValue: movie.releaseTime || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="大海报"
                hasFeedback={ true }
            >
              {getFieldDecorator('large', {
                  rules: [ {
                      required: true, message: '请输入大海报!',
                  } ],
                  initialValue: movie.images.large || ''
              })(
                <Input />
              )}
            </FormItem>

            <FormItem { ...tailFormItemLayout } className={ movie.isShowDid ? 'disappear' : '' }>
              <img src={ movie.images.large || '' } alt="大海报" />
            </FormItem>

            <FormItem
                { ...formItemLayout }
                label="中海报"
                hasFeedback={ true }
            >
              {getFieldDecorator('medium', {
                  rules: [ {
                      required: true, message: '请输入中海报!',
                  } ],
                  initialValue: movie.images.medium || ''
              })(
                <Input />
              )}
            </FormItem>

            <FormItem { ...tailFormItemLayout } className={ movie.isShowDid ? 'disappear' : '' }>
              <img src={ movie.images.medium || '' } alt="中海报" />
            </FormItem>

            <FormItem
                { ...formItemLayout }
                label="小海报"
                hasFeedback={ true }
            >
              {getFieldDecorator('small', {
                  rules: [ {
                      required: true, message: '请输入小海报!',
                  } ],
                  initialValue: movie.images.small || ''
              })(
                <Input />
              )}
            </FormItem>

            <FormItem { ...tailFormItemLayout } className={ movie.isShowDid ? 'disappear' : '' }>
              <img src={ movie.images.small || '' } alt="小海报" />
            </FormItem>

            <FormItem
                { ...formItemLayout }
                label="片长"
                hasFeedback={ true }
            >
              {getFieldDecorator('actime', {
                  rules: [ {
                      required: true, message: '请输入片长!',
                  } ],
                  initialValue: movie.actime || ''
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label="电影简介"
                hasFeedback={ true }
            >
              {getFieldDecorator('subject', {
                  rules: [ {
                      required: true, message: '请输入电影简介!',
                  } ],
                  initialValue: movie.subject || ''
              })(
                <Input type="textarea" rows={ 4 } />
              )}
            </FormItem>
            <FormItem { ...tailFormItemLayout }>
              <Button type="primary" htmlType="submit" size="large">提交</Button>
            </FormItem>
          </Form>
        )
    }
}
Editmovie = Form.create()(Editmovie)
const mapStateToProps = (state, props) => {
    return {
        movie: state.movie,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(movieActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Editmovie)
