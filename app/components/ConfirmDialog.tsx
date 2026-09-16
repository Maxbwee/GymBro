'use client';

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white pink:bg-pink-100 rounded-xl shadow-lg p-5 flex flex-col gap-4">
                <h3 className="font-bold text-black pink:text-pink-900">{title}</h3>
                <p className="text-sm text-zinc-600 pink:text-pink-700">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="text-sm text-zinc-500 pink:text-pink-400 hover:text-zinc-700 pink:hover:text-pink-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="text-sm font-semibold text-red-500 pink:text-rose-400 hover:text-red-600 pink:hover:text-rose-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}