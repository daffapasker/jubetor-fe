import InputFile from "@/components/ui/InputFile";
import useProject from "@/hooks/useProject";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CiSaveUp2 } from "react-icons/ci";
import * as yup from "yup";

interface PropTypes {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange: () => void;
  project: any; // The selected project to update
}

const updateProjectSchema = yup.object().shape({
  status: yup.string().required("Status wajib dipilih"),
  notes: yup.string().required("Catatan progres wajib diisi"),
  image: yup.mixed(),
});

type UpdateProjectFormData = yup.InferType<typeof updateProjectSchema>;

const UpdateProjectStatus = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, project } = props;
  const { updateProjectStatus, isPendingUpdateProjectStatus } = useProject();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateProjectFormData>({
    resolver: yupResolver(updateProjectSchema) as any,
  });

  const imageFile = watch("image");
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Set default values when project changes
  useEffect(() => {
    if (project) {
      reset({
        status: project.status,
        notes: "",
        image: null,
      });
      setPreview("");
    }
  }, [project, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview("");
    }
  }, [imageFile]);

  const onSubmit = (data: UpdateProjectFormData) => {
    if (!project) return;

    const formData = new FormData();
    formData.append("status", data.status);
    formData.append("notes", data.notes);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    updateProjectStatus(
      {
        projectId: project.id || project._id,
        payload: formData,
      },
      {
        onSuccess: () => {
          reset();
          onClose?.();
        },
      }
    );
  };

  // Drag and drop handlers for the entire form area
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type.startsWith("image/")) {
        setValue("image", files, { shouldValidate: true });
      }
    }
  };

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
      >
        <ModalContent className="m-4 relative overflow-hidden">
          {/* Drag Overlay */}
          {isDragging && (
            <div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 border-3 border-dashed border-red-600 rounded-2xl backdrop-blur-sm transition-all duration-300 pointer-events-auto"
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <CiSaveUp2 className="h-16 w-16 text-red-500 animate-bounce" />
                <p className="text-xl font-bold text-white">
                  Lepaskan Gambar di Sini
                </p>
                <p className="text-sm text-neutral-400">
                  Untuk dijadikan sebagai foto progres projek
                </p>
              </div>
            </div>
          )}

          <ModalHeader>
            Update Status Proyek: {project?.motorModel}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Controller
                name="status"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    {...rest}
                    label="Status Proyek Saat Ini"
                    variant="bordered"
                    selectedKeys={value ? [value] : []}
                    selectionMode="single"
                    onChange={onChange}
                    disallowEmptySelection
                  >
                    <SelectItem key="QUEUE">Antrean (QUEUE)</SelectItem>
                    <SelectItem key="STRIPPING">Bongkar (STRIPPING)</SelectItem>
                    <SelectItem key="ENGINE">Mesin (ENGINE)</SelectItem>
                    <SelectItem key="PAINTING">Cat (PAINTING)</SelectItem>
                    <SelectItem key="ASSEMBLY">Rakit (ASSEMBLY)</SelectItem>
                    <SelectItem key="DONE">Selesai (DONE)</SelectItem>
                    <SelectItem key="CANCELED">Batal (CANCELED)</SelectItem>
                  </Select>
                )}
              />

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Catatan Aktivitas / Progres"
                    placeholder="Masukkan deskripsi detail pengerjaan saat ini..."
                    variant="bordered"
                    autoComplete="off"
                    minRows={3}
                    isInvalid={errors.notes !== undefined}
                    errorMessage={errors.notes?.message}
                  />
                )}
              />

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-zinc-300">Foto Progres (Opsional)</p>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      name="image"
                      preview={preview}
                      isDropable={true}
                      isInvalid={errors.image !== undefined}
                      errorMessage={errors.image?.message as string}
                      onUpload={(files) =>
                        setValue("image", files, { shouldValidate: true })
                      }
                      onDelete={() => setValue("image", null)}
                    />
                  )}
                />
              </div>
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
              disabled={isPendingUpdateProjectStatus}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingUpdateProjectStatus}
            >
              {isPendingUpdateProjectStatus ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Update Status"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default UpdateProjectStatus;
