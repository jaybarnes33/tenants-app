import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen  p-24">
      <div className="grid grid-cols-2 place-items-center">
        <div className="space-y-4">
          <h1 className="text-4xl  leading-[100%]">
            A platform for everything estate management
          </h1>

          <Link href={"/estates/create"}>
            <Button className="mt-4">Get Started</Button>
          </Link>
        </div>
        <div className="h-full w-full">
          <div className="relative  h-5/6">
            <Image src={"/right.jpg"} fill alt="Right" />
          </div>
        </div>
      </div>
    </main>
  );
}
