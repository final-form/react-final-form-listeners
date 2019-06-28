import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { Form, Field } from 'react-final-form'
import OnFocus from './OnFocus'

const onSubmitMock = () => {}

describe('OnFocus', () => {
  afterEach(cleanup)

  it('should not call listener on first render', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock}>
        {() => <OnFocus name="foo">{spy}</OnFocus>}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener on focus', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </form>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })

  it('should not call listener on blur', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </form>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should call listener on subsequent focuses', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </form>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()

    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)

    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
