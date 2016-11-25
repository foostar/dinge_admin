import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'

import * as loginActions from '../reducers/login'

class Container extends React.Component {
    componentDidMount() {
        console.log(this.props)
    }
    render() {
        // <SiteNav light={ location.pathname === '/' } />
        return (
          <div id="application-container">
            {this.props.children}
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Container)
