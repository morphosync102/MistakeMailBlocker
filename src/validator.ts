import { EmailData, CheckResults, Recipient } from './types';
import { isZipFile } from './utils';

/**
 * メールデータを検証して結果を返す
 */
export function validateEmail(emailData: EmailData): CheckResults {
    const externalRecipients: Recipient[] = [];
    const internalRecipients: Recipient[] = [];
    const domains = new Set<string>();

    // 送信先の分類
    emailData.recipients.forEach(recipient => {
        if (recipient.isInternal) {
            internalRecipients.push(recipient);
        } else {
            externalRecipients.push(recipient);
            domains.add(recipient.domain);
        }
    });

    const hasExternal = externalRecipients.length > 0;

    // 送信元チェック
    const senderCheck = {
        status: hasExternal ? 'warning' as const : 'ok' as const,
        message: hasExternal
            ? '社外へ個人アドレスから送信しようとしていませんか?'
            : '(社内への送信)',
        checkboxRequired: hasExternal,
    };

    // 送信先チェック
    const recipientsCheck = {
        status: hasExternal ? 'warning' as const : 'ok' as const,
        message: hasExternal ? '社外の宛先が含まれています' : '社内のみの送信です',
        checkboxRequired: hasExternal,
    };

    // 件名チェック
    const subjectCheck = {
        status: emailData.subject ? 'ok' as const : 'error' as const,
        message: emailData.subject || '件名がありません。',
        checkboxRequired: false,
    };

    // 添付ファイルチェック
    let attachmentsCheck;

    if (emailData.hasAttachmentKeywords && emailData.attachments.length === 0) {
        // 添付の言葉があるのにファイルがない
        attachmentsCheck = {
            status: 'warning' as const,
            message: '件名や本文に"添付"や"attached"、"attachment"の言葉がありますが、添付ファイルがありません。',
            checkboxRequired: true,
        };
    } else if (emailData.attachments.length > 0 && hasExternal) {
        // 社外向けで添付ファイルあり
        const hasNonZip = emailData.attachments.some(file => !isZipFile(file));

        if (hasNonZip) {
            attachmentsCheck = {
                status: 'warning' as const,
                message: '社外向けメールですが、添付ファイルにzipファイルでないファイルがあります。\n' +
                    emailData.attachments.join('\n'),
                checkboxRequired: true,
            };
        } else if (emailData.hasZipFiles) {
            // ZIPファイルはあるがパスワード保護の確認はブラウザではできないため警告
            attachmentsCheck = {
                status: 'warning' as const,
                message: '社外向けメールです。添付のzipファイルにパスワード保護がされているか確認してください。\n' +
                    emailData.attachments.join('\n'),
                checkboxRequired: true,
            };
        } else {
            attachmentsCheck = {
                status: 'ok' as const,
                message: emailData.attachments.join('\n'),
                checkboxRequired: false,
            };
        }
    } else if (emailData.attachments.length > 0) {
        // 社内向けで添付ファイルあり
        attachmentsCheck = {
            status: 'ok' as const,
            message: emailData.attachments.join('\n'),
            checkboxRequired: false,
        };
    } else {
        // 添付ファイルなし
        attachmentsCheck = {
            status: 'ok' as const,
            message: '添付ファイルはありません。',
            checkboxRequired: false,
        };
    }

    return {
        sender: senderCheck,
        recipients: recipientsCheck,
        subject: subjectCheck,
        attachments: attachmentsCheck,
        hasExternalRecipients: hasExternal,
        externalRecipients,
        internalRecipients,
        domains: Array.from(domains),
    };
}
