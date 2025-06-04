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
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnBlur name="name">{spy}</OnBlur>
          </div>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener when field loses focus', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <Field name="other" component="input" data-testid="other" />
            <OnBlur name="name">{spy}</OnBlur>
          </div>
        )}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    fireEvent.focus(getByTestId('name'))
    expect(spy).not.toHaveBeenCalled()
    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should not call listener when field was not focused', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnBlur name="name">{spy}</OnBlur>
          </div>
        )}
      </Form>
    )
    fireEvent.blur(getByTestId('name'))
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener multiple times on multiple blur events', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <div>
            <Field name="name" component="input" data-testid="name" />
            <OnBlur name="name">{spy}</OnBlur>
          </div>
        )}
      </Form>
    )
    fireEvent.focus(getByTestId('name'))
    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(1)

    fireEvent.focus(getByTestId('name'))
    fireEvent.blur(getByTestId('name'))
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
