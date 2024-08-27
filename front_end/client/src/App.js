import React from "react";
// We have created a component called MainContainer.js in our directory.
// In order to use it in App.js, we have to import it. Note that you don't
// need to add .js to the file name at the end (so the last part doesn't have
// to be /MainContainer.js)
import MainContainer from "./components/MainContainer/MainContainer";
import Login from "./components/Login/Login";
import SignIn from "./components/Login/SignIn";
import LoginSecond from "./components/Login/LoginSecond";
import LoginThird from "./components/Login/LoginThird";
//import LoadData from "./components/LoadData/LoadData";

class App extends React.Component {

	render() {
		return (
			<div>
				<header>
					This is my website!
				</header>

				<main>
					{this.props.children}
				</main>

				<footer>
					Your copyright message
				</footer>
			</div>
		);
	}
}

// function App() {
// 	return (
// 		<div className="App">
// 			{
// 				// This comment is in reference to using MainContainer below. As you can see,
// 				// we use it just like an HTML tag, except we can pass in "props". In this case
// 				// we are passing a random message in it. In MainContainer.js, you can see how we
// 				// use this field
// 			}
// 			<LoginSecond message="Hello World" />
// 		</div>
// 	);
//
// 	function render() {
// 		return (
// 			<div>
// 				<header>
// 					This is my website!
// 				</header>
//
// 				<main>
// 					{this.props.children}
// 				</main>
//
// 				<footer>
// 					Your copyright message
// 				</footer>
// 			</div>
// 		);
// 	}
// }

//<MainContainer message="Hello World" />
export default App;
