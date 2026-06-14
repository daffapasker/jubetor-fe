import { cn } from "@/lib/utils";
import { Button, Spinner } from "@heroui/react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useId, useRef } from "react";
import { CiSaveUp2, CiTrash } from "react-icons/ci";

interface PropTypes {
  name: string;
  isDropable?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: () => void;
  onUpload?: (file: FileList) => void;
  isDeleting?: boolean;
  isUploading?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  preview?: string;
}

const InputFile = (props: PropTypes) => {
  const {
    name,
    className,
    isDropable = false,
    isInvalid,
    errorMessage,
    onDelete,
    onUpload,
    isDeleting,
    isUploading,
    preview,
  } = props;
  const drop = useRef<HTMLLabelElement>(null);
  const dropzoneId = useId();

  const handleDragOver = (e: DragEvent) => {
    if (isDropable) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && onUpload) {
      onUpload(files);
    }
  };

  useEffect(() => {
    const dropCurrent = drop.current;
    if (dropCurrent) {
      dropCurrent.addEventListener("dragover", handleDragOver);
      dropCurrent.addEventListener("drop", handleDrop);
      return () => {
        dropCurrent.removeEventListener("dragover", handleDragOver);
        dropCurrent.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files && onUpload) {
      onUpload(files);
    }
  };

  return (
    <div>
      <label
        ref={drop}
        htmlFor={`dropzone-file-${dropzoneId}`}
        className={cn(
          "border-default-300 bg-default-50 hover:bg-default-100 flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed",
          className,
          { "border-danger-500": isInvalid },
        )}
      >
        {/* render image preview */}
        {preview && (
          <div className="relative flex flex-col items-center justify-center p-5">
            <div className="mb-2 w-1/2">
              <Image fill src={preview} alt="image" className="!relative" />
            </div>
            <Button
              disabled={isDeleting}
              isIconOnly
              onPress={onDelete}
              className="bg-danger-100 absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded"
            >
              {isDeleting ? (
                <Spinner size="sm" color="danger" />
              ) : (
                <CiTrash className="text-danger-500 h-5 w-5" />
              )}
            </Button>
          </div>
        )}

        {!preview && !isUploading && (
          <div className="flex flex-col items-center justify-center p-5">
            <CiSaveUp2 className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-center text-sm font-semibold text-gray-500">
              {isDropable
                ? "Click or drag and drop to upload an image"
                : "Click to upload an image"}
            </p>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center p-5">
            <Spinner color="danger" />
          </div>
        )}

        <input
          name={name}
          type="file"
          className="hidden"
          accept="image/*"
          id={`dropzone-file-${dropzoneId}`}
          onChange={handleOnUpload}
          disabled={preview !== ""}
          onClick={(e) => {
            e.currentTarget.value = "";
            e.target.dispatchEvent(new Event("change", { bubbles: true }));
          }}
        />
      </label>
      {isInvalid && (
        <p className="text-danger-500 mt-1 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputFile;
