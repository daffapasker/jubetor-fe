import useAddUserModal from "@/hooks/useAddUserModal";
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
}

const AddUser = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchUser } = props;
  const {
    control,
    errors,
    handleAddUser,
    handleSubmit,
    isPendingMutateAddUser,
    isSuccessMutateAddUser,
    reset,
  } = useAddUserModal();

  useEffect(() => {
    if (isSuccessMutateAddUser) {
      onClose?.();
      refetchUser?.();
    }
  }, [isSuccessMutateAddUser]);

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
    >
      <form onSubmit={handleSubmit(handleAddUser)} autoComplete="off">
        <ModalContent className="m-4">
          <ModalHeader>Tambah Pengguna</ModalHeader>
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
                    label="Password"
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
              disabled={isPendingMutateAddUser}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingMutateAddUser}
            >
              {isPendingMutateAddUser ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Tambah Pengguna"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddUser;
