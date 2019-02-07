import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Form } from 'react-final-form'
import OnFocus from './OnFocus'

const onSubmitMock = () => {}

describe('OnFocus', () => {
  it('should not call listener on first render', () => {
    const spy = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => <OnFocus name="foo">{spy}</OnFocus>}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener on focus', () => {
    const spy = jest.fn()
    let focus
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {props => {
          focus = props.form.focus
          return <OnFocus name="foo">{spy}</OnFocus>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    focus('foo')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })

  it('should not call listener on blur', () => {
    const spy = jest.fn()
    let blur
    let focus
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {props => {
          blur = props.form.blur
          focus = props.form.focus
          return <OnFocus name="foo">{spy}</OnFocus>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    focus('foo')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
    blur('foo')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should call listener on subsequent focuses', () => {
    const spy = jest.fn()
    let blur
    let focus
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {props => {
          blur = props.form.blur
          focus = props.form.focus
          return <OnFocus name="foo">{spy}</OnFocus>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    focus('foo')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()

    blur('foo')
    expect(spy).toHaveBeenCalledTimes(1)

    focus('foo')
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
