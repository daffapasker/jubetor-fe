import InputFile from "@/components/ui/InputFile";
import useEditCatalogModal from "@/hooks/useUpdateCatalog";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { CiSaveUp2 } from "react-icons/ci";

interface PropTypes {
  isOpen: boolean;
  onClose?: () => void;
  refetchCatalog?: () => void;
  onOpenChange: () => void;
  editData: Record<string, unknown> | null;
}

const EditCatalog = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchCatalog, editData } = props;
  const {
    control,
    errors,
    handleEditCatalog,
    handleSubmit,
    isPendingMutateEditCatalog,
    isSuccessMutateEditCatalog,
    reset,
    setValue,
    watch,
  } = useEditCatalogModal();

  const imageFile = watch("image");
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Pre-populate form when editData changes
  useEffect(() => {
    if (editData && isOpen) {
      setValue("name", (editData.name as string) || "");
      setValue("description", (editData.description as string) || "");
      setValue("image", null);
      // Set preview to existing image URL
      if (editData.image) {
        setPreview(editData.image as string);
      } else {
        setPreview("");
      }
    }
  }, [editData, isOpen, setValue]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0 && imageFile[0] instanceof File) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    if (isSuccessMutateEditCatalog) {
      onClose?.();
      refetchCatalog?.();
    }
  }, [isSuccessMutateEditCatalog]);

  // Drag and drop handlers
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

  const catalogId = (editData?._id || editData?.id) as string;

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="lg"
    >
      <form
        onSubmit={handleSubmit((data) => handleEditCatalog(catalogId, data))}
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
                  Untuk mengganti gambar katalog
                </p>
              </div>
            </div>
          )}

          <ModalHeader>Edit Katalog</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    label="Nama Katalog"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.name !== undefined}
                    errorMessage={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Deskripsi Katalog"
                    variant="bordered"
                    autoComplete="off"
                    minRows={4}
                    isInvalid={errors.description !== undefined}
                    errorMessage={errors.description?.message}
                  />
                )}
              />

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-zinc-300">Gambar Katalog</p>
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
                      onDelete={() => {
                        setValue("image", null);
                        setPreview("");
                      }}
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
                setPreview("");
                onClose?.();
              }}
              disabled={isPendingMutateEditCatalog}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingMutateEditCatalog}
            >
              {isPendingMutateEditCatalog ? (
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

export default EditCatalog;
