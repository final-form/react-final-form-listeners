import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Form } from 'react-final-form'
import OnChange from './OnChange'

const onSubmitMock = () => {}

describe('OnChange', () => {
  it('should not call listener on first render', () => {
    const spy = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {() => <OnChange name="foo">{spy}</OnChange>}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener when going from uninitialized to value', () => {
    const spy = jest.fn()
    let change
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {props => {
          change = props.form.change
          return <OnChange name="foo">{spy}</OnChange>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    change('foo', 'bar')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('bar', '')
  })

  it('should call listener when going from initialized to value', () => {
    const spy = jest.fn()
    let change
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {props => {
          change = props.form.change
          return <OnChange name="foo">{spy}</OnChange>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    change('foo', 'baz')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('baz', 'bar')
  })

  it('should call listener when changing to null', () => {
    const spy = jest.fn()
    let change
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: 'bar' }}>
        {props => {
          change = props.form.change
          return <OnChange name="foo">{spy}</OnChange>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    change('foo', null)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(null, 'bar')
  })
})
