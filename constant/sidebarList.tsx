import {
  CiFileOn,
  CiGrid41,
  CiUser,
  CiViewList,
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
    label: "Manajemen Pengguna",
    href: "/admin/user",
    icon: <CiUser />,
  },
  {
    key: "article",
    label: "Manajemen Artikel",
    href: "/admin/article",
    icon: <CiFileOn />,
  },
  {
    key: "catalog",
    label: "Manajemen Katalog",
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
