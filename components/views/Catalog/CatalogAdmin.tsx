"use client";

import DataTable from "@/components/ui/DataTable";
import useCatalog from "@/hooks/useCatalog";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Key, ReactNode, useCallback } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LISTS_CATALOG } from "./Catalog.constant";

const formatDateIndo = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CatalogAdmin = () => {
  const router = useRouter();
  const {
    currentPage,
    currentLimit,
    dataCatalog,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
    handleSearch,
    isLoadingCatalog,
    isRefetchingCatalog,
  } = useCatalog();

  const renderCell = useCallback(
    (catalog: Record<string, unknown>, columnKey: Key) => {
      const cellValue = catalog[columnKey as keyof typeof catalog];

      switch (columnKey) {
        case "image":
          return cellValue ? (
            <Image
              src={cellValue as string}
              alt={(catalog.name as string) || "Gambar Katalog"}
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
        case "description":
          return (
            <p className="line-clamp-2 max-w-xs text-sm text-neutral-400">
              {(cellValue as string) || "-"}
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
                <DropdownItem
                  key="detail-catalog-button"
                  onPress={() =>
                    router.push(`/admin/catalog/${catalog._id || catalog.id}`)
                  }
                >
                  Detail Katalog
                </DropdownItem>
                <DropdownItem
                  key="delete-catalog-button"
                  className="text-danger-500"
                >
                  Hapus Katalog
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
        columns={COLUMN_LISTS_CATALOG}
        currentPage={Number(currentPage)}
        data={dataCatalog?.data || []}
        emptyContent="Belum ada katalog."
        isLoading={isLoadingCatalog || isRefetchingCatalog}
        limit={String(currentLimit)}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
        onChangeSearch={handleSearch}
        onClearSearch={handleClearSearch}
        renderCell={renderCell}
        totalPages={dataCatalog?.pagination?.totalPages || 1}
        buttonTopContentLabel="Tambah Katalog"
        onClickButtonTopContent={() => {}}
      />
    </section>
  );
};

export default CatalogAdmin;
