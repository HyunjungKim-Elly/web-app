import React, { Component } from "react";
import "./App.css";
import Movie from "./Movie";

class App extends Component {
  //render : componentWillMount() -> render() -> componentDidMount()

  // Update componentWillReceiveProps() -> shouldComponentUpdate() -> componentWillUpdate() -> render() -> componentDidUpdate()
  // react see "old props" and "new props" and if both are different it will execute shouldComponentUpdate() == true

  componentWillMount() {
    console.log("will mount");
  }
  state = {};
  componentDidMount() {
    this._getMovies();
    console.log("DidMount");
    // setTimeout(()=> {
    //   this.setState({
    //     greeting: 'Hello again!'
    //   })
    // }, 2000)
  }

  _getMovies = async () => {
    const movies = await this._callApi();
    this.setState({
      movies
    });
  };

  _callApi = () => {
    return fetch("https://yts.mx/api/v2/list_movies.json?sort_by=download_count")
      .then(res => res.json())
      .then(json => json.data.movies)
      .catch(err => console.log(err));
    
  };
  _renderMovies = () => {
    const movies = this.state.movies.map(movie => {
      return (
        <Movie
          title={movie.title_english}
          poster={movie.medium_cover_image}
          genres={movie.genres}
          synopsis={movie.synopsis}
          key={movie.id}
        />
      );
    }); //[<Movie props />, <Movie props />]
    return movies;
  };

  render() {
    console.log("did render");
    const { movies } = this.state;
    return (
      <div className={movies ? "App" : "App--loading"}>
        {movies ? this._renderMovies() : "Loading"}
      </div>
    );
  }
}

export default App;
