import { useState, useLayoutEffect, useRef } from "react";

export function useRowHeights() {
  const [rowHeights, setRowHeights] = useState<Record<string | number, number>>({});
  const rowRefs = useRef<Map<string | number, HTMLTableRowElement>>(new Map());

  // Callback ref untuk mendaftarkan elemen <tr> ke Map
  const setRowRef = (id: string | number) => (el: HTMLTableRowElement | null) => {
    if (el) {
      rowRefs.current.set(id, el);
    } else {
      rowRefs.current.delete(id);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Inisialisasi ResizeObserver
    const observer = new ResizeObserver((entries) => {
      const newHeights: Record<string | number, number> = {};

      entries.forEach((entry) => {
        // Ambil ID/Key yang disimpan di attribute data-row-id
        const rowId = entry.target.getAttribute("data-row-id");
        if (rowId !== null) {
          // borderBoxSize memberikan tinggi total termasuk padding & border
          const borderBoxSize = entry.borderBoxSize?.[0];
          const height = borderBoxSize 
            ? borderBoxSize.blockSize 
            : entry.target.getBoundingClientRect().height;

          newHeights[rowId] = height;
        }
      });

      // Update state tinggi baris
      setRowHeights((prev) => ({ ...prev, ...newHeights }));
    });

    // Amati setiap baris yang terdaftar
    rowRefs.current.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return { rowHeights, setRowRef };
}