import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";

import ListBooks from "./components/ListBooks";
import SearchBooks from "./components/SearchBooks";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load books (makes refresh persistent)
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const all = await BooksAPI.getAll();
        if (active) setBooks(Array.isArray(all) ? all : []);
      } catch (e) {
        console.error("BooksAPI.getAll failed:", e);
        if (active) setBooks([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  // One handler for BOTH main + search
  const onShelfChange = useCallback(async (book, newShelf) => {
    try {
      await BooksAPI.update(book, newShelf);

      setBooks((prev) => {
        const exists = prev.some((b) => b.id === book.id);

        // remove from shelves if "none"
        if (newShelf === "none") {
          return prev.filter((b) => b.id !== book.id);
        }

        const updated = { ...book, shelf: newShelf };

        // update existing
        if (exists) {
          return prev.map((b) => (b.id === book.id ? updated : b));
        }

        // add new from search
        return [...prev, updated];
      });
    } catch (e) {
      console.error("BooksAPI.update failed:", e);
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <ListBooks books={books} loading={loading} onShelfChange={onShelfChange} />
          }
        />
        <Route
          path="/search"
          element={
            <SearchBooks booksOnShelves={books} onShelfChange={onShelfChange} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;