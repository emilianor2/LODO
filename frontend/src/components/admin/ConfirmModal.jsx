import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
                        <AlertTriangle className="h-6 w-6 text-rose-600" />
                    </div>
                    <DialogTitle className="text-center">{title || "¿Estás seguro?"}</DialogTitle>
                    <DialogDescription className="text-center">
                        {message || "Esta acción no se puede deshacer. Por favor, confirma tu decisión."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex sm:justify-center gap-3 mt-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 font-bold"
                    >
                        {loading ? "Procesando..." : "Sí, eliminar"}
                        {!loading && <Trash2 className="ml-2 h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
