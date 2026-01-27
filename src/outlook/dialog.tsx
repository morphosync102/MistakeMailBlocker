import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ModalManager } from '../components/ModalManager';
import { EmailData, Recipient } from '../types';
import '../styles.css';

// Minimal polyfill for extractDomain if not imported from utils
const extractDomain = (email: string) => {
    const match = email.match(/@(.+)$/);
    return match ? match[1].toLowerCase() : '';
};

const App = () => {
    const [emailData, setEmailData] = useState<EmailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Office.onReady(async () => {
            try {
                const item = Office.context.mailbox.item;
                if (!item) {
                    throw new Error('No item found');
                }

                // 1. Get Recipients
                // item.to, item.cc, item.bcc are generic types. We need to cast or inspect.
                // In generic read mode they are arrays of {displayName, emailAddress}
                // In Compose mode (OnSend), `getAsync` is often needed for full details,
                // BUT `item.to` might be directly accessible as property in some contexts or need getAsync.
                // For "ItemIs" rule in Edit form, it's Compose mode.

                // We need to use getAsync for recipients in Compose mode
                const promises = [
                    new Promise<any[]>((resolve) => item.to.getAsync(r => resolve(r.status === Office.AsyncResultStatus.Succeeded ? r.value : []))),
                    new Promise<any[]>((resolve) => item.cc.getAsync(r => resolve(r.status === Office.AsyncResultStatus.Succeeded ? r.value : []))),
                    new Promise<any[]>((resolve) => item.bcc.getAsync(r => resolve(r.status === Office.AsyncResultStatus.Succeeded ? r.value : []))),
                    new Promise<string>((resolve) => item.subject.getAsync(r => resolve(r.status === Office.AsyncResultStatus.Succeeded ? r.value : ''))),
                    new Promise<string>((resolve) => item.body.getAsync(Office.CoercionType.Text, r => resolve(r.status === Office.AsyncResultStatus.Succeeded ? r.value : ''))),
                    new Promise<any[]>((resolve) => resolve(item.attachments ? item.attachments : [])) // attachments might be sync or async depending on API version, usually sync property in Read, but in Compose `getAttachmentsAsync` exists
                ];

                // *Attachments in Compose mode*: item.getAttachmentsAsync
                const attachmentPromise = new Promise<any[]>((resolve) => {
                    if (typeof item.getAttachmentsAsync === 'function') {
                        item.getAttachmentsAsync((result) => {
                            resolve(result.status === Office.AsyncResultStatus.Succeeded ? result.value : []);
                        });
                    } else {
                        resolve([]);
                    }
                });

                // Replace the static attachment promise with the real one
                promises[5] = attachmentPromise;

                const [to, cc, bcc, subject, body, attachments] = await Promise.all(promises) as [any[], any[], any[], string, string, any[]];

                const mapRecipient = (r: any, type: 'to' | 'cc' | 'bcc'): Recipient => ({
                    email: r.emailAddress,
                    name: r.displayName || r.emailAddress,
                    isInternal: false, // Default to external logic
                    domain: extractDomain(r.emailAddress),
                    type
                });

                const recipients: Recipient[] = [
                    ...to.map((r: any) => mapRecipient(r, 'to')),
                    ...cc.map((r: any) => mapRecipient(r, 'cc')),
                    ...bcc.map((r: any) => mapRecipient(r, 'bcc'))
                ];

                // Map attachments
                // Compose attachment objects have `name` property
                const attachmentNames = attachments.map((a: any) => a.name);
                const hasZipFiles = attachmentNames.some((n: string) => n.toLowerCase().endsWith('.zip'));
                const hasAttachmentKeywords = /添付/.test(subject + body) || /attach/.test(subject + body); // Simple check

                const data: EmailData = {
                    sender: Office.context.mailbox.userProfile.emailAddress, // Current user
                    recipients,
                    subject,
                    body,
                    attachments: attachmentNames,
                    hasZipFiles,
                    hasAttachmentKeywords
                };

                setEmailData(data);
            } catch (error) {
                console.error('Failed to load email data', error);
            } finally {
                setIsLoading(false);
            }
        });
    }, []);

    const handleSend = () => {
        Office.context.ui.messageParent('ALLOW_SEND');
    };

    const handleCancel = () => {
        Office.context.ui.messageParent('CANCEL_SEND');
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!emailData) {
        return <div className="p-4">Failed to load email data. <button onClick={handleSend} className="underline">Force Send</button></div>;
    }

    // ModalManager manages the state (Check -> Confirm -> Final), we just render it.
    // However, ModalManager usually uses "fixed inset-0" which works fine as we are in a full-screen-ish dialog (iframe).
    return (
        <div className="h-screen w-screen bg-gray-100">
            <ModalManager
                emailData={emailData}
                onSend={handleSend}
                onCancel={handleCancel}
            />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
