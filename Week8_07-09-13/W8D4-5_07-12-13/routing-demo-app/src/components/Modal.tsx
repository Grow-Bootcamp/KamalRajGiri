import type{ ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};


function Modal({ isOpen, onClose, children }: ModalProps) {
    useEffect(()=>{
        if(!isOpen) return;

        const handleKeyDown = (event:KeyboardEvent) => {
            if(event.key === 'Escape'){
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return()=> {
            window.removeEventListener('keydown',handleKeyDown);
        };
    },[isOpen,onClose]);

    if (!isOpen) {
        return null;
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}

export default Modal;
