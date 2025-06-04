import React from 'react'
import { render, fireEvent } from '@testing-library/react'
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
})
