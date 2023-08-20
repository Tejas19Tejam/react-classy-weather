import React from 'react';
function getWeatherIcon(wmoCode) {
	const icons = new Map([
		[[0], '☀️'],
		[[1], '🌤'],
		[[2], '⛅️'],
		[[3], '☁️'],
		[[45, 48], '🌫'],
		[[51, 56, 61, 66, 80], '🌦'],
		[[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
		[[71, 73, 75, 77, 85, 86], '🌨'],
		[[95], '🌩'],
		[[96, 99], '⛈'],
	]);
	const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
	if (!arr) return 'NOT FOUND';
	return icons.get(arr);
}

function convertToFlag(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
	return new Intl.DateTimeFormat('en', {
		weekday: 'short',
	}).format(new Date(dateStr));
}

class App extends React.Component {
	state = {
		location: 'Mumbai',
		isLoading: false,
		weather: {},
		displayLocation: '',
	};

	// Handle input
	handleInput = (e) => {
		this.setState({ location: e.target.value });
	};

	// async fetchWeather() {
	fetchWeather = async () => {
		if (this.state.location.length < 2)
			return this.setState({ weather: {} });
		try {
			this.setState({ isLoading: true });
			// 1) Getting location (geocoding)
			const geoRes = await fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
			);
			const geoData = await geoRes.json();

			if (!geoData.results) throw new Error('Location not found');

			const { latitude, longitude, timezone, name, country_code } =
				geoData.results.at(0);
			this.setState({
				displayLocation: `${name} ${convertToFlag(country_code)}`,
			});

			// 2) Getting actual weather
			const weatherRes = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
			);
			const weatherData = await weatherRes.json();
			this.setState({ weather: weatherData.daily });
		} catch (err) {
			console.error(err);
		} finally {
			this.setState({ isLoading: false });
		}
	};

	// Need to fetchWeather when component first render/mount
	// same as useEffect with empty dependency array .
	componentDidMount() {
		// this.fetchWeather();
		const res = localStorage.getItem('location');
		if (res !== 'null') this.setState({ location: res });
	}

	// To sync the component when dependency array has been changed
	// Only run on re-render
	// We can access previous props and state
	componentDidUpdate(prevProps, prevState) {
		if (this.state.location !== prevState.location) {
			this.fetchWeather();
			localStorage.setItem('location', this.state.location);
		}
	}

	render() {
		return (
			<div className='app'>
				<h2>Classy Weather</h2>
				<div>
					<Input
						location={this.state.location}
						onChangeInput={this.handleInput}
					/>
				</div>
				<button onClick={this.fetchWeather}>Get weather</button>
				{this.state.isLoading && <p className='loader'>Loading...</p>}
				{this.state.weather.weathercode && (
					<Weather
						weather={this.state.weather}
						location={this.state.displayLocation}
					/>
				)}
			</div>
		);
	}
}

export default App;

class Input extends React.Component {
	render() {
		return (
			<input
				type='text'
				placeholder='Search from location ...'
				value={this.props.location}
				onChange={(e) => this.props.onChangeInput(e)}
			/>
		);
	}
}

class Weather extends React.Component {
	// This will run when component will unmount
	// THis will not run's between render

	componentWillUnmount() {
		console.log('Weather component will unmount ');
	}
	render() {
		const {
			temperature_2m_max: maxTemp,
			temperature_2m_min: minTemp,
			weathercode: codes,
			time: dates,
		} = this.props.weather;
		console.log(this.props);
		return (
			<div>
				<h2>Weather {this.props.location}</h2>
				<ul className='weather'>
					{dates.map((date, i) => (
						<Day
							date={date}
							key={date}
							maxTemp={maxTemp.at(i)}
							minTemp={minTemp.at(i)}
							code={codes.at(i)}
							isToday={i === 0}
						/>
					))}
				</ul>
			</div>
		);
	}
}

class Day extends React.Component {
	render() {
		const { date, maxTemp, minTemp, code, isToday } = this.props;
		return (
			<li className='day'>
				<span>{getWeatherIcon(code)}</span>
				<p>{isToday ? 'Today' : formatDay(date)}</p>
				<p>
					{Math.floor(minTemp)}&deg; &mdash;
					<strong>{Math.ceil(maxTemp)}&deg;</strong>
				</p>
			</li>
		);
	}
}
