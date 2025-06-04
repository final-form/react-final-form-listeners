import * as React from 'react'
import { Field, FieldRenderProps } from 'react-final-form'
import { OnBlurProps } from './types'

interface Props {
  children: () => void
  meta: {
    active?: boolean
  }
}

interface State {
  previous: boolean
}

class OnBlurState extends React.Component<Props, State> {
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
    if (previous && !active) {
      children()
    }
    if (previous !== !!active) {
      this.setState({ previous: !!active })
    }
  }

  render() {
    return null
  }
}

const OnBlur: React.FC<OnBlurProps> = ({ name, children }) =>
  React.createElement(Field, {
    name,
    subscription: { active: true },
    render: (props: FieldRenderProps<any>) =>
      React.createElement(OnBlurState, { ...props, children })
  })

export default OnBlur
