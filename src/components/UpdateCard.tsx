import React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiFolderPlus,
  FiMessageCircle,
} from "react-icons/fi";
import type { DailyUpdate } from "../types";

interface UpdateCardProps {
  update: DailyUpdate;
  onEdit: (update: DailyUpdate) => void;
  onDelete: (id: string) => void;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({
  update,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="update-card">
      <div className="card-header">
        <span className="serial-number">#{update.sn}</span>
        <div className="card-actions">
          <button
            className="action-button edit-button"
            onClick={() => onEdit(update)}
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            className="action-button delete-button"
            onClick={() => update.id && onDelete(update.id)}
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-content">
        <div className="card-field">
          <div className="field-icon">
            <FiCalendar size={14} />
          </div>
          <div className="field-content">
            <span className="field-label">Date</span>
            <span className="field-value">{formatDate(update.date)}</span>
          </div>
        </div>

        <div className="card-field">
          <div className="field-icon">
            <FiUser size={14} />
          </div>
          <div className="field-content">
            <span className="field-label">Account</span>
            <span className="field-value">{update.accountName}</span>
          </div>
        </div>

        <div className="card-field">
          <div className="field-icon">
            <FiFolderPlus size={14} />
          </div>
          <div className="field-content">
            <span className="field-label">Project</span>
            <span className="field-value">{update.projectName}</span>
          </div>
        </div>

        {update.remarks && (
          <div className="card-field remarks">
            <div className="field-icon">
              <FiMessageCircle size={14} />
            </div>
            <div className="field-content">
              <span className="field-label">Remarks</span>
              <span className="field-value">{update.remarks}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
