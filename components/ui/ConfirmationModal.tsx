import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange?: () => void;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  color?: "danger" | "warning" | "primary" | "default";
}

const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melakukan tindakan ini? Tindakan ini tidak dapat dibatalkan.",
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  isLoading = false,
  color = "danger",
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      placement="center"
      size="sm"
    >
      <ModalContent className="m-4">
        <ModalHeader className="flex flex-col gap-1 text-lg font-bold">
          {title}
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {message}
          </p>
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button
            className="font-semibold"
            variant="flat"
            onPress={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            className="font-semibold text-white bg-red-600 hover:bg-red-700"
            color={color}
            onPress={async () => {
              await onConfirm();
            }}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
