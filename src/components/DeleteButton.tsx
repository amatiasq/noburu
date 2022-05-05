import {
  Button,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

let showModal = true;

export interface DeleteButtonProps {
  gridArea?: string;
  label: string;
  onConfirm: () => unknown;
}

export function DeleteButton({
  gridArea,
  label,
  onConfirm,
}: DeleteButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirm = useCallback(() => {
    onClose();
    onConfirm();
  }, [onConfirm]);

  const yesAll = useCallback(() => {
    showModal = false;
    confirm();
  }, [confirm]);

  return (
    <>
      <IconButton
        gridArea={gridArea}
        title={label}
        aria-label={label}
        icon={<FaTimes />}
        onClick={showModal ? onOpen : onConfirm}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{label}?</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirm}>
              Borrar
            </Button>
            <Button colorScheme="yellow" mr={3} onClick={yesAll}>
              Si a todo
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

DeleteButton.displayName = 'DeleteButton';