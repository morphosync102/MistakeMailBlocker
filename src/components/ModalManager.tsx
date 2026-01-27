import React, { useState } from 'react';
import { EmailData } from '../types';
import { CheckModal } from './CheckModal';
import { ConfirmModal } from './ConfirmModal';
import { FinalConfirmModal } from './FinalConfirmModal';

interface ModalManagerProps {
    emailData: EmailData;
    onSend: () => void;
    onCancel: () => void;
}

type ModalState = 'check' | 'confirm' | 'final-check' | null;

export const ModalManager: React.FC<ModalManagerProps> = ({
    emailData,
    onSend,
    onCancel,
}) => {
    const [modalState, setModalState] = useState<ModalState>('check');

    const handleNext = () => {
        setModalState('confirm');
    };

    const handleConfirmNext = () => {
        setModalState('final-check');
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

    // Helper to extract email lists
    const toAddresses = emailData.recipients
        .filter(r => r.type === 'to')
        .map(r => r.email);

    const ccAddresses = emailData.recipients
        .filter(r => r.type === 'cc')
        .map(r => r.email);

    const bccAddresses = emailData.recipients
        .filter(r => r.type === 'bcc')
        .map(r => r.email);

    // Calculate derived values for ConfirmModal
    const lines = emailData.body.split(/\r\n|\r|\n/);
    const lineCount = lines.length;
    const bodyPreview = emailData.body;

    return (
        <>
            {modalState === 'check' && (
                <CheckModal
                    fromAddress={emailData.sender}
                    toAddresses={toAddresses}
                    ccAddresses={ccAddresses}
                    bccAddresses={bccAddresses}
                    subject={emailData.subject}
                    hasAttachment={emailData.attachments.length > 0}
                    hasZipFile={emailData.hasZipFiles}
                    bodyMentionsAttachment={emailData.hasAttachmentKeywords}
                    attachments={emailData.attachments}
                    onCancel={handleCancel}
                    onNext={handleNext}
                />
            )}

// Removed unused checkResults from props and logic

            {modalState === 'confirm' && (
                <ConfirmModal
                    toAddresses={toAddresses}
                    ccAddresses={ccAddresses}
                    bccAddresses={bccAddresses}
                    bodyPreview={bodyPreview}
                    lineCount={lineCount}
                    onCancel={handleCancel}
                    onNext={handleConfirmNext}
                />
            )}

            {modalState === 'final-check' && (
                <FinalConfirmModal
                    onCancel={handleBackToConfirm} // "Go back" button
                    onConfirm={handleSend}
                />
            )}
        </>
    );
};
