import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import * as S from "./styles";

export function ModalDialog({
  children,
  title,
  isOpen = false,
  size = "sm",
  handleToggle,
  handleClear,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment} beforeLeave={handleClear}>
      <Dialog as="div" onClose={handleToggle}>
        <Transition.Child as={Fragment}>
          <div />
        </Transition.Child>

        <S.Container>
          <Transition.Child as={Fragment}>
            <Dialog.Panel>
              <S.Content size={size}>
                {title && <Dialog.Title>{title}</Dialog.Title>}
                <section className="content">{children}</section>
              </S.Content>
            </Dialog.Panel>
          </Transition.Child>
        </S.Container>
      </Dialog>
    </Transition>
  );
}
