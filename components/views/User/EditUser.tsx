import useEditUserModal from "@/hooks/useUpdateUser";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";

interface PropTypes {
  isOpen: boolean;
  onClose?: () => void;
  refetchUser?: () => void;
  onOpenChange: () => void;
  editData: Record<string, unknown> | null;
}

const EditUser = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchUser, editData } = props;
  const {
    control,
    errors,
    handleEditUser,
    handleSubmit,
    isPendingMutateEditUser,
    isSuccessMutateEditUser,
    reset,
    setValue,
  } = useEditUserModal();

  // Pre-populate form when editData changes
  useEffect(() => {
    if (editData && isOpen) {
      setValue("name", (editData.name as string) || "");
      setValue("email", (editData.email as string) || "");
      setValue("phoneNumber", (editData.phoneNumber as string) || "");
      setValue("password", "");
    }
  }, [editData, isOpen, setValue]);

  useEffect(() => {
    if (isSuccessMutateEditUser) {
      onClose?.();
      refetchUser?.();
    }
  }, [isSuccessMutateEditUser]);

  const userId = (editData?._id || editData?.id) as string;

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
    >
      <form
        onSubmit={handleSubmit((data) => handleEditUser(userId, data))}
        autoComplete="off"
      >
        <ModalContent className="m-4">
          <ModalHeader>Edit Pengguna</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    label="Nama"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.name !== undefined}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email"
                    variant="bordered"
                    type="email"
                    autoComplete="off"
                    isInvalid={errors.email !== undefined}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Password Baru (kosongkan jika tidak ingin mengubah)"
                    variant="bordered"
                    type="password"
                    autoComplete="new-password"
                    isInvalid={errors.password !== undefined}
                    errorMessage={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nomor Telepon"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.phoneNumber !== undefined}
                    errorMessage={errors.phoneNumber?.message}
                  />
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="font-semibold"
              color="danger"
              variant="flat"
              onPress={() => {
                reset();
                onClose?.();
              }}
              disabled={isPendingMutateEditUser}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingMutateEditUser}
            >
              {isPendingMutateEditUser ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EditUser;
