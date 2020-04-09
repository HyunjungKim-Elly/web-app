import React from "react";
import "./Movie.css";
import propTypes from "prop-types";
import LinesEllipsis from "react-lines-ellipsis";

// class Movie extends Component{

//     static propTypes = {
//         title: propTypes.string.isRequired,
//         poster: propTypes.string.isRequired
//     }

//     render(){
//         return(
//             <div>
//                 <MoviePoster poster = {this.props.poster}/>
//                 <h1>{this.props.title}</h1>
//             </div>
//         )
//     }
// }

// class MoviePoster extends Component{
//     static propTypes = {
//         poster: propTypes.string.isRequired
//     }
//     render(){
//         return (
//           <img src={this.props.poster} alt=""></img>
//         );
//     }
// }

//functional component, no state, no render, no lifecycle

function Movie({ title, poster, genres, synopsis }) {
  return (
    <div className="Movie">
      <div className="Movie__Columns">
        <MoviePoster poster={poster} alt={title} />
      </div>
      <div className="Movie__Columns">
        <h1>{title}</h1>
        <div className="Movie__Genres">
          {genres.map((genre, index) => (
            <MovieGenre genre={genre} key={index} />
          ))}
        </div>
        <div className="Movie__Synopsis">
          <LinesEllipsis text={synopsis} maxLine="3" ellipsis="....more" trimRight basedOn="letters" />
        </div>
      </div>
    </div>
  );
}
function MoviePoster({ poster, alt }) {
  return <img src={poster} alt={alt} title={alt} className="Movie__Poster" />;
}

function MovieGenre({ genre }) {
  return <span className="Movie_Genre">{genre}</span>;
}
Movie.propTypes = {
  title: propTypes.string.isRequired,
  poster: propTypes.string.isRequired,
  genres: propTypes.array.isRequired,
  synopsis: propTypes.string.isRequired
};
//props type
MoviePoster.propTypes = {
  poster: propTypes.string.isRequired,
  alt: propTypes.string.isRequired
};

MovieGenre.propTypes = {
  genre: propTypes.string.isRequired
};
export default Movie;
