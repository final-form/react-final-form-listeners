// @flow
import * as React from 'react'
import { Field } from 'react-final-form'
import type { OnFocusProps } from './types'

type Props = {
  children: () => void,
  meta: {
    active?: boolean
  }
}

type State = {
  previous: boolean
}

class OnFocusState extends React.Component<Props, State> {
  props: Props
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      previous: !!props.meta.active
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { children, meta: { active } } = nextProps
    const { previous } = this.state
    if (active && !previous) {
      this.setState({ previous: active })
      children()
    }
  }

  render() {
    return null
  }
}

const OnFocus = ({ name, children }: OnFocusProps) =>
  React.createElement(Field, {
    name,
    subscription: { active: true },
    render: props => React.createElement(OnFocusState, { ...props, children })
  })

export default OnFocus
