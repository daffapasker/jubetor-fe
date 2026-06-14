import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constant/list.constant";
import articleServices from "@/services/article.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import useDebounce from "./useDebounce";

const useArticle = () => {
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

  const getArticles = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;
    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }
    const res = await articleServices.getAllArticles(params);
    const { data: allArticles } = res;

    // If API returns paginated response, use it directly
    if (allArticles?.pagination) {
      return allArticles;
    }

    // Flat array response — paginate on frontend
    const articles = Array.isArray(allArticles) ? allArticles : [];
    const page = Number(currentPage) || 1;
    const limit = Number(currentLimit) || 8;
    const totalPages = Math.ceil(articles.length / limit) || 1;
    const paginatedData = articles.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      pagination: { totalPages },
    };
  };

  const {
    data: dataArticle,
    isLoading: isLoadingArticle,
    isRefetching: isRefetchingArticle,
    refetch: refetchArticle,
  } = useQuery({
    queryKey: ["Article", currentPage, currentLimit, currentSearch],
    queryFn: () => getArticles(),
    enabled: !!currentPage && !!currentLimit,
  });

  const { mutate: deleteArticle, isPending: isDeletingArticle } = useMutation({
    mutationFn: articleServices.deleteArticle,
    onSuccess: () => {
      toast.success("Artikel berhasil dihapus");
      refetchArticle();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal menghapus artikel"
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
    dataArticle,
    isLoadingArticle,
    isRefetchingArticle,
    refetchArticle,
    deleteArticle,
    isDeletingArticle,

    setURL,
    currentPage,
    currentLimit,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  };
};

export default useArticle;
