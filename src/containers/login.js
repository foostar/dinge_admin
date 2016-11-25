import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { Steps } from 'antd'
import * as loginActions from '../reducers/login'

const Step = Steps.Step

class Login extends React.Component {
    componentDidMount() {
        console.log(this.props)
    }
    render() {
        return (
          <Steps current={ 1 }>
            <Step title="Finished" description="This is a description." />
            <Step title="In Progress" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
          </Steps>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {
        form: state.login,
        ...props
    }
}


const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(loginActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
