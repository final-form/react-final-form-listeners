import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChangeProps } from './types'

interface Props {
  children: (value: any, previous: any) => void
  input: {
    value: any
  }
}

interface State {
  previous: any
}

class OnChangeState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      previous: props.input.value
    }
  }

  componentDidUpdate() {
    const {
      children,
      input: { value }
    } = this.props
    const { previous } = this.state
    if (value !== previous) {
      this.setState({ previous: value })
      children(value, previous)
    }
  }

  render() {
    return null
  }
}

const OnChange: React.FC<OnChangeProps> = ({ name, children }) =>
  React.createElement(Field, {
    name,
    subscription: { value: true },
    allowNull: true,
    render: (props: any) =>
      React.createElement(OnChangeState, { ...props, children })
  })

export default OnChange
