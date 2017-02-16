import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'

class TableAction extends React.Component {
    render() {
        const { data, action } = this.props
        const handles = data.map((v, index) => {
            return <Button type="primary" key={ index } onClick={ () => action(v.type, v) }>{v.name}</Button>
        })
        return (
          <div className="tablehandle">
            { handles }
          </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        ...props
    }
}

export default connect(mapStateToProps)(TableAction)
