import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as loginActions from '../reducers/login'

class Container extends React.Component {
    componentDidMount() {
    }
    render() {
        return (
          <div id="application-container">
            {this.props.children}
          </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        ...props
    }
}


const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(loginActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
