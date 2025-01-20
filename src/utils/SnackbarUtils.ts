'use client';

import { toast, ToastOptions } from 'react-toastify';
import { ToastType } from 'types';

export default class SnackbarUtils {
  private static showToast<T>(type: ToastType, message: string, callback?: () => void, options?: ToastOptions<T>) {
    toast[type]<T>(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options
    });
    if (callback) {
      setTimeout(callback, 2000);
    }
  }

  static success = <T>(message: string, options?: ToastOptions<T>) => {
    SnackbarUtils.showToast<T>('success', message, undefined, options);
  };

  static warning = <T>(message: string, options?: ToastOptions<T>) => {
    SnackbarUtils.showToast<T>('warning', message, undefined, options);
  };

  static info = <T>(message: string, options?: ToastOptions<T>) => {
    SnackbarUtils.showToast<T>('info', message, undefined, options);
  };

  static error = <T>(message: string, options?: ToastOptions<T>) => {
    SnackbarUtils.showToast<T>('error', message, undefined, {
      ...options,
      autoClose: 5000,
    });
  };

  static errorWithDelay = <T>(message: string, callback?: () => void, options?: ToastOptions<T>) => {
    SnackbarUtils.showToast<T>('error', message, callback, options);
  };

  static dismissToast(toastId: string) {
    if (toast.isActive(toastId)) {
      toast.dismiss(toastId);
    }
  }

  static isActiveToast(toastId: string) {
    return toast.isActive(toastId);
  }
}
