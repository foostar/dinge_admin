import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as <%= action %> from '<%= url %>'

class <%= name %> extends React.Component {
    render() {
        return ''
    }
}
const mapStateToProps = (state, props) => {
    return {
        <%= lowerName %>: state.<%= lowerName %>,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(<%= action %>, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(<%= name %>)
