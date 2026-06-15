"use client";

import DataTable from "@/components/ui/DataTable";
import useArticle from "@/hooks/useArticle";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Key, ReactNode, useCallback, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LISTS_ARTICLE } from "./Article.constant";
import AddArticle from "./AddArticle";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const formatDateIndo = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ArticleAdmin = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
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
    refetchArticle,
    deleteArticle,
    isDeletingArticle,
  } = useArticle();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (deleteId) {
      deleteArticle(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const renderCell = useCallback(
    (article: Record<string, unknown>, columnKey: Key) => {
      const cellValue = article[columnKey as keyof typeof article];

      switch (columnKey) {
        case "thumbnail":
          return cellValue ? (
            <Image
              src={cellValue as string}
              alt={(article.title as string) || "Thumbnail"}
              width={80}
              height={50}
              className="rounded-md object-cover"
              style={{ width: 80, height: 50 }}
            />
          ) : (
            <div className="flex h-[50px] w-[80px] items-center justify-center rounded-md bg-neutral-800 text-xs text-neutral-500">
              No Image
            </div>
          );
        case "content":
          return (
            <p className="line-clamp-2 max-w-xs text-sm text-neutral-400">
              {cellValue as string}
            </p>
          );
        case "createdAt":
          return (
            <span className="text-sm text-neutral-300">
              {formatDateIndo(cellValue as string)}
            </span>
          );
        case "actions":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" aria-label="Actions">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {/* <DropdownItem
                  key="detail-article-button"
                  onPress={() =>
                    router.push(`/admin/article/${article._id || article.id}`)
                  }
                >
                  Detail Artikel
                </DropdownItem> */}
                <DropdownItem
                  key="delete-article-button"
                  className="text-danger-500"
                  onPress={() => setDeleteId((article._id || article.id) as string)}
                >
                  Hapus Artikel
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
        emptyContent="Belum ada artikel."
        isLoading={isLoadingArticle || isRefetchingArticle}
        limit={String(currentLimit)}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
        onChangeSearch={handleSearch}
        onClearSearch={handleClearSearch}
        renderCell={renderCell}
        totalPages={dataArticle?.pagination?.totalPages || 1}
        buttonTopContentLabel="Tambah Artikel"
        onClickButtonTopContent={onOpen}
      />
      <AddArticle
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        refetchArticle={refetchArticle}
      />
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingArticle}
        title="Hapus Artikel"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
      />
    </section>
  );
};

export default ArticleAdmin;
