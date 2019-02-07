import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Form } from 'react-final-form'
import OnBlur from './OnBlur'

const onSubmitMock = () => {}

describe('OnBlur', () => {
  it('should not call listener on first render', () => {
    const spy = jest.fn()
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {() => <OnBlur name="foo">{spy}</OnBlur>}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
  })

  it('should not call listener on focus', () => {
    const spy = jest.fn()
    let focus
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {props => {
          focus = props.form.focus
          return <OnBlur name="foo">{spy}</OnBlur>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    focus('foo')
    expect(spy).not.toHaveBeenCalled()
  })

  it('should call listener on blur', () => {
    const spy = jest.fn()
    let blur
    let focus
    TestUtils.renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        {props => {
          blur = props.form.blur
          focus = props.form.focus
          return <OnBlur name="foo">{spy}</OnBlur>
        }}
      </Form>
    )
    expect(spy).not.toHaveBeenCalled()
    focus('foo')
    expect(spy).not.toHaveBeenCalled()
    blur('foo')
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })
})
