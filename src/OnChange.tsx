import * as React from 'react'
import { Field, FieldRenderProps } from 'react-final-form'
import { OnChangeProps } from './types'

interface Props {
  children: (value: any, previous: any) => void
  input: {
    value: any
  }
}

const OnChangeState: React.FC<Props> = ({ children, input }) => {
  const previousValueRef = React.useRef<any>(undefined)
  const hasInitializedRef = React.useRef(false)

  // The dependency array is intentionally omitted here because this effect
  // is designed to run on every render. It compares the current and previous
  // values of `input.value` and triggers the `children` callback if they differ.
  React.useLayoutEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      previousValueRef.current = input.value
      return
    }

    if (input.value !== previousValueRef.current) {
      children(input.value, previousValueRef.current)
      previousValueRef.current = input.value
    }
  })

  return null
}

const OnChange: React.FC<OnChangeProps> = ({ name, children }) =>
  React.createElement(Field, {
    name,
    subscription: { value: true },
    allowNull: true,
    render: (props: FieldRenderProps<any>) =>
      React.createElement(OnChangeState, { ...props, children })
  })

export default OnChange
