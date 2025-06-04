import * as React from 'react'
import { Field, FieldRenderProps } from 'react-final-form'
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

  // The dependency array is intentionally omitted here because this effect
  // is designed to run on every render. It tracks value changes and field activity
  // to determine if changes were made externally (not by user interaction).
  React.useLayoutEffect(() => {
    // Initialize tracking on first run
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      previousValueRef.current = input.value
      return
    }

    // Handle value changes
    if (input.value !== previousValueRef.current) {
      // Only consider it externally changed if:
      // 1. The field is not active AND
      // 2. We're past the initial render phase OR the change is from user interaction
      const wasExternallyChanged = !meta.active

      // Clear the initial render phase flag after the first real change
      if (initialRenderPhaseRef.current) {
        initialRenderPhaseRef.current = false
        // If this is the first change and field is not active, it's likely initialization
        // Skip setting externally changed to avoid false positives during form setup
        if (!meta.active) {
          previousValueRef.current = input.value
          return
        }
      }

      // Update externally changed state and track the new value
      setExternallyChanged(wasExternallyChanged)
      previousValueRef.current = input.value
    } else if (meta.active && externallyChanged) {
      // Reset externally changed when field becomes active after external change
      // This allows users to "acknowledge" external changes by focusing the field
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
    render: (props: FieldRenderProps<any>) =>
      React.createElement(ExternallyChangedState, { ...props, children })
  })

export default ExternallyChanged
