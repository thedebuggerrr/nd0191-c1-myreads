import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders app title and Add a book link on main page", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // Title
  expect(screen.getByText(/MyReads/i)).toBeInTheDocument();

  // "Add a book" control (Link)
  expect(
    screen.getByRole("link", { name: /add a book/i })
  ).toBeInTheDocument();
});