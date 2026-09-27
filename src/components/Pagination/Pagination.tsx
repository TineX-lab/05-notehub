import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const SafePaginate =
  (ReactPaginate as unknown as { default?: typeof ReactPaginate }).default ||
  ReactPaginate;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <SafePaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      previousLabel="<"
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
