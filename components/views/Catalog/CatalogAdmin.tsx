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
import { useRouter } from "next/navigation";
import { Key, ReactNode, useCallback } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LISTS_CATALOG } from "./Catalog.constant";

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
                    router.push(`/admin/catalog/${catalog._id}`)
                  }
                >
                  Detail Catalog
                </DropdownItem>
                <DropdownItem
                  key="delete-catalog-button"
                  className="text-danger-500"
                >
                  Delete Catalog
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
        emptyContent="No catalog found."
        isLoading={isLoadingCatalog || isRefetchingCatalog}
        limit={String(currentLimit)}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
        onChangeSearch={handleSearch}
        onClearSearch={handleClearSearch}
        renderCell={renderCell}
        totalPages={dataCatalog?.pagination?.totalPages || 1}
      />
    </section>
  );
};

export default CatalogAdmin;
