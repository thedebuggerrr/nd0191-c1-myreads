import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";

export default function SearchBooks({ booksOnShelves, onShelfChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const shelfById = useMemo(() => {
    const map = new Map();
    booksOnShelves.forEach(b => map.set(b.id, b.shelf));
    return map;
  }, [booksOnShelves]);

  useEffect(() => {
    let active = true;
    const q = query.trim();

    if (!q) {
      if (active) setResults([]);
      return () => { active = false; };
    }

    (async () => {
      try {
        const res = await BooksAPI.search(q, 20);
        const list = Array.isArray(res) ? res : [];
        const merged = list.map(b => ({
          ...b,
          shelf: shelfById.get(b.id) || "none"
        }));
        if (active) setResults(merged);
      } catch {
        if (active) setResults([]);
      }
    })();

    return () => { active = false; };
  }, [query, shelfById]);

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to="/">Close</Link>
        <div className="search-books-input-wrapper">
         
<input
  id="search-input"
  name="search-input"
  type="text"
  placeholder="Search by title or author"
  value={query}
  onChange={e => setQuery(e.target.value)}
  autoComplete="off"
/>

        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {results.map(book => (
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
  booksOnShelves: PropTypes.array.isRequired,
  onShelfChange: PropTypes.func.isRequired
};