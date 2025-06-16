import { useState, useCallback } from "react";
import { Link, useLocation } from "@remix-run/react";
import {
  Frame,
  Navigation,
  TopBar,
  Text,
  Icon,
  Avatar,
  Button,
} from "@shopify/polaris";
import {
  HomeIcon,
  ConfettiIcon,
  PersonIcon,
  FinanceIcon,
  AppsIcon,
  SettingsFilledIcon,
  NotificationIcon,
  SearchIcon,
} from "@shopify/polaris-icons";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleMobileNavigationActive = useCallback(
    () => setMobileNavigationActive((active) => !active),
    [],
  );

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleSearchFieldChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((active) => !active),
    [],
  );

  const userMenuActions = [
    {
      items: [
        { content: "Profile", url: "/app/settings/profile" },
        { content: "Sign out", onAction: () => console.log("Sign out") },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name="Admin User"
      detail="Premium Plan"
      initials="AU"
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const searchResultsMarkup = (
    <div style={{ height: "250px" }}>
      <Text as="p" variant="bodyMd">
        Search results will appear here
      </Text>
    </div>
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Search"
    />
  );

  const secondaryMenuMarkup = (
    <TopBar.Menu
      activatorContent={<Button icon={NotificationIcon} variant="tertiary" />}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      secondaryMenu={secondaryMenuMarkup}
      searchResultsVisible={searchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={() => setSearchActive(false)}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const isActive = (path) => location.pathname === path;

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            url: "/app",
            label: "Home",
            icon: HomeIcon,
            selected: isActive("/app"),
          },
          {
            url: "/app/campaigns",
            label: "Campaigns",
            icon: ConfettiIcon,
            selected: isActive("/app/campaigns"),
          },
          {
            url: "/app/subscribers",
            label: "Subscribers",
            icon: PersonIcon,
            selected: isActive("/app/subscribers"),
          },
          {
            url: "/app/revenue",
            label: "Revenue",
            icon: FinanceIcon,
            selected: isActive("/app/revenue"),
          },
          {
            url: "/app/integrations",
            label: "Integrations",
            icon: AppsIcon,
            selected: isActive("/app/integrations"),
          },
          {
            url: "/app/settings",
            label: "Settings",
            icon: SettingsFilledIcon,
            selected: isActive("/app/settings"),
          },
        ]}
      />
    </Navigation>
  );

  return (
    <Frame
      // topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      {children}
    </Frame>
  );
}
