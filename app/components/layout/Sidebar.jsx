import { Link, useLocation } from "@remix-run/react";
import { 
  Layers, Settings, MonitorSmartphone, FilePlus, 
  ScrollText, PanelLeft, MousePointerClick, Bell
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const campaignId = currentPath.split('/')[2]; // Get campaign ID from URL
  
  const navItems = [
    { 
      icon: <Layers size={24} />, 
      name: "Theme", 
      path: `/campaigns/${campaignId}/theme`
    },
    { 
      icon: <Settings size={24} />, 
      name: "Configure", 
      path: `/campaigns/${campaignId}/configure` 
    },
    { 
      icon: <MonitorSmartphone size={24} />, 
      name: "Landing", 
      path: `/campaigns/${campaignId}/landing` 
    },
    { 
      icon: <FilePlus size={24} />, 
      name: "Wheel", 
      path: `/campaigns/${campaignId}/wheel` 
    },
    { 
      icon: <ScrollText size={24} />, 
      name: "Results", 
      path: `/campaigns/${campaignId}/results` 
    },
    { 
      icon: <PanelLeft size={24} />, 
      name: "Button", 
      path: `/campaigns/${campaignId}/button` 
    },
    { 
      icon: <MousePointerClick size={24} />, 
      name: "Rules", 
      path: `/campaigns/${campaignId}/rules` 
    },
    { 
      icon: <Bell size={24} />, 
      name: "Launch", 
      path: `/campaigns/${campaignId}/launch` 
    }
  ];

  return (
    <div className="bg-[#2e3fc9] text-white w-20 h-full flex flex-col items-center py-6">
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2e3fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V16" stroke="#2e3fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="#2e3fc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="flex flex-col items-center space-y-6 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center w-16 py-2 ${
              currentPath === item.path
                ? "text-white"
                : "text-blue-200 hover:text-white"
            }`}
          >
            <div className={`p-2 rounded-lg ${
              currentPath === item.path
                ? "bg-blue-700"
                : "hover:bg-blue-700"
            }`}>
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}