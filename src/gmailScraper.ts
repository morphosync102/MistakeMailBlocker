import { EmailData, Recipient } from './types';
import { extractDomain, hasAttachmentKeywords } from './utils';

/**
 * Gmailの作成画面からメールデータを抽出
 */
export function extractEmailData(): EmailData | null {
    try {
        // 送信先の取得
        const recipients = extractRecipients();

        // 件名の取得
        const subject = extractSubject();

        // 本文の取得
        const body = extractBody();

        // 添付ファイルの取得
        const attachments = extractAttachments();

        return {
            recipients,
            subject,
            body,
            attachments,
            hasAttachmentKeywords: hasAttachmentKeywords(subject + ' ' + body),
            hasZipFiles: attachments.some(f => f.toLowerCase().endsWith('.zip')),
        };
    } catch (error) {
        console.error('メールデータの抽出に失敗しました:', error);
        return null;
    }
}

/**
 * 送信先メールアドレスを抽出
 */
function extractRecipients(): Recipient[] {
    const recipients: Recipient[] = [];

    // To, Cc, Bccのフィールドを取得
    const recipientFields = [
        { selector: '[name="to"]', type: 'to' },
        { selector: '[name="cc"]', type: 'cc' },
        { selector: '[name="bcc"]', type: 'bcc' },
    ];

    recipientFields.forEach(({ selector }) => {
        const field = document.querySelector(selector);
        if (!field) return;

        // Gmailの送信先要素を取得
        const recipientElements = field.querySelectorAll('[email]');

        recipientElements.forEach((elem) => {
            const email = elem.getAttribute('email') || elem.getAttribute('data-hovercard-id') || '';
            const name = elem.getAttribute('name') || elem.textContent?.trim() || '';

            if (email) {
                recipients.push({
                    email,
                    name: name || email,
                    isInternal: false, // Personal use: always external
                    domain: extractDomain(email),
                });
            }
        });
    });

    return recipients;
}

/**
 * 件名を抽出
 */
function extractSubject(): string {
    const subjectField = document.querySelector('[name="subjectbox"]') as HTMLInputElement;
    return subjectField?.value || '';
}

/**
 * 本文を抽出
 */
function extractBody(): string {
    // Gmailの本文エディタ
    const bodyField = document.querySelector('[g_editable="true"]') as HTMLElement;
    return bodyField?.innerText || bodyField?.textContent || '';
}

/**
 * 添付ファイル名を抽出
 */
function extractAttachments(): string[] {
    const attachments: string[] = [];

    // 添付ファイル表示エリア
    const attachmentElements = document.querySelectorAll('[data-tooltip*="添付"], [data-tooltip*="Attach"], .vI');

    attachmentElements.forEach((elem) => {
        const filename = elem.getAttribute('data-tooltip') ||
            elem.getAttribute('title') ||
            elem.textContent?.trim();

        if (filename && !attachments.includes(filename)) {
            attachments.push(filename);
        }
    });

    return attachments;
}

/**
 * 送信ボタンを見つける
 */
export function findSendButton(): HTMLElement | null {
    // Gmailの送信ボタンのセレクタ（複数パターン対応）
    const selectors = [
        '[role="button"][data-tooltip*="送信"]',
        '[role="button"][aria-label*="送信"]',
        '[role="button"][data-tooltip*="Send"]',
        '[role="button"][aria-label*="Send"]',
        '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
    ];

    for (const selector of selectors) {
        const button = document.querySelector(selector) as HTMLElement;
        if (button) return button;
    }

    return null;
}
