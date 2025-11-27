// 自社ドメインの設定 (ここを環境に合わせて変更してください)
const COMPANY_DOMAINS = ['example.com', 'yourcompany.com'];

/**
 * メールアドレスが自社ドメインかどうかをチェック
 */
export function isInternalDomain(email: string): boolean {
    const lowerEmail = email.toLowerCase();

    for (const domain of COMPANY_DOMAINS) {
        const lowerDomain = domain.toLowerCase();
        if (lowerEmail.endsWith(`@${lowerDomain}`) || lowerEmail.endsWith(`.${lowerDomain}`)) {
            return true;
        }
    }

    return false;
}

/**
 * メールアドレスからドメインを抽出
 */
export function extractDomain(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return 'ドメイン不明';
    return email.substring(atIndex + 1).toLowerCase();
}

/**
 * 本文に添付ファイル関連のキーワードが含まれているかチェック
 */
export function hasAttachmentKeywords(text: string): boolean {
    const keywords = ['添付', 'attached', 'attachment'];
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
}

/**
 * ファイル名がZIPファイルかどうかをチェック
 */
export function isZipFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.zip');
}

/**
 * 4桁の送信コードを生成
 */
export function generateSendCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * 現在時刻に基づいて警告レベルの色を取得
 */
export function getTimeBasedColor(): string {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 9) return 'bg-brand-yellow'; // 早朝
    if (hour >= 9 && hour < 12) return 'bg-brand-green'; // 午前
    if (hour >= 12 && hour < 16) return 'bg-brand-orange'; // 午後
    if (hour >= 16 && hour < 22) return 'bg-brand-red'; // 夕方以降
    return 'bg-brand-yellow'; // 深夜
}
