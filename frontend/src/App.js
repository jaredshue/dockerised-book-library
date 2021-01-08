import React from "react";
import "./App.css";

import InfoView from "./components/InfoView";

class App extends React.Component {
    state = {
        movies: [],
        view: "Home",
        viewMovie: 0,
        userID: 0
    };

    async componentDidMount() {
        var response = await fetch("http://localhost:3001/api/books");
        var books = await response.json();
        this.setState({ ...this.state, movies: books });
    }

    changeView = (event) => {
        if (event === undefined) {
            throw new Error("Argument undefined: 'event'");
        }

        console.log(event.target);

        if (event.target.nonce !== "" && event.target.nonce !== undefined) {
            this.setState({ view: "Info", viewMovie: parseInt(event.target.nonce) });
            return;
        }
        else if (event.target.textContent === "Back to results") {
            this.setState({ view: "Home" });
            return;
        }
        else if (event.target.textContent !== "") {
            this.setState({ view: event.target.textContent });
            return;
        }
    }

    determineView = () => {
        switch (this.state.view) {
            case "Home": {
                return (
                    <div id="movies-view" className="movies-view active">
                        <ul id="movies-view-movies">
                            {
                                this.state.movies.map((movie, index) => {
                                    return (
                                        <li key={ index } onClick={ this.changeView }>
                                            <img src={ movie.cover } alt={ movie.title } nonce={ movie.id } />
                                            <p nonce={ movie.id }>{ movie.title } by { movie.author }</p>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                );
            }
            case "Login": {
                return (
                    <div id="login-view" className="login-view">
                    </div>
                );
            }
            case "Info": {
                var movie;
                if (this.state.viewMovie !== null) {
                    movie = this.state.movies[this.state.viewMovie];
                }

                return (
                    <InfoView movieID={ movie.id } userID={ this.state.userID } />
                );
            }
        }
    }

    render() {
        const navigationBar = (
            <header className="navbar">
                <section className="navbar-logo">
                    <a href="./">BOOKS</a>
                </section>
                <section className="navbar-links">
                    <ul>
                        <li>
                            <label
                                id="navbar-links-home"
                                className={
                                    this.state.view === "Home"
                                    ? "navbar-link active"
                                    : "navbar-link" }
                                onClick={ this.changeView }>
                                Home
                            </label>
                        </li>
                        <li>
                            <label
                                id="navbar-links-login"
                                className={
                                    this.state.view === "Login"
                                    ? "navbar-link active"
                                    : "navbar-link" }
                                onClick={ this.changeView }>
                                Login
                            </label>
                        </li>
                    </ul>
                </section>
                <section className="navbar-search">
                    <div>
                        <input className="simple-textbox" type="text" placeholder="Search" />
                        <button className="simple-button outline orange" onClick={ roll }>Search</button>
                    </div>
                </section>
            </header>
        );

        var roll = () => {
            window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }

        return (
            <div className="App">
                { navigationBar }
                { this.determineView() }
            </div>
        );
    }
}

export default App;
