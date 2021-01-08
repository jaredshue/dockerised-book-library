import React from "react";

class InfoView extends React.Component {
    constructor({ movieID, userID }) {
        super();

        this.state = {
            userID: userID,
            movieID: movieID,
            movie: {},
            checkedByMe: false
        }
    }

    async componentDidMount() {
        var response = await fetch(`http://localhost:3001/api/books/${this.state.movieID}`);
        var book = await response.json();

        this.setState({
            ...this.state,
            movie: book,
            checkedByMe: this.state.userID === book.checkedOutBy && book.isCheckedOut
        });
    }

    render() {
        var checkoutBook = async () => {
            var response = await fetch(`http://localhost:3001/api/books/${this.state.movieID}/checkout/${this.state.userID}`);
            if (response.status === 200) {
                response = await fetch(`http://localhost:3001/api/books/${this.state.movieID}`);
                var book = await response.json();
                this.setState({ ...this.state, movie: book, checkedByMe: true });
            }

        }

        var returnBook = async () => {
            var response = await fetch(`http://localhost:3001/api/books/${this.state.movieID}/return`);
            if (response.status === 200) {
                response = await fetch(`http://localhost:3001/api/books/${this.state.movieID}`);
                var book = await response.json();
                this.setState({ ...this.state, movie: book, checkedByMe: false });
            }
        }

        var message = null;

        if (this.state.movie.isCheckedOut) {
            if (this.state.movie.checkedOutBy !== this.state.userID) {
                message = (
                    <a id="info-view-back-home" className="alert warning">
                        This book has been checked out by another user. Please check back on { this.state.movie.dateDue }.
                    </a>
                );
            }
            else {
                message = (
                    <a id="info-view-back-home" className="alert warning">
                        You have already checked out this book. Please return it on { this.state.movie.dateDue }.
                    </a>
                );
            }
        }

        return (
            <div id="info-view" className="info-view active">
                { message }
                { this.state.checkedByMe }
                <section className="info-view-movie">
                    <img id="info-view-movie-cover-art" src={ this.state.movie.cover } alt={ this.state.movie.title } width="500" height="600" />
                    <section>
                        <h1 id="info-view-movie-name" className="info-view-movie-name">{ this.state.movie.title } by { this.state.movie.author }</h1>
                        <h2 id="info-view-movie-released">{ this.state.movie.pages } pages | ISBN: { this.state.movie.isbn }</h2>
                    </section>
                </section>
                <section className="info-view-comment">
                    <form>
                        {
                            !this.state.movie.isCheckedOut
                            ? <button className="simple-button info" type="button" onClick={ checkoutBook }>Checkout</button>
                            : null
                        }
                        {
                            this.state.checkedByMe
                            ? <button className="simple-button info" type="button" onClick={ returnBook }>Return</button>
                            : null
                        }
                    </form>
                </section>
            </div>
        );
    }
}

export default InfoView;
