import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'

class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidShow = () => {
  }

  componentDidMount() {

  }

  render() {
    const {} = this.state
    return (
      <Base>
        通讯录，开发中
      </Base>
    )
  }
}

export default connect(({}) => ({}))(Contacts)
