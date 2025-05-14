import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="container mx-auto flex flex-col lg:flex-row px-4 sm:px-6 lg:px-14 items-center gap-8 py-12">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Innovative <span className="text-blue-600">Solutions for Your</span>{" "}
          Business
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8">
          We help companies transform their ideas into successful digital
          products
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-600 text-lg px-8 py-5 rounded-3xl relative 
                  before:absolute hover:before:inset-[-4px] before:inset-[-6px] before:rounded-[calc(1.5rem+4px)] 
                  before:border-2 before:border-blue-400 before:opacity-70 
                  hover:before:opacity-100 before:transition-opacity 
                  hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </Button>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center">
        <div className="relative w-full flex justify-center">
          <div className="w-32 sm:w-40 md:w-56 z-20 bg-black relative rounded-2xl overflow-hidden aspect-[9/16] shadow-xl shadow-gray-900/30">
            <Image
              alt="Hero 1"
              src={"/hero/hero1.jpg"}
              width={400}
              height={400}
              className="absolute w-full h-full object-cover inset-0"
            />
            <span className="absolute z-10 text-white bottom-2 left-4 text-sm font-bold">
              Digital Innovation
            </span>
          </div>
          <div className="w-32 sm:w-40 md:w-56 z-10 -translate-x-5 rotate-[12deg] bg-black relative rounded-2xl overflow-hidden aspect-[9/16] shadow-xl shadow-gray-900/30">
            <Image
              alt="Hero 2"
              src={"/hero/hero2.jpg"}
              width={400}
              height={400}
              className="absolute w-full h-full object-cover inset-0"
            />
            <span className="absolute z-10 text-white bottom-2 left-4 text-sm font-bold">
              Tech Solutions
            </span>
          </div>
          <div className="w-32 sm:w-40 md:w-56 -translate-x-10 rotate-[17deg] translate-y-19 bg-black relative rounded-2xl overflow-hidden aspect-[9/16] shadow-xl shadow-gray-900/30">
            <Image
              alt="Hero 3"
              src={"/hero/hero3.jpg"}
              width={400}
              height={400}
              className="absolute w-full h-full object-cover inset-0"
            />
            <span className="absolute z-10 text-white bottom-2 left-4 text-sm font-bold">
              Future Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
