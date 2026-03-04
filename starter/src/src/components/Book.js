import PropTypes from "prop-types";
import BookShelfChanger from "./BookShelfChanger";

export default function Book({ book, onShelfChange }) {
  const thumbnail =
    book?.imageLinks?.thumbnail || book?.imageLinks?.smallThumbnail || "";

  const authors = Array.isArray(book.authors) ? book.authors.join(", ") : "";

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
            backgroundColor: thumbnail ? "transparent" : "#eaeaea",
          }}
        />
        <BookShelfChanger book={book} onShelfChange={onShelfChange} />
      </div>

      <div className="book-title">{book.title || "Untitled"}</div>
      <div className="book-authors">{authors || "Unknown author"}</div>
    </div>
  );
}

Book.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    shelf: PropTypes.oneOf(["currentlyReading", "wantToRead", "read", "none"]),
    imageLinks: PropTypes.shape({
      thumbnail: PropTypes.string,
      smallThumbnail: PropTypes.string,
    }),
  }).isRequired,
  onShelfChange: PropTypes.func.isRequired,
};