import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constant/list.constant";
import userServices from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect } from "react";
import useDebounce from "./useDebounce";

const useUser = () => {
  const debounce = useDebounce();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") || String(PAGE_DEFAULT);
  const currentLimit = searchParams.get("limit") || String(LIMIT_DEFAULT);
  const currentSearch = searchParams.get("search") || "";

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        newParams.set(key, value);
      });
      return newParams.toString();
    },
    [searchParams],
  );

  const setURL = useCallback(() => {
    const qs = createQueryString({
      limit: currentLimit,
      page: currentPage,
      search: currentSearch,
    });
    router.replace(`${pathname}?${qs}`);
  }, [
    router,
    pathname,
    currentLimit,
    currentPage,
    currentSearch,
    createQueryString,
  ]);

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      setURL();
    }
  }, [searchParams, setURL]);

  const getUsers = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;
    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }
    const res = await userServices.getAllUsers(params);
    const { data: allUsers } = res;

    // Filter only client role on frontend
    const clientUsers = Array.isArray(allUsers)
      ? allUsers.filter(
          (user: Record<string, unknown>) => user.role === "client",
        )
      : allUsers?.data?.filter(
          (user: Record<string, unknown>) => user.role === "client",
        ) || [];

    // If API returns paginated response, use it; otherwise build pagination from filtered data
    if (allUsers?.pagination) {
      return {
        data: clientUsers,
        pagination: allUsers.pagination,
      };
    }

    // Flat array response — paginate on frontend
    const page = Number(currentPage) || 1;
    const limit = Number(currentLimit) || 8;
    const totalPages = Math.ceil(clientUsers.length / limit) || 1;
    const paginatedData = clientUsers.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      pagination: { totalPages },
    };
  };

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isRefetching: isRefetchingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["User", currentPage, currentLimit, currentSearch],
    queryFn: () => getUsers(),
    enabled: !!currentPage && !!currentLimit,
  });

  const handleChangePage = (page: number) => {
    const qs = createQueryString({ page: String(page) });
    router.push(`${pathname}?${qs}`);
  };

  const handleChangeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    const qs = createQueryString({
      limit: e.target.value,
      page: String(PAGE_DEFAULT),
    });
    router.push(`${pathname}?${qs}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => {
      const qs = createQueryString({
        search: e.target.value,
        page: String(PAGE_DEFAULT),
      });
      router.push(`${pathname}?${qs}`);
    }, DELAY);
  };

  const handleClearSearch = () => {
    const qs = createQueryString({
      search: "",
      page: String(PAGE_DEFAULT),
    });
    router.push(`${pathname}?${qs}`);
  };

  return {
    dataUser,
    isLoadingUser,
    isRefetchingUser,
    refetchUser,

    setURL,
    currentPage,
    currentLimit,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  };
};

export default useUser;
