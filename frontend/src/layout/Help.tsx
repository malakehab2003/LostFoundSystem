import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Share2,
  Printer,
  Users,
  Info,
  ArrowLeft,
  ShoppingBag,
  Package,
  Heart,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HowToHelp = () => {
  const helpSteps = [
    {
      id: 1,
      icon: Eye,
      title: "Browse Lost & Found Items",
      description:
        "Explore lost and found items in your area and help reconnect people with their belongings.",
      actionText: "Browse Now",
      actionLink: "/lost",
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      bgHover: "hover:border-blue-300",
      gradient: "from-blue-600 to-blue-700",
    },
    {
      id: 2,
      icon: ShoppingBag,
      title: "Shop Our Products",
      description:
        "Discover amazing products from our collection. Every purchase helps support our mission.",
      actionText: "Shop Now",
      actionLink: "/shop",
      color: "from-green-500/10 to-green-600/5",
      iconColor: "text-green-600",
      border: "border-green-200",
      bgHover: "hover:border-green-300",
      gradient: "from-green-600 to-emerald-700",
    },
    {
      id: 3,
      icon: Printer,
      title: "Post Flyers",
      description:
        "Print flyers and place them in public areas like cafes, malls, and universities.",
      actionText: "Print Flyer",
      actionLink: "/dashboard/address",
      color: "from-orange-500/10 to-orange-600/5",
      iconColor: "text-orange-600",
      border: "border-orange-200",
      bgHover: "hover:border-orange-300",
      gradient: "from-orange-600 to-red-600",
    },
    {
      id: 4,
      icon: Users,
      title: "Organize a Search",
      description:
        "Join efforts with others and organize a community search team.",
      actionText: "Form Team",
      actionLink: "/dashboard",
      color: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600",
      border: "border-purple-200",
      bgHover: "hover:border-purple-300",
      gradient: "from-purple-600 to-indigo-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      <div className="relative overflow-hidden bg-primary py-20 px-6 text-center">
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-white text-7xl ">★</div>
          <div className="absolute bottom-10 right-10 text-white text-8xl ">✦</div>
          <div className="absolute bottom-5 left-8 text-white text-8xl ">✦</div>
          <div className="absolute top-1/2 left-1/4 text-white text-6xl ">●</div>
          <div className="absolute top-1/6 right-1/6 text-white text-6xl ">●</div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Info className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in">
            How Can You Help?
          </h1>

          <p className="mt-6 text-white/90 max-w-2xl mx-auto text-lg">
            Be part of a community that brings lost items back to their owners.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20 grid md:grid-cols-3 gap-6">
        {[
          { label: "Returned Items", value: "85%", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Happy Customers", value: "10K+", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
          { label: "Success Rate", value: "99%", icon: Shield, color: "text-green-600", bg: "bg-green-50" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Card
              key={i}
              className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer overflow-hidden"
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${s.bg} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {s.value}
                </div>
                <p className="text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* STEPS - Simple Ways to Help */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Simple Ways to Help
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Choose how you'd like to contribute to our community
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {helpSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.id}
                className={`group bg-gradient-to-br ${step.color} border ${step.border} ${step.bgHover} hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden relative cursor-pointer`}
              >
                {/* Decorative number */}
                <div className="absolute top-4 right-4 text-6xl font-bold opacity-5 text-gray-800 select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <CardHeader className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>

                  <CardTitle className="mt-6 text-xl md:text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                    {step.title}
                  </CardTitle>

                  <CardDescription className="text-gray-600 mt-3 text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button
                    asChild
                    className={`w-full rounded-xl bg-gradient-to-r ${step.gradient} hover:shadow-lg transition-all duration-300 hover:scale-[0.98]`}
                  >
                    <Link to={step.actionLink} className="flex items-center justify-center gap-2">
                      {step.actionText}
                      <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-24 bg-gradient-to-r from-primary to-purple-600 py-16 text-center text-white">
        <h3 className="text-3xl font-bold">Join the Community</h3>
        <p className="mt-4 text-white/90">
          Start helping people recover their lost belongings today
        </p>

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link to="/login">
            <Button variant="secondary" size="lg" className="rounded-xl hover:scale-105 transition-transform">
              Create Account
            </Button>
          </Link>
          
          <Link to="/shop">
            <Button
              variant="outline"
              size="lg"
              className="border-white bg-primary text-white hover:bg-white/10 rounded-xl hover:scale-105 transition-transform"
            >
              Shop Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToHelp;