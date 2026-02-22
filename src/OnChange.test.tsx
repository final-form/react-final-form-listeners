import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { Form, Field } from 'react-final-form'
import OnChange from './OnChange'

const onSubmitMock = () => {}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('OnChange', () => {
  it('should call listener on first render with initial value', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {() => <OnChange name="foo">{spy}</OnChange>}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('bar', '')
  })

  it('should call listener when going from uninitialized to value', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnChange name="name">{spy}</OnChange>
          </form>
        )}
      </Form>
    )
    // For uninitialized field, it might not be called initially
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('erikras', '')
  })

  it('should call listener when going from initialized to value', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ name: 'erik' }}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnChange name="name">{spy}</OnChange>
          </form>
        )}
      </Form>
    )
    // Should be called initially with "" -> "erik"
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('erik', '')

    spy.mockClear()
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('erikras', 'erik')
  })

  it('should call listener when changing to null', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ name: 'erikras' }}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnChange name="name">{spy}</OnChange>
          </form>
        )}
      </Form>
    )
    // Should be called initially with "" -> "erikras"
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('erikras', '')

    spy.mockClear()
    fireEvent.change(getByTestId('name'), { target: { value: null } })
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('', 'erikras')
  })

  it('should handle quick subsequent changes properly', () => {
    const toppings = ['Pepperoni', 'Mushrooms', 'Olives']
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {({ form }) => (
          <React.Fragment>
            <Field
              name="everything"
              component="input"
              type="checkbox"
              data-testid="everything"
            />
            <OnChange name="everything">
              {(next: any) => {
                if (next) {
                  return form.change('toppings', toppings)
                }
              }}
            </OnChange>
            {toppings.length > 0 &&
              toppings.map((topping) => {
                return (
                  <Field
                    component="input"
                    key={topping}
                    name="toppings"
                    value={topping}
                    type="checkbox"
                    data-testid={topping}
                  />
                )
              })}
            <OnChange name="toppings">
              {(next: any) => {
                form.change(
                  'everything',
                  next && next.length === toppings.length
                )
              }}
            </OnChange>
          </React.Fragment>
        )}
      </Form>
    )
    const everythingCheckbox = getByTestId('everything') as HTMLInputElement
    const pepperoniCheckbox = getByTestId('Pepperoni') as HTMLInputElement
    const mushroomsCheckbox = getByTestId('Mushrooms') as HTMLInputElement
    const olivesCheckbox = getByTestId('Olives') as HTMLInputElement

    expect(everythingCheckbox.checked).toBe(false)
    expect(pepperoniCheckbox.checked).toBe(false)
    expect(mushroomsCheckbox.checked).toBe(false)
    expect(olivesCheckbox.checked).toBe(false)

    fireEvent.click(pepperoniCheckbox)
    expect(pepperoniCheckbox.checked).toBe(true)
    expect(everythingCheckbox.checked).toBe(false)

    fireEvent.click(mushroomsCheckbox)
    expect(mushroomsCheckbox.checked).toBe(true)
    expect(everythingCheckbox.checked).toBe(false)

    fireEvent.click(olivesCheckbox)
    expect(olivesCheckbox.checked).toBe(true)
    expect(everythingCheckbox.checked).toBe(true)

    fireEvent.click(olivesCheckbox)
    expect(olivesCheckbox.checked).toBe(false)
    expect(everythingCheckbox.checked).toBe(false)

    fireEvent.click(everythingCheckbox)
    expect(pepperoniCheckbox.checked).toBe(true)
    expect(mushroomsCheckbox.checked).toBe(true)
    expect(olivesCheckbox.checked).toBe(true)
    expect(everythingCheckbox.checked).toBe(true)
  })

  it('should not loop infinitely when value is NaN and callback updates another field (#11)', () => {
    // https://github.com/final-form/react-final-form-listeners/issues/11
    // NaN !== NaN is always true in JS. Without a fix, OnChange would fire on every
    // render when value is NaN (because NaN !== NaN), creating an infinite update loop
    // when the callback triggers a re-render (e.g., by changing another field).
    // Fix: use Object.is() for comparison (Object.is(NaN, NaN) === true).
    const spy = jest.fn()

    const Wrapper = () => (
      <Form onSubmit={onSubmitMock} initialValues={{ number: NaN }}>
        {({ form }) => (
          <div>
            <Field name="number" component="input" type="number" data-testid="number" />
            <Field name="other" component="input" data-testid="other" />
            <OnChange name="number">
              {(value, previous) => {
                spy(value, previous)
                // This triggers a re-render, which would cause infinite loop with NaN
                form.change('other', String(value))
              }}
            </OnChange>
          </div>
        )}
      </Form>
    )

    expect(() => {
      render(<Wrapper />)
    }).not.toThrow()

    // Spy should be called exactly once for the initial NaN value,
    // NOT in an infinite loop (and not zero times, which would mask regressions)
    expect(spy).toHaveBeenCalledTimes(1)
    // Previous value is empty string because final-form initializes fields with ""
    expect(spy).toHaveBeenCalledWith(NaN, "")
  })

  it('should not call listener on re-renders when value has not changed (#7)', () => {
    // https://github.com/final-form/react-final-form-listeners/issues/7
    // OnChange should NOT fire on re-renders when the value hasn't changed.
    const spy = jest.fn()
    let triggerRerender: () => void = () => {}

    const Parent = () => {
      const [count, setCount] = React.useState(0)
      triggerRerender = () => setCount(c => c + 1)
      return (
        <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
          {() => (
            <div>
              <span data-testid="count">{count}</span>
              <Field name="foo" component="input" data-testid="foo" />
              <OnChange name="foo">{spy}</OnChange>
            </div>
          )}
        </Form>
      )
    }

    const { getByTestId } = render(<Parent />)

    // Spy might be called once on initial render (if value matches initial)
    const callsAfterMount = spy.mock.calls.length

    // Force re-renders without changing the field value
    act(() => { triggerRerender() })
    act(() => { triggerRerender() })
    act(() => { triggerRerender() })

    // OnChange should not have been called due to re-renders alone
    expect(spy.mock.calls.length).toBe(callsAfterMount)
  })
})
