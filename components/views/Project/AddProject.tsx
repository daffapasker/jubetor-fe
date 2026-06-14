import useProject from "@/hooks/useProject";
import userServices from "@/services/user.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface PropTypes {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange: () => void;
}

const addProjectSchema = yup.object().shape({
  userId: yup.string().required("Pemilik wajib dipilih"),
  motorModel: yup.string().required("Model motor wajib diisi"),
  licensePlate: yup.string().required("Plat nomor wajib diisi"),
  engineNumber: yup.string().required("Nomor mesin wajib diisi"),
});

type AddProjectFormData = yup.InferType<typeof addProjectSchema>;

const AddProject = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange } = props;
  const { createProject, isPendingCreateProject } = useProject();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddProjectFormData>({
    resolver: yupResolver(addProjectSchema) as any,
  });

  // Fetch all client users
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["allClientsForSelect"],
    queryFn: async () => {
      const res = await userServices.getAllUsers();
      const allUsers = res.data;
      return Array.isArray(allUsers)
        ? allUsers.filter((u: any) => u.role === "client")
        : allUsers?.data?.filter((u: any) => u.role === "client") || [];
    },
    enabled: isOpen,
  });

  const onSubmit = (data: AddProjectFormData) => {
    createProject(data, {
      onSuccess: () => {
        reset();
        onClose?.();
      },
    });
  };

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ModalContent className="m-4">
          <ModalHeader>Tambah Proyek Motor</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Controller
                name="userId"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    {...rest}
                    label="Pemilik Motor (Client)"
                    variant="bordered"
                    selectedKeys={value ? [value] : []}
                    selectionMode="single"
                    onChange={onChange}
                    isLoading={isLoadingClients}
                    isInvalid={errors.userId !== undefined}
                    errorMessage={errors.userId?.message}
                    placeholder="Pilih pemilik motor"
                  >
                    {clients.map((client: any) => (
                      <SelectItem key={client.id || client._id} textValue={client.name}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="motorModel"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Model Motor"
                    placeholder="Contoh: Honda CB150R, CB Pitung"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.motorModel !== undefined}
                    errorMessage={errors.motorModel?.message}
                  />
                )}
              />

              <Controller
                name="licensePlate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Plat Nomor"
                    placeholder="Contoh: AA 1234 BB"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.licensePlate !== undefined}
                    errorMessage={errors.licensePlate?.message}
                  />
                )}
              />

              <Controller
                name="engineNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nomor Mesin"
                    placeholder="Contoh: ENG12345"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.engineNumber !== undefined}
                    errorMessage={errors.engineNumber?.message}
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
              disabled={isPendingCreateProject}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingCreateProject}
            >
              {isPendingCreateProject ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Tambah Proyek"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddProject;
