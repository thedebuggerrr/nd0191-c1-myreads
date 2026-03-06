import PropTypes from "prop-types";

export default function Book({ book, onShelfChange }) {
  const raw =
    book?.imageLinks?.thumbnail ||
    book?.imageLinks?.smallThumbnail ||
    "";
  const cover = raw.startsWith("http://") ? raw.replace(/^http:\/\//i, "https://") : raw;

  const title = book?.title || "Untitled";
  const authors = Array.isArray(book?.authors) ? book.authors.join(", ") : "";
  const shelf = book?.shelf || "none";

  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, overflow: "hidden", borderRadius: 2 }}>
          {cover ? (
            <img
              src={cover}
              alt={title}
              width={128}
              height={193}
              style={{ display: "block", width: 128, height: 193, objectFit: "cover" }}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div style={{ width: 128, height: 193, background: "#eee" }} />
          )}
        </div>
        <div className="book-shelf-changer">
          <select
            id={`shelf-${book.id}`}
            name="book-shelf"
            value={shelf}
            onChange={(e) => onShelfChange(book, e.target.value)}
          >
            <option value="move" disabled>Move to…</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors}</div>
    </div>
  );
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  onShelfChange: PropTypes.func.isRequired
};