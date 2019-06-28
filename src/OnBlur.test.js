import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { Form, Field } from 'react-final-form'
import OnBlur from './OnBlur'

const onSubmitMock = () => {}

describe('OnBlur', () => {
  afterEach(cleanup)

  it('should not call listener on first render', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock}>
        {() => <OnBlur name="foo">{spy}</OnBlur>}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should not call listener on focus', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnBlur name="name">{spy}</OnBlur>
          </form>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener on blur', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnBlur name="name">{spy}</OnBlur>
          </form>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).not.toHaveBeenCalled()
    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })
})
