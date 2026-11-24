"use client";

export default function DeleteButton({
  action,
  id,
  label = "حذف",
  confirmText = "مطمئن هستید؟ این عمل قابل بازگشت نیست.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn-danger">
        {label}
      </button>
    </form>
  );
}
