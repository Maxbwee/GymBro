'use client';

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "default";
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    const confirmClasses =
        variant === "danger"
            ? "text-red-500 pink:text-rose-400 hover:text-red-600 pink:hover:text-rose-500"
            : "text-green-600 pink:text-pink-600 hover:text-green-700 pink:hover:text-pink-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white pink:bg-pink-100 rounded-xl shadow-lg p-5 flex flex-col gap-4">
                <h3 className="font-bold text-black pink:text-pink-900">{title}</h3>
                <p className="text-sm text-zinc-600 pink:text-pink-700">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="text-sm text-zinc-500 pink:text-pink-400 hover:text-zinc-700 pink:hover:text-pink-600">
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} className={`text-sm font-semibold ${confirmClasses}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}