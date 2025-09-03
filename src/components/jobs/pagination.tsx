import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
  onPageChange?: (page: number) => void; // <-- add this line
};

export default function Pagination({
  currentPage,
  totalPages,
  query,
  onPageChange, // <-- receive the prop
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (page > 1) params.set("page", String(page));
    return `?${params.toString()}`;
  };

  const handlePrev = (e: React.MouseEvent) => {
    if (onPageChange && currentPage > 1) {
      e.preventDefault();
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    if (onPageChange && currentPage < totalPages) {
      e.preventDefault();
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      {onPageChange ? (
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 border-2 py-1 rounded ${
            currentPage === 1
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-200 hover:cursor-pointer"
          }`}
        >
          ◁ Prev
        </button>
      ) : (
        <Link
          href={getPageLink(currentPage - 1)}
          aria-disabled={currentPage === 1}
          className={`px-3 border-2 py-1 rounded ${
            currentPage === 1
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-200 hover:cursor-pointer"
          }`}
        >
          ◁ Prev
        </Link>
      )}
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {onPageChange ? (
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 border-2 py-1 rounded ${
            currentPage === totalPages
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-200 hover:cursor-pointer"
          }`}
        >
          Next ▷
        </button>
      ) : (
        <Link
          href={getPageLink(currentPage + 1)}
          aria-disabled={currentPage === totalPages}
          className={`px-3 border-2 py-1 rounded ${
            currentPage === totalPages
              ? "pointer-events-none opacity-50"
              : "hover:bg-gray-200 hover:cursor-pointer"
          }`}
        >
          Next ▷
        </Link>
      )}
    </div>
  );
}
