import React from 'react';

class Counter extends React.Component {
	// declaring state
	constructor(props) {
		super(props);
		// Only one big state property
		this.state = { count: 5, name: 'vasudev' };
		// Binding handleIncrease method to current component instance
		this.handleIncrease = this.handleIncrease.bind(this);
		this.handleDecrease = this.handleDecrease.bind(this);
	}

	// Defining handlers functions
	// Handlers functions are define as class-methods
	// this - points to the component instance of counter class .
	handleIncrease() {
		// Updating state based on current state
		this.setState((current) => {
			console.log(current);
			return { count: current.count + 1 };
		});
	}

	handleDecrease() {
		// Updating state based on current state
		this.setState((current) => {
			console.log(current);
			return { count: current.count - 1 };
		});
	}

	// Every React class component must include render method
	// This method return some JSX.
	render() {
		const date = new Date('August 01 2023');
		date.setDate(date.getDate() + this.state.count);

		return (
			<div>
				<button onClick={this.handleDecrease}>-</button>
				<span>{date.toDateString()}</span>
				<button onClick={this.handleIncrease}>+</button>
				<p>{[this.state.count + 1]}</p>
			</div>
		);
	}
}

export default Counter;
