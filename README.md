# ts-post

<div style="text-align: center;">

![](ts-post.png "ts-post logo")

</div>

<p style="text-align: center;">
	<b>Flexible PubSub messaging bus system for node and browser applications.</b>
	<br/>
	<br/>
	<a href="https://github.com/JasonMejane/ts-post">
		<img src="https://img.shields.io/github/v/release/JasonMejane/ts-post" alt="Release" />
	</a>&nbsp;
	<a href="https://www.npmjs.com/ts-post">
    	<img src="https://img.shields.io/npm/v/ts-post.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="ts-post on npm" />
	</a>&nbsp;
	<span>
		<img src="https://img.shields.io/bundlephobia/min/ts-post" alt="Package size" />
	</span>&nbsp;
	<a href="https://github.com/JasonMejane/ts-post/blob/master/LICENSE">
		<img src="https://img.shields.io/github/license/JasonMejane/ts-post" alt="Licence" />
	</a>
	<span>
		<img src="https://img.shields.io/badge/dependencies-0-success" alt="Dependencies" />
	</span>&nbsp;
	<a href="https://github.com/JasonMejane/ts-post/issues">
		<img src="https://img.shields.io/github/issues/JasonMejane/ts-post" alt="Issues" />
	</a>&nbsp;
	<br/>
	<span>
		<img src="https://github.com/JasonMejane/ts-post/actions/workflows/nodejs_ci_main.yml/badge.svg" alt="Node.js CI" />
	</span>&nbsp;
	<span>
		<img src="https://img.shields.io/badge/coverage-100%25-success" alt="Coverage" />
	</span>&nbsp;
</p>

## Install

In terminal, run:
```sh
npm i ts-post
```

## Basic usage

<b>ts-post</b> allows you to create multiple buses to better segment and handle what messages the subscribers will receive or not.
This encourages you to have a well defined type for message data going through each bus, helping limiting potential errors where callbacks would have tried to handle different objects than expected.
The singleton instance of Port has to be created globally, in order to be accessible everywhere in your app without risk of undelivered messages.
By default, a bus named `default` is created.

### Import

```typescript
import { Message, Post, Subscription } from 'ts-post';
```

### Example

```typescript
const post = Post.getInstance;

// Create a new bus called busA, which will dispatch messages only to busA subcribers
post.createBus('bus_A');

// Subscribe to the bus
const sub = post.subscribe('bus_A', {
    callback: (message: Message) => {
        console.log(`Message timestamp: ${message.getTimestamp()} - issuer: ${message.getTimestamp()}`);
        doSomethingWithData(message.getData());
    },
    errorHandler: (error) => { console.error(error); }
});

// Publish a message into the bus
post.publish('bus_A', new Message('some data', 'FooService'));

// Unsubscribe
sub.unsubscribe();
```


## Options and data

### Subscriber
The available options are:
- `callback` (required): the callback to execute when receiving a message
- `errorHandler` (optional): the callback to execute in case of exception while executing the callback
- `delay` (optional): the delay before executing the callback
  - If undefined, the callback will be executed immediatly and synchronously (according to its order in the subscribers list)
  - If >= 0, the callback will be put in the event loop using `setTimeout`

When subscribing, the returned subscriber can call `.unsubscribe()` to remove the subscription to the bus.

### Message
When creating a message to be published, the options are:
- `data` (required): the actual data to send
- `issuer` (optional): the app component/service/... responsible for the message publishing

The data sent is packaged with additional info:
- `getData` returns the data sent in the message
- `getTimestamp` returns the creation time (in ms) of the message
- `getIssuer` returns the issuer of the message (if defined)

## Contribute

Please feel free to suggest features or bug fix through Git issues. Pull Requests for that are also more than welcome.
