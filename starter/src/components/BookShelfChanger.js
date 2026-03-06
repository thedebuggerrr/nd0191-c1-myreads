import PropTypes from "prop-types";

export default function BookShelfChanger({ book, onShelfChange }) {
  const shelfValue = book?.shelf || "none";

  return (
    <div className="book-shelf-changer">
      <select value={shelfValue} onChange={(e) => onShelfChange(book, e.target.value)}>
        <option value="move" disabled>
          Move to...
        </option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    </div>
  );
}

BookShelfChanger.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    shelf: PropTypes.oneOf(["currentlyReading", "wantToRead", "read", "none"]),
  }).isRequired,
  onShelfChange: PropTypes.func.isRequired,
};