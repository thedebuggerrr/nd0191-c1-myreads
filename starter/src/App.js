import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import ListBooks from "./components/ListBooks";
import SearchBooks from "./components/SearchBooks";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const all = await BooksAPI.getAll();
        if (isMounted) setBooks(Array.isArray(all) ? all : []);
      } catch {
        if (isMounted) setBooks([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const onShelfChange = useCallback(async (book, newShelf) => {
    await BooksAPI.update(book, newShelf);
    setBooks(prev => {
      const exists = prev.some(b => b.id === book.id);
      if (newShelf === "none") return prev.filter(b => b.id !== book.id);
      const updated = { ...book, shelf: newShelf };
      if (exists) return prev.map(b => (b.id === book.id ? updated : b));
      return [...prev, updated];
    });
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <ListBooks
              books={books}
              loading={loading}
              onShelfChange={onShelfChange}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchBooks
              booksOnShelves={books}
              onShelfChange={onShelfChange}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;