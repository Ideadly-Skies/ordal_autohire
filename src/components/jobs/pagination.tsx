import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  query,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (page > 1) params.set("page", String(page));
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <Link
        href={getPageLink(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`px-3 border-2 py-1 rounded ${
          currentPage === 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-gray-200"
        }`}
      >
        ◁ Prev
      </Link>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={getPageLink(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`px-3 border-2 py-1 rounded ${
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-gray-200"
        }`}
      >
        Next ▷
      </Link>
    </div>
  );
}
