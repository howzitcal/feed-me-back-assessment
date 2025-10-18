"use client";

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

interface UserDialogProps {
  title: string;
  body: string;
  open: boolean;
  onConfirm: () => any;
}
const UserDialog: React.FC<UserDialogProps> = ({
  title,
  body,
  open,
  onConfirm,
}) => {
  return (
    <>
      <Dialog.Root open={open} placement={"center"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>{body}</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onConfirm}>
                    Ok
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={onConfirm} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UserDialog;
