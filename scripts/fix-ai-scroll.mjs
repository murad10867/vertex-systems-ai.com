import { readFileSync, writeFileSync } from 'node:fs';

const path = 'CSS3/ai.js';
let text = readFileSync(path, 'utf8');

const start = text.indexOf('async function typeText(');
const stopMarker = '\n\n\n// ==========================================\n// Stop';
const end = text.indexOf(stopMarker, start);

if (start < 0 || end < 0) {
  throw new Error('Could not find typeText block');
}

const replacement = `function isChatNearBottom(threshold = 12) {
    const distanceFromBottom =
        chatView.scrollHeight -
        chatView.scrollTop -
        chatView.clientHeight;

    return distanceFromBottom <= threshold;
}


async function typeText(
    element,
    text,
    token
) {

    if (!element) {
        return;
    }

    if (!settings.animations || !text) {
        element.textContent = text || "";
        return;
    }

    element.textContent = "";

    const targetDuration =
        settings.typingSpeed === "fast"
            ? 450
            : settings.typingSpeed === "slow"
                ? 1600
                : 900;

    const frameDelay = 16;
    const frameCount = Math.max(1, Math.floor(targetDuration / frameDelay));
    const chunkSize = Math.max(1, Math.ceil(text.length / frameCount));

    for (let i = 0; i < text.length; i += chunkSize) {
        if (token !== generationToken) {
            element.textContent = text;
            return;
        }

        // Follow the reply only while the user is already at the bottom.
        // As soon as the user scrolls up, stop forcing the chat back down.
        const shouldFollowOutput = isChatNearBottom();

        element.textContent += text.slice(i, i + chunkSize);

        if (shouldFollowOutput) {
            scrollMessagesToBottom();
        }

        await wait(frameDelay);
    }

    element.textContent = text;
}`;

text = text.slice(0, start) + replacement + text.slice(end);
writeFileSync(path, text, 'utf8');
