import {
  CiBookmark,
  CiGrid41,
  CiSettings,
  CiShoppingTag,
  CiViewList,
  CiWallet,
} from "react-icons/ci";

const SIDEBAR_ADMIN = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <CiGrid41 />,
  },
  {
    key: "user",
    label: "User",
    href: "/admin/user",
    icon: <CiBookmark />,
  },
  {
    key: "article",
    label: "Article",
    href: "/admin/article",
    icon: <CiShoppingTag />,
  },
  {
    key: "catalog",
    label: "Catalog",
    href: "/admin/catalog",
    icon: <CiViewList />,
  },
];

const SIDEBAR_CLIENT = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/client/dashboard",
    icon: <CiGrid41 />,
  },
];

export { SIDEBAR_ADMIN, SIDEBAR_CLIENT };
