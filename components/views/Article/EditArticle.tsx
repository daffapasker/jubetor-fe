import InputFile from "@/components/ui/InputFile";
import useEditArticleModal from "@/hooks/useUpdateArticle";
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
  refetchArticle?: () => void;
  onOpenChange: () => void;
  editData: Record<string, unknown> | null;
}

const EditArticle = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchArticle, editData } = props;
  const {
    control,
    errors,
    handleEditArticle,
    handleSubmit,
    isPendingMutateEditArticle,
    isSuccessMutateEditArticle,
    reset,
    setValue,
    watch,
  } = useEditArticleModal();

  const thumbnailFile = watch("thumbnail");
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Pre-populate form when editData changes
  useEffect(() => {
    if (editData && isOpen) {
      setValue("title", (editData.title as string) || "");
      setValue("content", (editData.content as string) || "");
      setValue("thumbnail", null);
      // Set preview to existing thumbnail URL
      if (editData.thumbnail) {
        setPreview(editData.thumbnail as string);
      } else {
        setPreview("");
      }
    }
  }, [editData, isOpen, setValue]);

  useEffect(() => {
    if (thumbnailFile && thumbnailFile.length > 0 && thumbnailFile[0] instanceof File) {
      const file = thumbnailFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [thumbnailFile]);

  useEffect(() => {
    if (isSuccessMutateEditArticle) {
      onClose?.();
      refetchArticle?.();
    }
  }, [isSuccessMutateEditArticle]);

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
        setValue("thumbnail", files, { shouldValidate: true });
      }
    }
  };

  const articleId = (editData?._id || editData?.id) as string;

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="lg"
    >
      <form
        onSubmit={handleSubmit((data) => handleEditArticle(articleId, data))}
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
                  Untuk mengganti thumbnail artikel
                </p>
              </div>
            </div>
          )}

          <ModalHeader>Edit Artikel</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    label="Judul Artikel"
                    variant="bordered"
                    type="text"
                    autoComplete="off"
                    isInvalid={errors.title !== undefined}
                    errorMessage={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Konten / Deskripsi Artikel"
                    variant="bordered"
                    autoComplete="off"
                    minRows={4}
                    isInvalid={errors.content !== undefined}
                    errorMessage={errors.content?.message}
                  />
                )}
              />

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-zinc-300">Thumbnail</p>
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      name="thumbnail"
                      preview={preview}
                      isDropable={true}
                      isInvalid={errors.thumbnail !== undefined}
                      errorMessage={errors.thumbnail?.message as string}
                      onUpload={(files) =>
                        setValue("thumbnail", files, { shouldValidate: true })
                      }
                      onDelete={() => {
                        setValue("thumbnail", null);
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
              disabled={isPendingMutateEditArticle}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 font-semibold text-white"
              type="submit"
              disabled={isPendingMutateEditArticle}
            >
              {isPendingMutateEditArticle ? (
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

export default EditArticle;
