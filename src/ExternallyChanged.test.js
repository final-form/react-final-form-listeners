import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Form } from 'react-final-form'
import ExternallyChanged from './ExternallyChanged'

const onSubmitMock = () => {}

describe('ExternallyChanged', () => {
  it('should be false on first render', () => {
    const spy = jest.fn(() => <div />)
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {() => <ExternallyChanged name="foo">{spy}</ExternallyChanged>}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

  it('should remain false when value changes while active', () => {
    const spy = jest.fn(() => <div />)
    let focus
    let change
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {props => {
          focus = props.form.focus
          change = props.form.change
          return <ExternallyChanged name="foo">{spy}</ExternallyChanged>
        }}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toBe(false)
    focus('foo')
    expect(spy).toHaveBeenCalledTimes(2)
    change('foo', 'bar')
    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy.mock.calls[3][0]).toBe(false)
  })

  it('should change to true when value changes while not active', () => {
    const spy = jest.fn(() => <div />)
    let change
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {props => {
          change = props.form.change
          return <ExternallyChanged name="foo">{spy}</ExternallyChanged>
        }}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toBe(false)
    change('foo', 'bar')
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0]).toBe(true)
  })

  it('should go back to false when field modified while active', () => {
    const spy = jest.fn(() => <div />)
    let focus
    let change
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} subscription={{}}>
        {props => {
          focus = props.form.focus
          change = props.form.change
          return <ExternallyChanged name="foo">{spy}</ExternallyChanged>
        }}
      </Form>
    )
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0][0]).toBe(false)
    change('foo', 'bar')
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy.mock.calls[2][0]).toBe(true)
    focus('foo')
    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy.mock.calls[3][0]).toBe(true)
    change('foo', 'baz')
    expect(spy).toHaveBeenCalledTimes(6)
    expect(spy.mock.calls[5][0]).toBe(false)
  })
})
