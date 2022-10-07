import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

const styles = {
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 48,
  paddingRight: 48,
  color: "#000",
};

export function Modal({ children, show, type, onConfirm, onCancel, title }) {
  return (
    <SweetAlert
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel || null}
      showCancel
      cancelBtnText="Cancelar"
      confirmBtnText="Confirmar"
      type={type}
      show={show}
      confirmBtnStyle={styles}
      cancelBtnStyle={{ ...styles, color: "#f00" }}
    >
      {children}
    </SweetAlert>
  );
}
