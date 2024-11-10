import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'

class Info extends Component {
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
        个人信息，开发中
      </Base>
    )
  }
}

export default connect(({}) => ({}))(Info)
