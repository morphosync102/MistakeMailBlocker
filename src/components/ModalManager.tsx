import React, { useState } from 'react';
import { CheckResults, EmailData } from '../types';
import { CheckModal } from './CheckModal';
import { ConfirmModal } from './ConfirmModal';
import { FinalConfirmModal } from './FinalConfirmModal';
import { generateSendCode } from '../utils';

interface ModalManagerProps {
    emailData: EmailData;
    checkResults: CheckResults;
    onSend: () => void;
    onCancel: () => void;
}

type ModalState = 'check' | 'confirm' | 'final-check' | null;

export const ModalManager: React.FC<ModalManagerProps> = ({
    emailData,
    checkResults,
    onSend,
    onCancel,
}) => {
    const [modalState, setModalState] = useState<ModalState>('check');
    const [sendCode] = useState(generateSendCode());

    const handleNext = () => {
        setModalState('confirm');
    };

    const handleConfirmNext = () => {
        setModalState('final-check');
    };

    const handleBackToCheck = () => {
        setModalState('check');
    };

    const handleBackToConfirm = () => {
        setModalState('confirm');
    };

    const handleCancel = () => {
        setModalState(null);
        onCancel();
    };

    const handleSend = () => {
        setModalState(null);
        onSend();
    };

    if (!modalState) return null;

    return (
        <>
            {modalState === 'check' && (
                <CheckModal
                    checkResults={checkResults}
                    onCancel={handleCancel}
                    onNext={handleNext}
                />
            )}

            {modalState === 'confirm' && (
                <ConfirmModal
                    checkResults={checkResults}
                    emailData={emailData}
                    sendCode={sendCode}
                    onBack={handleBackToCheck}
                    onCancel={handleCancel}
                    onNext={handleConfirmNext}
                />
            )}

            {modalState === 'final-check' && (
                <FinalConfirmModal
                    onBack={handleBackToConfirm}
                    onCancel={handleCancel}
                    onSend={handleSend}
                />
            )}
        </>
    );
};
