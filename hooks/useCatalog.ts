import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constant/list.constant";
import catalogServices from "@/services/catalog.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import useDebounce from "./useDebounce";

const useCatalog = () => {
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

  const getCatalogs = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;
    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }
    const res = await catalogServices.getAllCatalogs(params);
    const { data: allCatalogs } = res;

    // Extract flat array
    let catalogs = allCatalogs?.data || (Array.isArray(allCatalogs) ? allCatalogs : []);

    // Apply frontend search filter if currentSearch exists
    if (currentSearch) {
      const lowerSearch = currentSearch.toLowerCase();
      catalogs = catalogs.filter((item: any) =>
        Object.values(item).some(
          (val) => val && String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    // API response: { message, meta: { currentPage, itemsPerPage, totalItems, totalPages }, data: [...] }
    if (allCatalogs?.meta && !currentSearch) {
      return {
        data: catalogs,
        pagination: {
          totalPages: allCatalogs.meta.totalPages || 1,
        },
      };
    }

    // Flat array response or search active — paginate on frontend
    const page = Number(currentPage) || 1;
    const limit = Number(currentLimit) || 8;
    const totalPages = Math.ceil(catalogs.length / limit) || 1;
    const paginatedData = catalogs.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      pagination: { totalPages },
    };
  };

  const {
    data: dataCatalog,
    isLoading: isLoadingCatalog,
    isRefetching: isRefetchingCatalog,
    refetch: refetchCatalog,
  } = useQuery({
    queryKey: ["Catalog", currentPage, currentLimit, currentSearch],
    queryFn: () => getCatalogs(),
    enabled: !!currentPage && !!currentLimit,
  });

  const { mutate: deleteCatalog, isPending: isDeletingCatalog } = useMutation({
    mutationFn: catalogServices.deleteCatalog,
    onSuccess: () => {
      toast.success("Katalog berhasil dihapus");
      refetchCatalog();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal menghapus katalog"
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
    dataCatalog,
    isLoadingCatalog,
    isRefetchingCatalog,
    refetchCatalog,
    deleteCatalog,
    isDeletingCatalog,

    setURL,
    currentPage,
    currentLimit,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  };
};

export default useCatalog;
