import React from "react";
import "./SidebarDownBtns.css";

interface SidebarDownBtnsProps {
  onFilterChange: (filter: "all" | "completed" | "deleted") => void;
  activeFilter: string;
}

const SidebarDownBtns: React.FC<SidebarDownBtnsProps> = ({
  onFilterChange,
  activeFilter,
}) => {
  return (
    <div className="btns-down">
      <button
        className={activeFilter === "all" ? "active" : ""}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        className={activeFilter === "completed" ? "active" : ""}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>
      <button
        className={activeFilter === "deleted" ? "active" : ""}
        onClick={() => onFilterChange("deleted")}
      >
        Deleted
      </button>
    </div>
  );
};

export default SidebarDownBtns;
