import React from 'react'


export default function Footer() {
  return (<>
     <footer className="bg-white py-12">
      {/* Line */}
      <div className="w-3/4 mx-auto border-t-2 border-purple-700 mb-10"></div>

      {/* Links Section */}
      <div className="w-3/4 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Column 1 */}
        <div>
          <h3 className="text-purple-700 font-semibold mb-4">
            Who We Are
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="hover:text-purple-700 cursor-pointer">About</li>
            <li className="hover:text-purple-700 cursor-pointer">
              Get in Touch
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-purple-700 font-semibold mb-4">
            Our Family
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="hover:text-purple-700 cursor-pointer">DAY3</li>
            <li className="hover:text-purple-700 cursor-pointer">
              DAY3 Adopt
            </li>
            <li className="hover:text-purple-700 cursor-pointer">
              DAY3 Care
            </li>
            <li className="hover:text-purple-700 cursor-pointer">
              DAY3.com
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-purple-700 font-semibold mb-4">
            Partners
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="hover:text-purple-700 cursor-pointer">
              Supporters
            </li>
            <li className="hover:text-purple-700 cursor-pointer">
              DAY3 Partner Portal
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-purple-700 font-semibold mb-4">
            Things Search
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="hover:text-purple-700 cursor-pointer">
              I Lost a Things
            </li>
            <li className="hover:text-purple-700 cursor-pointer">
              I Found a Things
            </li>
          </ul>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mt-10 text-purple-700 text-xl">
       
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-500 text-sm mt-6 px-4">
        Use of this service constitutes acceptance of all terms listed above.
        DAY3 © 2026. All rights reserved.
      </p>
    </footer>
  
  
  
  
  </>
    
  )
}
