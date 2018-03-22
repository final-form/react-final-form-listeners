// @flow
import * as React from 'react'
import { Field } from 'react-final-form'
import type { OnBlurProps } from './types'

type Props = {
  children: () => void,
  meta: {
    active?: boolean
  }
}

type State = {
  previous: boolean
}

class OnBlurState extends React.Component<Props, State> {
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
    if (previous && !active) {
      children()
    }
    if (previous !== active) {
      this.setState({ previous: active })
    }
  }

  render() {
    return null
  }
}

const OnBlur = ({ name, children }: OnBlurProps) =>
  React.createElement(Field, {
    name,
    subscription: { active: true },
    render: props => React.createElement(OnBlurState, { ...props, children })
  })

export default OnBlur
