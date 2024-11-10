import React, { Component } from 'react'
import Base from '@/components/Base'
import { connect } from 'react-redux'

class History extends Component {
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
        任务记录查询，开发中
      </Base>
    )
  }
}

export default connect(({}) => ({}))(History)
