"use client";

import DataTable from "@/components/ui/DataTable";
import useUser from "@/hooks/useUser";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { Key, ReactNode, useCallback, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LISTS_USER } from "./User.constant";
import AddUser from "./AddUser";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const UserAdmin = () => {
  const router = useRouter();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
    onOpenChange: onAddOpenChange,
  } = useDisclosure();

  const {
    currentPage,
    currentLimit,
    dataUser,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
    handleSearch,
    isLoadingUser,
    isRefetchingUser,
    refetchUser,
    deleteUser,
    isDeletingUser,
  } = useUser();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (deleteId) {
      deleteUser(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const renderCell = useCallback(
    (user: Record<string, unknown>, columnKey: Key) => {
      const cellValue = user[columnKey as keyof typeof user];

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
                  key="detail-user-button"
                  onPress={() =>
                    router.push(`/admin/user/${user._id || user.id}`)
                  }
                >
                  Detail User
                </DropdownItem>
                <DropdownItem
                  key="delete-user-button"
                  className="text-danger-500"
                  onPress={() => setDeleteId((user._id || user.id) as string)}
                >
                  Delete User
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
        columns={COLUMN_LISTS_USER}
        currentPage={Number(currentPage)}
        data={dataUser?.data || []}
        emptyContent="No user found."
        isLoading={isLoadingUser || isRefetchingUser}
        limit={String(currentLimit)}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
        onChangeSearch={handleSearch}
        onClearSearch={handleClearSearch}
        renderCell={renderCell}
        totalPages={dataUser?.pagination?.totalPages || 1}
        buttonTopContentLabel="Tambah Pengguna"
        onClickButtonTopContent={onAddOpen}
      />
      <AddUser
        isOpen={isAddOpen}
        onClose={onAddClose}
        onOpenChange={onAddOpenChange}
        refetchUser={refetchUser}
      />
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingUser}
        title="Hapus Pengguna"
        message="Apakah Anda yakin ingin menghapus pengguna ini? Semua data terkait pengguna ini akan dihapus secara permanen."
        confirmLabel="Hapus"
      />
    </section>
  );
};

export default UserAdmin;
