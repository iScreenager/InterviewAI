import { Loader } from "lucide-react";
import Modal from "./modal";
import { Button } from "./ui/button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LogoutModalProps) => {
  return (
    <Modal
      title="Are you sure you want to logout?"
      description="You will need to log in again to access your account."
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button variant={"outline"} disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-800"
          onClick={onConfirm}>
          {isLoading ? (
            <Loader className="text-gray-50 animate-spin" />
          ) : (
            "Logout"
          )}
        </Button>
      </div>
    </Modal>
  );
};
