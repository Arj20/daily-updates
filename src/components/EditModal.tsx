import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSave,
  FiUser,
  FiFolderPlus,
  FiMessageCircle,
} from "react-icons/fi";
import type { DailyUpdate } from "../types";

interface EditModalProps {
  update: DailyUpdate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<DailyUpdate>) => Promise<void>;
  isLoading?: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
  update,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    accountName: "",
    projectName: "",
    remarks: "",
  });

  useEffect(() => {
    if (update) {
      setFormData({
        accountName: update.accountName,
        projectName: update.projectName,
        remarks: update.remarks,
      });
    }
  }, [update]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!update?.id || !formData.accountName || !formData.projectName) {
      return;
    }

    await onSave(update.id, formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen || !update) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Update #{update.sn}</h2>
          <button className="close-button" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-accountName">
              <FiUser size={16} />
              Account Name
            </label>
            <input
              type="text"
              id="edit-accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Enter account name..."
              required
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-projectName">
              <FiFolderPlus size={16} />
              Project Name
            </label>
            <input
              type="text"
              id="edit-projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name..."
              required
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-remarks">
              <FiMessageCircle size={16} />
              Remarks
            </label>
            <textarea
              id="edit-remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Add your remarks..."
              rows={3}
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={
                isLoading || !formData.accountName || !formData.projectName
              }
            >
              <FiSave size={16} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
