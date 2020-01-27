import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// eslint-disable-next-line react/prop-types
const alert = ({ isOpen, message, onClose, severity }) => {
  return (
    <Snackbar open={isOpen}>
      <Alert
        onClose={() => {
          onClose();
        }}
        severity={severity}
      >
        {`${message}`}
      </Alert>
    </Snackbar>
  );
};
/**
 * Displays information about action failure
 */
export const errorAlert = ({ isOpen, message, onClose }) => {
  return alert({ isOpen, message, onClose, severity: 'error' });
};
/**
 * Displays information about a successful completion of the action
 */
export const successAlert = ({ isOpen, message, onClose }) => {
  return alert({ isOpen, message, onClose, severity: 'success' });
};

export const showAlert = (
  pending: boolean,
  error: any,
  success: any,
  clearError: () => any,
  clearSuccess: () => any
) => {
  if (!pending && !!error) {
    return errorAlert({
      isOpen: !!error,
      message: error,
      onClose: () => clearError()
    });
  } else if (!pending && !!success) {
    return successAlert({
      isOpen: !!success,
      message: success,
      onClose: () => clearSuccess()
    });
  }
};
