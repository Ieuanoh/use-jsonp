# react-usejsonp

A custom React hook for making [JSONP](https://en.wikipedia.org/wiki/JSONP) requests.

## Installation

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save react-usejsonp
```

(or [yarn](https://yarnpkg.com/)):

```sh
$ yarn add react-usejsonp
```

## Example

Make a request to a server that supports jsonp.

```js
import React from 'react';
import useJSONP from 'use-jsonp';

const MailchimpForm = () => {

    type MailchimpResponse = {
        msg: string
        result: "success" | "error"
    }

    const sendJsonP = useJSONP<MailchimpResponse>({
        url: 'https://somemailchimpaccount.us12.list-manage.com/subscribe/post-json?u=###&FNAME=bobby&EMAIL=bobby@somedomain.com',
        id: 'mailchimpScript,
        callback: data => console.log(data),
        callbackParam: "c",
    })

    return (
        <form onSubmit={() => sendJsonP()}>...</form>
    )
}
```
