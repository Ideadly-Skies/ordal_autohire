import FileUpload from "@/components/file-upload";
import { HeroHeader } from "@/components/header";

const page = () => {
  return (
    <>
      <HeroHeader />
      <div className="flex w-full h-screen items-center justify-center">
        <FileUpload />
      </div>
    </>
  );
};

export default page;
