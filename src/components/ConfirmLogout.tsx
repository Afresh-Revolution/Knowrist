import React, { useEffect, useId } from "react";
import { useDialogHover } from "../hooks/useDialogHover";

interface ConfirmLogoutProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogout: React.FC<ConfirmLogoutProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const titleId = useId();
  const [isClosing, setIsClosing] = React.useState(false);
  const { dialogRef, style: hoverStyle } = useDialogHover();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      setIsClosing(false);
    }, 400);
  };

  useEffect(() => {
    if (!isOpen && !isClosing) {
      setIsClosing(false);
      return;
    }

    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isClosing]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`confirm-entry-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        className="confirm-entry-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        style={hoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-entry-content">
          <div className="confirm-entry-icon">
            <div className="confirm-entry-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 id={titleId} className="confirm-entry-title">
            Confirm Logout
          </h1>

          <p
            className="confirm-entry-subtitle"
            style={{ textAlign: "left", marginBottom: "20px" }}
          >
            Are you sure you want to logout?
          </p>

          <div
            className="confirm-entry-balance-card"
            style={{ textAlign: "left", marginBottom: "24px" }}
          >
            <div
              style={{
                marginBottom: "12px",
                color: "#f59e0b",
                fontWeight: 600,
              }}
            >
              ⚠️ Important Warning
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                margin: 0,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              If you logout, you may not be able to rejoin any games that you
              have already paid for and activated or has already started. Please note
              that activation codes are only valid once before the game starts.
            </p>
          </div>

          <button
            type="button"
            className="confirm-entry-pay-button"
            onClick={handleConfirm}
          >
            Yes, Logout
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="confirm-entry-cancel"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;
