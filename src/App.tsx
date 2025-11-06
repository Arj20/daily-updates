import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { Header } from "./components/Header";
import { UpdateForm } from "./components/UpdateForm";
import { UpdateCard } from "./components/UpdateCard";
import { UpdateTable } from "./components/UpdateTable";
import { EditModal } from "./components/EditModal";
import { googleSheetsService } from "./services/googleSheets";
import type { DailyUpdate, ViewMode } from "./types";
import "./App.css";

function AppContent() {
  const [updates, setUpdates] = useState<DailyUpdate[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: "cards" });
  const [isLoading, setIsLoading] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<DailyUpdate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load updates on component mount
  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      setIsLoading(true);
      console.log("Loading updates from Google Sheets...");
      const data = await googleSheetsService.getAllRecords();
      setUpdates(data);
    } catch (error) {
      console.error("Error loading updates:", error);
      toast.error("Failed to load updates");
      // For demo purposes, use mock data if API fails
      setUpdates([
        {
          sn: 1,
          date: new Date().toISOString(),
          accountName: "Sample Account",
          projectName: "Demo Project",
          remarks: "This is a sample update",
          id: "demo_1",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUpdate = async (newUpdate: Omit<DailyUpdate, "sn" | "id">) => {
    try {
      setIsLoading(true);
      console.log("Adding new update:", newUpdate);

      // Use Google Sheets service to add the record
      const addedRecord = await googleSheetsService.addRecord(newUpdate);
      console.log("Added record:", addedRecord);

      // Add to local state
      setUpdates((prev) => [addedRecord, ...prev]);
      toast.success("Update added successfully! 🎉");
    } catch (error) {
      console.error("Error adding update:", error);
      toast.error("Failed to add update");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUpdate = (update: DailyUpdate) => {
    setEditingUpdate(update);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: Partial<DailyUpdate>) => {
    try {
      setIsLoading(true);
      console.log("Updating record:", id, updates);

      // Use Google Sheets service to update the record
      const updatedRecord = await googleSheetsService.updateRecord(id, updates);
      console.log("Updated record:", updatedRecord);

      // Update local state
      setUpdates((prev) =>
        prev.map((update) => (update.id === id ? updatedRecord : update))
      );

      toast.success("Update saved successfully! ✨");
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) {
      return;
    }

    try {
      setIsLoading(true);
      console.log("Deleting record:", id);

      // Use Google Sheets service to delete the record
      await googleSheetsService.deleteRecord(id);
      console.log("Deleted record from Google Sheets");

      // Update local state
      setUpdates((prev) => prev.filter((update) => update.id !== id));
      toast.success("Update deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUpdate(null);
  };

  return (
    <div className="app">
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="main-content">
        <div className="content-container">
          <section className="form-section">
            <UpdateForm onSubmit={handleAddUpdate} isLoading={isLoading} />
          </section>

          <section className="updates-section">
            {viewMode.type === "cards" ? (
              <div className="cards-container">
                {updates.length === 0 ? (
                  <div className="empty-state">
                    <p>No updates yet. Add your first update above! 💖</p>
                  </div>
                ) : (
                  updates.map((update) => (
                    <UpdateCard
                      key={update.id || update.sn}
                      update={update}
                      onEdit={handleEditUpdate}
                      onDelete={handleDeleteUpdate}
                    />
                  ))
                )}
              </div>
            ) : (
              <UpdateTable
                updates={updates}
                onEdit={handleEditUpdate}
                onDelete={handleDeleteUpdate}
              />
            )}
          </section>
        </div>
      </main>

      <EditModal
        update={editingUpdate}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        isLoading={isLoading}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
