"use client";

import { deleteMenuItemAction } from "./actions";

export function DeleteMenuItemButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form
      action={deleteMenuItemAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Hapus "${name}"? Tindakan ini tidak dapat dibatalkan.`
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600 hover:underline"
      >
        Hapus
      </button>
    </form>
  );
}
