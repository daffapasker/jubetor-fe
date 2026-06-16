import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constant/list.constant";
import userServices from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
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

    const usersArray = allUsers?.data || (Array.isArray(allUsers) ? allUsers : []);

    let filteredData = usersArray.filter(
      (user: Record<string, unknown>) => user.role === "client",
    );

    if (currentSearch) {
      const lowerSearch = currentSearch.toLowerCase();
      filteredData = filteredData.filter((item: any) =>
        Object.values(item).some(
          (val) => val && String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    if (allUsers?.meta && !currentSearch) {
      return {
        data: filteredData,
        pagination: {
          totalPages: allUsers.meta.totalPages || 1,
        },
      };
    }

    const page = Number(currentPage) || 1;
    const limit = Number(currentLimit) || 8;
    const totalPages = Math.ceil(filteredData.length / limit) || 1;
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

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

  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: userServices.deleteUser,
    onSuccess: () => {
      toast.success("Pengguna berhasil dihapus");
      refetchUser();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal menghapus pengguna"
      );
    },
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
    deleteUser,
    isDeletingUser,

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
