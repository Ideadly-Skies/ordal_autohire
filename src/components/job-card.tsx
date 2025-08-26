export default function JobCard() {
  return (
    <>
      {/* <Link href={`/detail/${job.id}`}> */}
      <div className="h-auto p-4 rounded-lg border border-zinc-300 hover:border-zinc-500 dark:border-zinc-600 flex flex-col justify-between gap-2">
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDjNcCqxkgypVZtbV3j0BS8061_nZKAXvE3Q&s"
            alt="gambar bendera"
            className="w-1/5 h-9 object-cover rounded-md"
          />
          <div>
            <h2 className="text-xl font-semibold">One Piece</h2>
            <p className="text-sm text-gray-500">Contoh deskripsi</p>
          </div>
          <div>📕</div>
        </div>
        <div>
          <p>👮‍♂️ Kontrak</p>
          <p>📍 On site . Jakarta</p>
          <p>💼 Min. 4 years of experience</p>
          <p>💰 Negotiable</p>
        </div>
        <div className="mt-2 bg-zinc-400 px-[-5px]">
          <p>Rekruter aktif 1m lalu</p>
        </div>
      </div>
      {/* </Link> */}
    </>
  );
}
