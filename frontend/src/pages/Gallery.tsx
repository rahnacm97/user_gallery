import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  LogOut,
  Plus,
  GripVertical,
  Trash2,
  Loader2,
  Upload,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import api from "../services/api";
import { getErrorMessage } from "../types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import { API_ROUTES } from "../shared/constants/constants";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { UploadPreviewModal } from "../components/UploadPreviewModal";
import { EditItemModal } from "../components/EditItemModal";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  orderIndex: number;
}

const Gallery: React.FC = () => {
  const { logout, user } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; title: string; preview: string }[]
  >([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get(API_ROUTES.GALLERY);
      setItems(response.data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to fetch gallery items"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((file) => ({
      file,
      title: file.name.split(".")[0],
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles(newFiles);
    setShowUploadModal(true);
    e.target.value = "";
  };

  const closeUploadModal = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
    setShowUploadModal(false);
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((item) => {
      formData.append("images", item.file);
      formData.append("titles", item.title);
    });

    try {
      await api.post(API_ROUTES.GALLERY_UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photos uploaded successfully!");
      closeUploadModal();
      fetchGallery();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const updateTitle = (index: number, newTitle: string) => {
    const updated = [...selectedFiles];
    updated[index].title = newTitle;
    setSelectedFiles(updated);
  };

  const removeFile = (index: number) => {
    const updated = [...selectedFiles];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setSelectedFiles(updated);
    if (updated.length === 0) {
      setShowUploadModal(false);
    }
  };

  const handleEditClick = (item: GalleryItem) => {
    setEditingItem(item);
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const handleEditSave = async (title: string, file: File | null) => {
    if (!editingItem) return;

    setUpdating(true);
    const formData = new FormData();
    formData.append("title", title);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await api.put(
        `${API_ROUTES.GALLERY}/${editingItem.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setItems(
        items.map((item) =>
          item.id === editingItem.id ? response.data.item : item,
        ),
      );
      toast.success("Photo updated successfully!");
      closeEditModal();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Update failed"));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteItemId(id);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    setDeleting(true);
    try {
      await api.delete(`${API_ROUTES.GALLERY}/${deleteItemId}`);
      setItems(items.filter((item) => item.id !== deleteItemId));
      toast.success("Photo deleted successfully!");
      setDeleteItemId(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteItemId(null);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      orderIndex: index,
    }));
    setItems(updatedItems);

    try {
      await api.post(API_ROUTES.GALLERY_REORDER, {
        orderData: updatedItems.map((item) => ({
          id: item.id,
          orderIndex: item.orderIndex,
        })),
      });
      toast.success("Gallery order updated!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to save collection order"));
      fetchGallery();
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "var(--bg-gradient, linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%))",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Photo Gallery
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-primary-green rounded-full"></span>
                <span className="text-sm">Welcome, {user?.email}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <label
                className={`inline-flex items-center gap-2 px-5 py-3 bg-primary-green hover:bg-dark-green text-white font-semibold rounded-xl shadow-lg shadow-primary-green/30 hover:shadow-dark-green/40 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Upload Photos</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary-green hover:text-primary-green transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-green animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading your gallery...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl from-primary-green/10 to-light-green/10 mb-6">
              <Upload className="w-12 h-12 text-primary-green" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your gallery by uploading your first photos
            </p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-green hover:bg-dark-green text-white font-semibold rounded-xl shadow-lg shadow-primary-green/30 hover:shadow-dark-green/40 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5" />
              <span>Upload Your First Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white rounded-xl overflow-hidden border-2 shadow-lg transition-all duration-200 ${
                              snapshot.isDragging
                                ? "border-primary-green shadow-2xl shadow-primary-green/30 scale-105 z-50"
                                : "border-gray-200 hover:border-soft-green hover:shadow-xl"
                            }`}
                          >
                            <div className="relative">
                              <div
                                {...provided.dragHandleProps}
                                className="absolute top-3 left-3 z-10 bg-primary-green/90 hover:bg-primary-green text-white p-2 rounded-lg cursor-grab active:cursor-grabbing shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              <div className="relative w-full h-64 from-gray-100 to-gray-50 overflow-hidden group">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <ImageIcon className="w-4 h-4 text-light-green " />
                                <span className="font-semibold text-gray-900 truncate">
                                  {item.title}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className=" p-2 bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white border-2 border-blue-200 hover:border-blue-500 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                  aria-label="Edit photo"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className=" p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-200 hover:border-red-500 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                  aria-label="Delete photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ImageIcon className="w-4 h-4 text-primary-green" />
              <span className="font-semibold text-gray-900">
                {items.length}
              </span>
              <span>
                {items.length === 1 ? "photo" : "photos"} in your gallery
              </span>
            </div>
          </div>
        )}

        <UploadPreviewModal
          isOpen={showUploadModal}
          onClose={closeUploadModal}
          files={selectedFiles}
          onUpload={handleBulkUpload}
          onRemoveFile={removeFile}
          onTitleChange={updateTitle}
          isUploading={uploading}
        />

        <EditItemModal
          key={editingItem?.id || "edit-modal"}
          isOpen={!!editingItem}
          onClose={closeEditModal}
          item={editingItem}
          onSave={handleEditSave}
          isUpdating={updating}
        />

        <ConfirmationModal
          isOpen={!!deleteItemId}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title="Delete Photo"
          message="Are you sure you want to delete this photo? This will permanently remove it from your gallery."
          confirmText="Delete Photo"
          confirmVariant="danger"
          isLoading={deleting}
        />
      </div>
    </div>
  );
};

export default Gallery;
