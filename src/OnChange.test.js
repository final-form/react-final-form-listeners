import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { Form, Field } from 'react-final-form'
import OnChange from './OnChange'

const onSubmitMock = () => {}

describe('OnChange', () => {
  afterEach(cleanup)

  it('should not call listener on first render', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {() => <OnChange name="foo">{spy}</OnChange>}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
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
    expect(spy).not.toHaveBeenCalled()
    fireEvent.change(getByTestId('name'), { target: { value: 'erikras' } })
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
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
    expect(spy).not.toHaveBeenCalled()
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
    expect(spy).not.toHaveBeenCalled()
    fireEvent.change(getByTestId('name'), { target: { value: null } })
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('', 'erikras')
  })
})
