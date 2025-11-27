export interface Recipient {
    email: string;
    name: string;
    isInternal: boolean;
    domain: string;
}

export interface EmailData {
    recipients: Recipient[];
    subject: string;
    body: string;
    attachments: string[];
    hasAttachmentKeywords: boolean;
    hasZipFiles: boolean;
}

export interface ValidationResult {
    status: 'ok' | 'warning' | 'error';
    message: string;
    checkboxRequired: boolean;
}

export interface CheckResults {
    sender: ValidationResult;
    recipients: ValidationResult;
    subject: ValidationResult;
    attachments: ValidationResult;
    hasExternalRecipients: boolean;
    externalRecipients: Recipient[];
    internalRecipients: Recipient[];
    domains: string[];
}
