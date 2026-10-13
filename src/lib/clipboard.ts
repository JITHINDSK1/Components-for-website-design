import confetti from 'canvas-confetti';

export async function copyToClipboard(text: string, triggerConfetti = false): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    if (triggerConfetti) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#6366F1', '#A855F7', '#38BDF8'],
        disableForReducedMotion: true,
      });
    }

    return true;
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
    return false;
  }
}

export function formatCopyWithContext(title: string, sourceUrl: string, promptText: string): string {
  return `/* 
 * Source: ${title}
 * Origin: ${sourceUrl || 'Personal Vault'}
 */

${promptText}`;
}
