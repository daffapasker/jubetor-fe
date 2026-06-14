import InputFile from "@/components/ui/InputFile";
import useAddCatalogModal from "@/hooks/useAddCatalogModal";
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
}

const AddCatalog = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchCatalog } = props;
  const {
    control,
    errors,
    handleAddCatalog,
    handleSubmit,
    isPendingMutateAddCatalog,
    isSuccessMutateAddCatalog,
    reset,
    setValue,
    watch,
  } = useAddCatalogModal();

  const imageFile = watch("image");
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

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

  useEffect(() => {
    if (isSuccessMutateAddCatalog) {
      onClose?.();
      refetchCatalog?.();
    }
  }, [isSuccessMutateAddCatalog]);

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
      // Validasi file adalah gambar
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
        onSubmit={handleSubmit(handleAddCatalog)}
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
                  Untuk dijadikan sebagai gambar katalog
                </p>
              </div>
            </div>
          )}

          <ModalHeader>Tambah Katalog</ModalHeader>
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
              disabled={isPendingMutateAddCatalog}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingMutateAddCatalog}
            >
              {isPendingMutateAddCatalog ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Tambah Katalog"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddCatalog;
