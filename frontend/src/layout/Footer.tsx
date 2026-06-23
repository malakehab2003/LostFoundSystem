"use client";

import { Link } from "react-router-dom";
import logo from "@/assets/logowebsite.png";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center space-x-2 group flex-shrink-0 text-lg font-bold mb-6"
            >
              <div className="relative">
                <img src={logo} className="h-10 w-auto" alt="Logo" />
              </div>
              <span className="self-center text-lg md:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                ضايع
              </span>
            </Link>
            <p className="text-slate-500 text-sm">
              Building the future of community-driven assistance and item
              recovery.
            </p>
          </div>

          <div>
            <h5 className="font-bold mb-6">Product</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Find Items
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Report Lost
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Report Found
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Verification
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6">Company</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6">Legal</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-500 hover:text-violet-600 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-200 text-sm text-slate-400">
          <div>© 2026 ضايع Inc. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
