# 🏁 React Final Form Listeners

[![NPM Version](https://img.shields.io/npm/v/react-final-form-listeners.svg?style=flat)](https://www.npmjs.com/package/react-final-form-listeners)
[![NPM Downloads](https://img.shields.io/npm/dm/react-final-form-listeners.svg?style=flat)](https://www.npmjs.com/package/react-final-form-listeners)
[![Build Status](https://travis-ci.org/final-form/react-final-form-listeners.svg?branch=master)](https://travis-ci.org/final-form/react-final-form-listeners)
[![codecov.io](https://codecov.io/gh/final-form/react-final-form-listeners/branch/master/graph/badge.svg)](https://codecov.io/gh/final-form/react-final-form-listeners)

---

🏁 React Final Form Listeners is a collection of useful components for listening to fields in a [🏁 React Final Form](https://github.com/final-form/react-final-form#-react-final-form).

## Installation

```bash
npm install --save react-final-form-listeners react-final-form final-form
```

or

```bash
yarn add react-final-form-listeners react-final-form final-form
```

## Usage

```jsx
import { Form, Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

const MyForm = () => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <Field name="foo" component="input" type="checkbox" /> Turn foo on?
          </label>
          <OnChange name="foo">
            {(value, previous) => {
              // do something
            }}
          </OnChange>
        </div>
        ...
      </form>
    )}
  />
)
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Components](#components)
  * [`ExternallyChanged`](#externallychanged)
    * [`name : String`](#name--string)
    * [`children: (externallyChanged: boolean) => React.Node`](#children-externallychanged-boolean--reactnode)
  * [`OnBlur`](#onblur)
    * [`name : String`](#name--string-1)
    * [`children: () => void`](#children---void)
  * [`OnChange`](#onchange)
    * [`name : String`](#name--string-2)
    * [`children: (value: any, previous: any) => void`](#children-value-any-previous-any--void)
  * [`OnFocus`](#onfocus)
    * [`name : String`](#name--string-3)
    * [`children: () => void`](#children---void-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Components

The following can be imported from `react-final-form-listeners`.

### `ExternallyChanged`

Renders is render prop with a `boolean` flag when the specified field was last updated externally (changed while not active).

#### `name : String`

The name of the field to listen to.

#### `children: (externallyChanged: boolean) => React.Node`

A render prop given the boolean flag.

### `OnChange`

Calls its `children` callback whenever the specified field changes. It renders nothing.

#### `name : String`

The name of the field to listen to.

#### `children: (value: any, previous: any) => void`

A function that will be called whenever the specified field is changed. It is passed the new value and the previous value.

### `OnFocus`

Calls its `children` callback whenever the specified field becomes active. It renders nothing.

#### `name : String`

The name of the field to listen to.

#### `children: () => void`

A function that will be called whenever the specified field is changed. It is passed the new value and the previous value.

### `OnBlur`

Calls its `children` callback whenever the specified field is blurred. It renders nothing.

#### `name : String`

The name of the field to listen to.

#### `children: () => void`

A function that will be called whenever the specified field is blurred.
