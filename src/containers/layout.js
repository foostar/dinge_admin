import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import { Layout, Menu, Icon } from 'antd'
import * as actions from '../reducers/movie/movielist'

const { Header, Footer, Sider } = Layout
const { SubMenu } = Menu

class LayoutComponent extends React.Component {
    state = {
        collapsed: false,
    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed })
    }
    componentDidMount() {
        const activeMenu = new Array(this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1))
        this.props.changeActiveMenu(activeMenu)
    }
    changeMenu(item) {
        const activeMenu = new Array(item.key)
        this.props.changeActiveMenu(activeMenu)
        browserHistory.replace(`/app/${item.key}`)
    }
    render() {
        const { activeMenu } = this.props.sign
        return (
          <div className="layout flex-container flex-column">
            <Header className="layout_header">DINGE ADMIN</Header>
            <Layout>
              <Sider width={ 200 } style={ { background: '#fff' } }>
                <Menu
                    mode="inline"
                    theme="dark"
                    defaultOpenKeys={ [ 'sub1' ] }
                    selectedKeys={ activeMenu }
                    style={ { height: '100%' } }
                    onClick={ this.changeMenu.bind(this) }
                >
                  <Menu.Item key="movielist">
                    <Icon type="bars" />电影管理
                  </Menu.Item>
                  <Menu.Item key="commentlist">
                    <Icon type="appstore" />影评管理
                  </Menu.Item>
                  <Menu.Item key="userlist">
                    <Icon type="user" />用户管理
                  </Menu.Item>
                  <Menu.Item key="adcarsousel">
                    <Icon type="bars" />广告管理
                  </Menu.Item>
                  <Menu.Item key="userconfirm">
                    <Icon type="setting" />修改密码
                  </Menu.Item>
                  <SubMenu key="sub2" title={ <span><Icon type="notification" />反馈处理</span> }>
                    <Menu.Item key="reportuser">举报-举报用户</Menu.Item>
                    <Menu.Item key="reportcomment">举报-举报影评</Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout>
                <div className="layout_content">
                  {this.props.children}
                </div>
                <Footer className="layout_footer">
                  dinge admin ©2016 Created by xiu
                </Footer>
              </Layout>
            </Layout>
          </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        sign: state.movielist,
        ...props
    }
}
const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(actions, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(LayoutComponent)
