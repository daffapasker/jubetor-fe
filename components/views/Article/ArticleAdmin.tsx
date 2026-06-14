"use client";

import DataTable from "@/components/ui/DataTable";
import useArticle from "@/hooks/useArticle";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { Key, ReactNode, useCallback } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LISTS_ARTICLE } from "./Article.constant";

const ArticleAdmin = () => {
  const router = useRouter();
  const {
    currentPage,
    currentLimit,
    dataArticle,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
    handleSearch,
    isLoadingArticle,
    isRefetchingArticle,
  } = useArticle();

  const renderCell = useCallback(
    (article: Record<string, unknown>, columnKey: Key) => {
      const cellValue = article[columnKey as keyof typeof article];

      switch (columnKey) {
        case "actions":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" aria-label="Actions">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="detail-article-button"
                  onPress={() =>
                    router.push(`/admin/article/${article._id}`)
                  }
                >
                  Detail Article
                </DropdownItem>
                <DropdownItem
                  key="delete-article-button"
                  className="text-danger-500"
                >
                  Delete Article
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [router],
  );

  return (
    <section>
      <DataTable
        columns={COLUMN_LISTS_ARTICLE}
        currentPage={Number(currentPage)}
        data={dataArticle?.data || []}
        emptyContent="No article found."
        isLoading={isLoadingArticle || isRefetchingArticle}
        limit={String(currentLimit)}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
        onChangeSearch={handleSearch}
        onClearSearch={handleClearSearch}
        renderCell={renderCell}
        totalPages={dataArticle?.pagination?.totalPages || 1}
      />
    </section>
  );
};

export default ArticleAdmin;
