import { useState, useCallback } from "react";
import { getApiUrl } from "./useApi";

export const usePin = ({ token, settings, setToast, performLogout, setIsPinStep }) => {
  const [pinMode, setPinMode] = useState(null); // "create" | "delete" | "reset" | "export" | "import"
  const [isPinStepState, setIsPinStepState] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const internalSetIsPinStep = (val) => {
    setIsPinStepState(val);
    if (setIsPinStep) setIsPinStep(val);
  };

  const validatePin = useCallback(async () => {
    if (!settings.pinEnabled) {
      setPinError("");
      return true;
    }
    if (!pin || pin.length !== 4) {
      setPinError("PIN harus 4 digit.");
      return false;
    }
    try {
      const response = await fetch(`${getApiUrl()}/api/user/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
        body: JSON.stringify({ pin }),
      });
      if (response.status === 401) {
        performLogout(true);
        setPinError("Session expired. Silakan login kembali.");
        return false;
      }
      if (response.ok) {
        setPinError("");
        return true;
      } else {
        const data = await response.json();
        setPinError(data.message || "PIN salah. Coba lagi.");
        return false;
      }
    } catch (error) {
      setPinError("Gagal memverifikasi PIN.");
      return false;
    }
  }, [settings.pinEnabled, pin, token, performLogout]);

  const resetPinFlow = useCallback(() => {
    internalSetIsPinStep(false);
    setPinMode(null);
    setPin("");
    setPinError("");
  }, []);

  const handlePinInput = (event) => {
    setPin(event.target.value.slice(0, 4));
    setPinError("");
  };

  const handlePinBack = (setPendingPayload, setDeleteTarget) => {
    if (pinMode === "create" || pinMode === "edit") {
      internalSetIsPinStep(false);
      setPin("");
      setPinError("");
      setPinMode(null);
      if (setPendingPayload) setPendingPayload(null);
      return;
    }
    if (pinMode === "delete") {
      if (setDeleteTarget) setDeleteTarget(null);
    }
    resetPinFlow();
  };

  return {
    pinMode, setPinMode,
    isPinStep: isPinStepState, setIsPinStep: internalSetIsPinStep,
    pin, setPin,
    pinError, setPinError,
    validatePin, resetPinFlow, handlePinInput, handlePinBack
  };
};
