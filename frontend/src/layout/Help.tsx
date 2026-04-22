import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Share2,
  Printer,
  Users,
  Info,
  ArrowLeft,
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
      actionLink: "/something-lost",
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
      border: "border-blue-200",
    },
    {
      id: 2,
      icon: Share2,
      title: "Share the Word",
      description:
        "Share posts across social media and help spread awareness in your community.",
      actionText: "Share a Post",
      actionLink: "/something-found",
      color: "from-green-500/10 to-green-600/5",
      iconColor: "text-green-600",
      border: "border-green-200",
    },
    {
      id: 3,
      icon: Printer,
      title: "Post Flyers",
      description:
        "Print flyers and place them in public areas like cafes, malls, and universities.",
      actionText: "Print Flyer",
      actionLink: "/help/flyer",
      color: "from-yellow-500/10 to-yellow-600/5",
      iconColor: "text-yellow-600",
      border: "border-yellow-200",
    },
    {
      id: 4,
      icon: Users,
      title: "Organize a Search",
      description:
        "Join efforts with others and organize a community search team.",
      actionText: "Form Team",
      actionLink: "/help/coordinate",
      color: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600",
      border: "border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* HERO */}
      <div className="relative overflow-hidden bg-primary py-20 px-6 text-center">
        
        {/* background glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-white text-7xl">★</div>
          <div className="absolute bottom-10 right-10 text-white text-8xl">✦</div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Info className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white">
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
          { label: "Returned Items", value: "85%" },
          { label: "Lost Reports", value: "300K+" },
          { label: "Support", value: "24/7" },
        ].map((s, i) => (
          <Card
            key={i}
            className="text-center shadow-xl hover:shadow-2xl transition-all"
          >
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary">
                {s.value}
              </div>
              <p className="text-gray-500 mt-2">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* STEPS */}
      <div className="max-w-6xl mx-auto px-6 mt-20">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">
          Simple Ways to Help
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {helpSteps.map((step) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.id}
                className={`bg-gradient-to-br ${step.color} border ${step.border} hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl`}
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>

                  <CardTitle className="mt-4 text-xl font-bold text-gray-800">
                    {step.title}
                  </CardTitle>

                  <CardDescription className="text-gray-600 mt-2">
                    {step.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary hover:bg-[#6B1EE6]"
                  >
                    <Link to={step.actionLink}>
                      {step.actionText}
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
          <Button variant="secondary" size="lg">
            Create Account
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-white bg-primary text-white hover:bg-white/10"
          >
            Browse Items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowToHelp;