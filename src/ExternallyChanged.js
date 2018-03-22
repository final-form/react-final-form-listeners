// @flow
import * as React from 'react'
import { Field } from 'react-final-form'
import type { ExternallyChangedProps } from './types'

type Props = {
  children: (externallyChanged: boolean) => React.Node,
  input: {
    value: any
  },
  meta: {
    active?: boolean
  }
}

type State = {
  previous: any,
  externallyChanged: boolean
}

class ExternallyChangedState extends React.Component<Props, State> {
  props: Props
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      previous: props.input.value,
      externallyChanged: false
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { input: { value }, meta: { active } } = nextProps
    const { previous } = this.state
    if (value !== previous) {
      this.setState({ previous: value, externallyChanged: !active })
    }
  }

  render() {
    return this.props.children(this.state.externallyChanged)
  }
}

const ExternallyChanged = ({ name, children }: ExternallyChangedProps) =>
  React.createElement(Field, {
    name,
    subscription: { active: true, value: true },
    allowNull: true,
    render: props =>
      React.createElement(ExternallyChangedState, { ...props, children })
  })

export default ExternallyChanged
