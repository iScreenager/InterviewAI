import { Loader } from "lucide-react";
import Modal from "./modal";
import { Button } from "./ui/button";


interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  description: string;
  btnName: string;
}

export const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
  btnName,
}: LogoutModalProps) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant={"outline"} disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-violet-500 hover:bg-violet-800"
          onClick={onConfirm}>
          {isLoading ? (
            <Loader className="text-gray-50 animate-spin" />
          ) : (
            `${btnName}`
          )}
        </Button>
      </div>
    </Modal>
  );
};
