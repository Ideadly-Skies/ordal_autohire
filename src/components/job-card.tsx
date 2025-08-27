import { FaRegBookmark } from "react-icons/fa";
import { PiBag, PiMapPinLight, PiMoneyLight } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

export default function JobCard() {
  return (
    <>
      {/* <Link href={`/detail/${job.id}`}> */}
      <div className="h-auto rounded-lg border border-zinc-300 hover:border-zinc-500 dark:border-zinc-600 flex flex-col justify-between">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDjNcCqxkgypVZtbV3j0BS8061_nZKAXvE3Q&s"
              alt="gambar bendera"
              className="w-1/5 h-9 object-cover rounded-md self-center"
            />
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold text-nowrap">
                Frozen Inventory Senior
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 inline-flex items-center gap-px">
                ASTRO <MdVerified className="inline-block text-green-600" />
              </p>
            </div>
            <div className="hover:cursor-pointer">
              <FaRegBookmark />
            </div>
          </div>
          <div>
            <p>
              <IoPersonOutline className="inline" /> Kontrak
            </p>
            <p>
              <PiMapPinLight className="inline" /> On site . Jakarta
            </p>
            <p>
              <PiBag className="inline" /> Min. 4 years of experience
            </p>
            <p>
              <PiMoneyLight className="inline" /> Negotiable
            </p>
          </div>
        </div>
        <div className="bg-zinc-100 py-1 px-4 rounded-b-lg dark:text-black">
          <p>Rekruter aktif 1m lalu</p>
        </div>
      </div>
      {/* </Link> */}
    </>
  );
}
