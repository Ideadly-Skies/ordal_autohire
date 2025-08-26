export default function Page() {
  return (
    <>
      <div className="flex justify-between px-5 md:flex-row flex-col gap-3">
        <input
          type="text"
          className="border py-1 px-2 w-full md:w-5/8 dark:border-amber-50 rounded-sm"
          placeholder="Search by job, title, company, & skills.."
        />
        <button className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded">
          Search
        </button>
        <button className="bg-amber-500 hover:bg-amber-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded">
          Auto-Apply to All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 px-4">
        {/* <Link href={`/detail/${job.id}`}> */}
        <div className="h-auto p-4 rounded-lg border border-zinc-300 hover:border-zinc-500 dark:border-zinc-600 flex flex-col justify-between">
          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDjNcCqxkgypVZtbV3j0BS8061_nZKAXvE3Q&s"
              alt="gambar bendera"
              className="w-full h-48 object-cover rounded-md"
            />
            <div>
              <h2 className="text-2xl font-semibold mt-3">One Piece</h2>
              <p className="text-sm text-gray-500">Contoh deskripsi</p>
            </div>
          </div>
          <div>
            <button className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-md mt-3 hover:cursor-pointer">
              Read More
            </button>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </>
  );
}
