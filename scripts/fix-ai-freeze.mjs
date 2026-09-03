import { readFileSync, writeFileSync } from 'node:fs';

const path = 'CSS3/ai.js';
let text = readFileSync(path, 'utf8');

const start = text.indexOf('async function typeText(');
const stopMarker = '\n\n\n// ==========================================\n// Stop';
const end = text.indexOf(stopMarker, start);

if (start < 0 || end < 0) {
  throw new Error('Could not find typeText block');
}

const replacement = `async function typeText(
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

        element.textContent += text.slice(i, i + chunkSize);
        scrollMessagesToBottom();
        await wait(frameDelay);
    }

    element.textContent = text;
}`;

text = text.slice(0, start) + replacement + text.slice(end);
writeFileSync(path, text, 'utf8');
