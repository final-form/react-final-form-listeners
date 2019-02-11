import React from 'react'
import TestUtils from 'react-dom/test-utils'
import { Form, Field } from 'react-final-form'
import { render, fireEvent } from 'react-testing-library'
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

  it('should handle quick subsiquent changes properly', async () => {
    const kids = [
      {
        name: 'Boy(s)'
      },
      {
        name: 'Girl(s)'
      }
    ]
    const { getByLabelText } = render(
      <Form onSubmit={onSubmitMock}>
        {({ form }) => (
          <React.Fragment>
            <Field name="selectAll" type="checkbox">
              {({ input }) => (
                <div>
                  <label htmlFor="both">Both</label>
                  <input {...input} id="both" type="checkbox" />
                  <OnChange name="selectAll">
                    {next => {
                      if (next) {
                        return form.change('kids', kids.map(({ name }) => name))
                      } else {
                        return form.change('kids', undefined)
                      }
                    }}
                  </OnChange>
                </div>
              )}
            </Field>
            {kids.length > 0 &&
              kids.map((kid, index) => {
                return (
                  <Field
                    key={index}
                    name="kids"
                    value={kid.name}
                    type="checkbox"
                  >
                    {({ input, meta: { active } }) => (
                      <div>
                        <label htmlFor={index}>{kid.name}</label>
                        <input {...input} id={index} type="checkbox" />

                        <OnChange name="kids">
                          {next => {
                            if (active) {
                              return form.change('selectAll', next.length === 2)
                            }
                          }}
                        </OnChange>
                      </div>
                    )}
                  </Field>
                )
              })}
          </React.Fragment>
        )}
      </Form>
    )
    const all = getByLabelText('Both')
    const boys = getByLabelText('Boy(s)')
    const girls = getByLabelText('Girl(s)')
    fireEvent.click(boys)
    fireEvent.click(girls)
    expect(girls.checked).toBe(true)
    expect(all.checked).toBe(girls.checked)
  })
})
