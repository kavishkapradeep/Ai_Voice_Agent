import { Button } from "@/components/ui/button";
import { Book, LibraryBig, MicVocal, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function WelcomePage() {
  return (
    <div>
      <div className=" border py-8 rounded-xl bg-slate-100 border-gray-500">
        <div>
          <h2 className=" text-center text-3xl md:text-5xl font-bold">
            REVOLUTIONIZE LEARNING WITH
          </h2>
        </div>
        <div className=" mt-7 flex  gap-4 items-center justify-center flex-col" >
        <div className=" mt-7 flex  gap-4 justify-center">
            <h2  className=" md:text-5xl  text-3xl  bg-clip-text flex  font-extrabold text-transparent  bg-gradient-to-tr from-blue-200 to-purple-600  ">Ai-Powered Voice Agent</h2>
          <Image src='/books.png' alt="books" width={20} height={20} className=" w-10"/>
          <Image src='/microphone.png' alt="books" width={20} height={20} className=" w-6"/>
        
        </div>
        <Link href={'/Dashboard'}>
        <Button className='w-24  bg-black'  >Get Started</Button>
        </Link>
        </div>
      </div>
      <div className=" flex items-center justify-center">
        <Image src='/voice.gif' width={270} height={70} alt="gif" className="  items-center "></Image>
      </div>
    </div>
  );
}
export default WelcomePage;
