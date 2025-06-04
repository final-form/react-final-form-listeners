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
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </div>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener when field gains focus', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </div>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should call listener multiple times on multiple focus events', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </div>
        )}
      </Form>
    )
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)

    fireEvent.blur(getByTestId('name'))
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should not call listener when field is already focused', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </div>
        )}
      </Form>
    )
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)

    // Focus the same field again - should not trigger
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should call listener again after blur and focus', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnFocus name="name">{spy}</OnFocus>
          </div>
        )}
      </Form>
    )

    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)

    fireEvent.blur(getByTestId('name'))
    fireEvent.focus(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
