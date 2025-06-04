import * as React from 'react'
import { Field, FieldRenderProps } from 'react-final-form'
import { OnFocusProps } from './types'

interface Props {
  children: () => void
  meta: {
    active?: boolean
  }
}

interface State {
  previous: boolean
}

class OnFocusState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      previous: !!props.meta.active
    }
  }

  componentDidUpdate() {
    const {
      children,
      meta: { active }
    } = this.props
    const { previous } = this.state
    if (active && !previous) {
      this.setState({ previous: !!active })
      children()
    } else if (!active && previous) {
      this.setState({ previous: !!active })
    }
  }

  render() {
    return null
  }
}

const OnFocus: React.FC<OnFocusProps> = ({ name, children }) =>
  React.createElement(Field, {
    name,
    subscription: { active: true },
    render: (props: FieldRenderProps<any>) =>
      React.createElement(OnFocusState, { ...props, children })
  })

export default OnFocus
