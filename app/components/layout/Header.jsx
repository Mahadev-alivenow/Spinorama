import { ArrowLeft, HelpCircle, Settings } from "lucide-react";
import { Link } from "@remix-run/react";

export default function Header({ title, showBackButton = true }) {
  return (
    <header className="bg-white py-4 px-6 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center">
        {showBackButton && (
          <Link to="/campaigns" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900">
          <HelpCircle size={20} />
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          JS
        </div>
      </div>
    </header>
  );
}