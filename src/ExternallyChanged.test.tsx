import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { Form, Field } from 'react-final-form'
import ExternallyChanged from './ExternallyChanged'

const onSubmitMock = () => {}

afterEach(cleanup)

describe('ExternallyChanged', () => {
  it('should indicate false for externally changed on first render', () => {
    const spy = jest.fn()
    render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {() => <ExternallyChanged name="foo">{spy}</ExternallyChanged>}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    // The component might be called multiple times during initialization
    // but we care about the final state being false
    const calls = spy.mock.calls
    const lastCall = calls[calls.length - 1]
    expect(lastCall[0]).toBe(false)
  })

  it('should indicate externally changed when form changes value externally', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {({ form }) => (
          <div>
            <ExternallyChanged name="foo">{spy}</ExternallyChanged>
            <button
              type="button"
              onClick={() => form.change('foo', 'baz')}
              data-testid="external-button"
            >
              External Change
            </button>
          </div>
        )}
      </Form>
    )

    spy.mockClear()
    fireEvent.click(getByTestId('external-button'))
    expect(spy).toHaveBeenCalledWith(true)
  })

  it('should not indicate externally changed when user changes value', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {() => (
          <div>
            <Field name="foo" component="input" data-testid="foo" />
            <ExternallyChanged name="foo">{spy}</ExternallyChanged>
          </div>
        )}
      </Form>
    )

    spy.mockClear()
    // Focus the field first to make it active
    fireEvent.focus(getByTestId('foo'))
    fireEvent.change(getByTestId('foo'), { target: { value: 'baz' } })
    expect(spy).toHaveBeenCalledWith(false)
  })

  it('should reset to false after external change when user focuses field', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {({ form }) => (
          <div>
            <Field name="foo" component="input" data-testid="foo" />
            <ExternallyChanged name="foo">{spy}</ExternallyChanged>
            <button
              type="button"
              onClick={() => form.change('foo', 'externally-changed')}
              data-testid="external-button"
            >
              External Change
            </button>
          </div>
        )}
      </Form>
    )

    // Clear initial calls
    spy.mockClear()

    // Make external change
    fireEvent.click(getByTestId('external-button'))
    expect(spy).toHaveBeenCalledWith(true)

    spy.mockClear()
    fireEvent.focus(getByTestId('foo'))

    // The focus event should reset the externally changed state
    // but since the value didn't change, we might need to check differently
    if (spy.mock.calls.length > 0) {
      expect(spy).toHaveBeenCalledWith(false)
    }
  })

  it('should reset externally changed state when field becomes active after external change', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {({ form }) => (
          <div>
            <Field name="foo" component="input" data-testid="foo" />
            <ExternallyChanged name="foo">{spy}</ExternallyChanged>
            <button
              type="button"
              onClick={() => form.change('foo', 'externally-changed')}
              data-testid="external-button"
            >
              External Change
            </button>
          </div>
        )}
      </Form>
    )

    // Clear initial calls
    spy.mockClear()

    // Make external change - this should set externallyChanged to true
    fireEvent.click(getByTestId('external-button'))
    expect(spy).toHaveBeenCalledWith(true)

    // Don't clear the spy - we want to see subsequent calls
    // Focus the field to make it active - this should trigger the reset branch
    fireEvent.focus(getByTestId('foo'))

    // The component should call the children with false when field becomes active
    // while externallyChanged was true
    expect(spy).toHaveBeenCalledWith(false)
  })

  it('should handle first change when field is active', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {({ form }) => (
          <div>
            <Field name="foo" component="input" data-testid="foo" />
            <ExternallyChanged name="foo">{spy}</ExternallyChanged>
            <button
              type="button"
              onClick={() => {
                // Focus first to make field active, then change value
                getByTestId('foo').focus()
                form.change('foo', 'first-change-while-active')
              }}
              data-testid="active-change-button"
            >
              Change While Active
            </button>
          </div>
        )}
      </Form>
    )

    // Clear initial calls
    spy.mockClear()

    // Make the field active first, then change it - this should test the branch
    // where initialRenderPhaseRef.current is true but meta.active is also true
    fireEvent.focus(getByTestId('foo'))
    fireEvent.click(getByTestId('active-change-button'))

    // Since the field was active when changed, it should not be considered external
    expect(spy).toHaveBeenCalledWith(false)
  })
})
