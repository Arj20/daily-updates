import React, { useState } from "react";
import { FiPlus, FiUser, FiFolderPlus, FiMessageCircle } from "react-icons/fi";
import type { DailyUpdate } from "../types";

interface UpdateFormProps {
  onSubmit: (update: Omit<DailyUpdate, "sn" | "id">) => Promise<void>;
  isLoading?: boolean;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    accountName: "",
    projectName: "",
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountName || !formData.projectName) {
      return;
    }

    const update: Omit<DailyUpdate, "sn" | "id"> = {
      ...formData,
      date: new Date().toISOString(),
    };

    await onSubmit(update);

    // Reset form
    setFormData({
      accountName: "",
      projectName: "",
      remarks: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <div className="form-group">
        <label htmlFor="accountName">
          <FiUser size={18} />
          Account Name
        </label>
        <input
          type="text"
          id="accountName"
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
        <label htmlFor="projectName">
          <FiFolderPlus size={18} />
          Project Name
        </label>
        <input
          type="text"
          id="projectName"
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
        <label htmlFor="remarks">
          <FiMessageCircle size={18} />
          Remarks
        </label>
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add your remarks..."
          rows={3}
          autoComplete="off"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading || !formData.accountName || !formData.projectName}
      >
        <FiPlus size={18} />
        {isLoading ? "Adding..." : "Add Update"}
      </button>
    </form>
  );
};
