import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BookShelf from "./BookShelf";

export default function ListBooks({ books, loading, onShelfChange }) {
  const currentlyReading = books.filter((b) => b.shelf === "currentlyReading");
  const wantToRead = books.filter((b) => b.shelf === "wantToRead");
  const read = books.filter((b) => b.shelf === "read");

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>

      <div className="list-books-content">
        {loading ? (
          <p style={{ padding: 16 }}>Loading…</p>
        ) : (
          <div>
            <BookShelf title="Currently Reading" books={currentlyReading} onShelfChange={onShelfChange} />
            <BookShelf title="Want to Read" books={wantToRead} onShelfChange={onShelfChange} />
            <BookShelf title="Read" books={read} onShelfChange={onShelfChange} />
          </div>
        )}
      </div>

      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
}

ListBooks.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  onShelfChange: PropTypes.func.isRequired,
};

ListBooks.defaultProps = {
  loading: false,
};