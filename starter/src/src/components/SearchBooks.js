import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";

export default function SearchBooks({ booksOnShelves, onShelfChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // lookup: id -> shelf
  const shelfById = useMemo(() => {
    const map = new Map();
    booksOnShelves.forEach((b) => map.set(b.id, b.shelf));
    return map;
  }, [booksOnShelves]);

  useEffect(() => {
    let active = true;
    const requestId = { current: 0 };
    requestId.current += 1;
    const currentRequest = requestId.current;

    async function runSearch() {
      const trimmed = query.trim();

      // b) Clear results if input empty
      if (!trimmed) {
        if (active) setResults([]);
        return;
      }

      try {
        const res = await BooksAPI.search(trimmed, 20);

        // c) Invalid query => clear results (Udacity API may return {error: "..."} )
        if (!Array.isArray(res)) {
          if (active && currentRequest === requestId.current) setResults([]);
          return;
        }

        // merge shelf data
        const merged = res.map((book) => ({
          ...book,
          shelf: shelfById.get(book.id) || "none",
        }));

        if (active && currentRequest === requestId.current) {
          setResults(merged);
        }
      } catch (e) {
        console.error("Search failed:", e);
        if (active) setResults([]);
      }
    }

    runSearch();

    return () => {
      active = false;
    };
  }, [query, shelfById]);

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">
          Close
        </Link>

        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="search-books-results">
        <ol className="books-grid">
          {results.map((book) => (
            <li key={book.id}>
              <Book book={book} onShelfChange={onShelfChange} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

SearchBooks.propTypes = {
  booksOnShelves: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      shelf: PropTypes.oneOf(["currentlyReading", "wantToRead", "read", "none"]),
    })
  ).isRequired,
  onShelfChange: PropTypes.func.isRequired,
};