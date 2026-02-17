import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { type Props } from "../types/modal";

export const SortableItem: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl overflow-hidden border-2 shadow-lg transition-all duration-200 ${
        isDragging
          ? "border-primary-green shadow-2xl shadow-primary-green/30 scale-105 z-50 opacity-90"
          : "border-gray-200 hover:border-soft-green hover:shadow-xl"
      }`}
    >
      {/* Image Container */}
      <div className="relative">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-10 bg-primary-green/90 hover:bg-primary-green text-white p-2 rounded-lg cursor-grab active:cursor-grabbing shadow-lg transition-all duration-200 hover:scale-110"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Image */}
        <div className="relative w-full pt-[75%] from-gray-100 to-gray-50 overflow-hidden group">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ImageIcon className="w-4 h-4 text-light-green" />
          <h4 className="font-semibold text-gray-900 truncate text-sm">
            {item.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white border-2 border-blue-200 hover:border-blue-500 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Edit photo"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-200 hover:border-red-500 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Delete photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
