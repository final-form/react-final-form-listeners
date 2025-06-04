import * as React from 'react'
import { Field } from 'react-final-form'
import { ExternallyChangedProps } from './types'

interface Props {
  children: (externallyChanged: boolean) => React.ReactNode
  input: {
    value: any
  }
  meta: {
    active?: boolean
  }
}

const ExternallyChangedState: React.FC<Props> = ({ children, input, meta }) => {
  const [externallyChanged, setExternallyChanged] = React.useState(false)
  const previousValueRef = React.useRef<any>(input.value)
  const hasInitializedRef = React.useRef(false)
  const initialRenderPhaseRef = React.useRef(true)

  React.useLayoutEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      previousValueRef.current = input.value
      return
    }

    if (input.value !== previousValueRef.current) {
      // Only consider it externally changed if:
      // 1. The field is not active AND
      // 2. We're past the initial render phase OR the change is from user interaction
      const wasExternallyChanged = !meta.active

      // Clear the initial render phase flag after the first real change
      if (initialRenderPhaseRef.current) {
        initialRenderPhaseRef.current = false
        // If this is the first change and field is not active, it's likely initialization
        if (!meta.active) {
          previousValueRef.current = input.value
          return
        }
      }

      setExternallyChanged(wasExternallyChanged)
      previousValueRef.current = input.value
    } else if (meta.active && externallyChanged) {
      // Reset externally changed when field becomes active
      setExternallyChanged(false)
    }
  })

  return children(externallyChanged) as React.ReactElement
}

const ExternallyChanged: React.FC<ExternallyChangedProps> = ({
  name,
  children
}) =>
  React.createElement(Field, {
    name,
    subscription: { active: true, value: true },
    allowNull: true,
    render: (props: any) =>
      React.createElement(ExternallyChangedState, { ...props, children })
  })

export default ExternallyChanged
