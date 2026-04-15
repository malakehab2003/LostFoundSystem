import { Button } from "@heroui/react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import '@fortawesome/fontawesome-free/css/all.min.css';
import photoHome from "@/assets/photo-home.jfif"
import LostPhoto from "@/assets/elastic-wristband-on-kid.webp"
import { ShoppingCart, User, Bell, Mail } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  const items = [
    { icon: ShoppingCart, label: "Shop" },
    { icon: User, label: "Dashboard" },
    { icon: Bell, label: "Alerts" },
    { icon: Mail, label: "Get Social" },
  ];
  return (
    <>
      {/* القسم الأول - الخلفية الزرقاء */}
      <div 
        className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-primary relative overflow-hidden"
      >
        {/* الأيقونات الخلفية */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-white/10 text-7xl">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className="absolute bottom-20 right-10 text-white/10 text-8xl">
            <i className="fa-solid fa-key"></i>
          </div>
          <div className="absolute top-1/3 right-20 text-white/10 text-6xl">
            <i className="fa-solid fa-mobile-alt"></i>
          </div>
          <div className="absolute bottom-1/3 left-10 text-white/10 text-7xl">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="absolute top-20 right-1/4 text-white/5 text-5xl">
            <i className="fa-solid fa-glasses"></i>
          </div>
          <div className="absolute bottom-10 left-1/3 text-white/10 text-6xl">
            <i className="fa-solid fa-clock"></i>
          </div>
        </div>

        {/* أيقونة رئيسية */}
        <div className="text-center text-7xl mb-6 z-10">
          <div className="bg-white/20 rounded-full w-28 h-28 flex items-center justify-center mx-auto backdrop-blur-sm shadow-xl">
            <i className="fa-solid fa-map-location-dot text-white text-4xl"></i>
          </div>
        </div>

        {/* العنوان الرئيسي */}
        <h1 className="text-center text-4xl md:text-7xl font-bold text-white max-w-4xl leading-tight z-10">
          We are here to help <br /> 
          <span className="text-yellow-300">find your lost</span> items
        </h1>

        {/* الوصف */}
        <p className="text-center text-lg md:text-2xl text-white/90 mt-8 max-w-3xl z-10">
          <i className="fa-solid fa-heart text-red-400 mr-2"></i>
          Day3 is a free and easy way to search 300K+ lost and found 
          things to help them return home.
        </p>

        {/* إحصائيات سريعة */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 z-10">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">300K+</div>
            <div className="text-white/80 text-sm md:text-base mt-1">
              <i className="fa-solid fa-box-open mr-1"></i> Lost items
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">85%</div>
            <div className="text-white/80 text-sm md:text-base mt-1">
              <i className="fa-solid fa-arrow-rotate-left mr-1"></i> Returned
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300">24/7</div>
            <div className="text-white/80 text-sm md:text-base mt-1">
              <i className="fa-solid fa-headset mr-1"></i> Support
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-5 mt-12 z-10">
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-colors"
          >
            <i className="fa-solid fa-circle-exclamation mr-2 text-red-500"></i>
            I lost something
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-colors backdrop-blur-sm"
          >
            <i className="fa-solid fa-hand-peace mr-2"></i>
            I found something
          </Button>
        </div>
      </div>

      
      <div className="w-full flex flex-col items-center mt-20 relative z-20 px-4">
  <div className="text-center mb-10">
    <span className="text-primary font-semibold text-sm uppercase tracking-wider">Get Started</span>
    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
      What can you do?
    </h3>
    <p className="text-gray-500 mt-3 max-w-md mx-auto">
      Choose from our services to help reunite lost items with their owners
    </p>
  </div>

  <div className=" px-6 sm:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl w-full">
    {items.map((item, index) => {
      const Icon = item.icon;
      return (
        <div
          key={index}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-30 h-30 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:text-purple-200 hover:bg-purple-700 mb-4 border border-primary/20">
            <Icon size={80} strokeWidth={2} />
          </div>
          <p className="text-base font-medium text-gray-700">
            {item.label}
          </p>
        </div>
      );
    })}
  </div>
</div>

      
      <div className="relative w-full flex justify-center items-center bg-gray-50 py-16 px-4">
        <div className="absolute top-1 right-1 w-full flex justify-center items-center bg-gray-50"> <div className="absolute top-6 right-6 z-20"> <Button className="bg-white text-primary font-semibold px-6 py-2 rounded-full shadow-md"> <i className="fa-solid fa-store mr-2"></i> Shop </Button> </div> </div>
        <Carousel opts={{ align: "start" }} className="w-full max-w-7xl">
          <CarouselContent>
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3"
              >
                <div className="p-3">
                  <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                    {/* صورة */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img
                        src={LostPhoto}
                        alt="item"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-semibold">
                        Found
                      </span>
                    </div>

                    {/* المحتوى */}
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Lost Wallet
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <i className="fa-solid fa-location-dot"></i>
                        Cairo, Egypt
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-400">
                          2 hours ago
                        </span>
                        <button className="text-sm font-semibold text-primary hover:underline">
                          View
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      {/* القسم الثاني - Lost & Found System (مطابق للشكل المطلوب) */}
      <section className="w-full bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* الصورة */}
          <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={photoHome}
              alt="lost item"
              className="w-full h-full object-cover"
            />
          </div>

          {/* المحتوى */}
          <div>
            <p className="text-primary font-semibold mb-2">
              Lost & Found System
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Always On – In Case You Lose Something
            </h2>
            <p className="text-gray-600 mt-6 text-lg">
              Report your lost items or help others by uploading found objects.
              Our platform makes it easy to reconnect people with their belongings
              quickly and safely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Report Lost Item
              </button>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/10 transition">
                Report Found Item
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* القسم الثالث - It Takes a Community (مطابق للشكل المطلوب) */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* النص */}
          <div>
            <p className="text-gray-500 mb-2">It Takes a Community</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Help People Get Their Belongings Back
            </h2>
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              Want to help return lost items to their owners?
              Browse all reported lost items and easily connect with their owners.
              Create an account to connect with others and make a real difference.
            </p>
            <button className="mt-8 text-primary font-semibold border-b-2 border-primary pb-1 hover:opacity-80 transition">
              Search Lost & Found Items
            </button>
          </div>

          {/* الصورة */}
          <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433"
              alt="help recover items"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}