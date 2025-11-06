import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { DailyUpdate } from "../types";

interface UpdateTableProps {
  updates: DailyUpdate[];
  onEdit: (update: DailyUpdate) => void;
  onDelete: (id: string) => void;
}

export const UpdateTable: React.FC<UpdateTableProps> = ({
  updates,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (updates.length === 0) {
    return (
      <div className="empty-state">
        <p>No updates yet. Add your first update above!</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="updates-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Date</th>
            <th>Account</th>
            <th>Project</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {updates.map((update) => (
            <tr key={update.id || update.sn}>
              <td className="serial-cell">#{update.sn}</td>
              <td className="date-cell">{formatDate(update.date)}</td>
              <td className="account-cell">{update.accountName}</td>
              <td className="project-cell">{update.projectName}</td>
              <td className="remarks-cell">
                {update.remarks ? (
                  <div className="remarks-content">
                    <p className="remarks-paragraph">{update.remarks}</p>
                  </div>
                ) : (
                  <span className="no-remarks">—</span>
                )}
              </td>
              <td className="actions-cell">
                <button
                  className="action-button edit-button"
                  onClick={() => onEdit(update)}
                  title="Edit"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => update.id && onDelete(update.id)}
                  title="Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
