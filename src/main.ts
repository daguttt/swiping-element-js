import "./style.css";
import { unListenSwipingDown, swipeDown } from "./swipe-down";

export const $target: HTMLDivElement = document.querySelector("#target")!;
export function getTargetHeight() {
    const targetStyle: CSSStyleDeclaration = $target.style;
    const isStyleHeightSet = targetStyle.height.endsWith("px");

    const targetHeight = isStyleHeightSet
        ? Number(targetStyle.height.slice(0, -2))
        : INITIAL_TARGET_HEIGHT;

    return targetHeight;
}
export function setTargetHeight(calc: (prevValue: number) => string) {
    const previousTargetHeight = getTargetHeight();
    const newTargetHeight = ($target.style.height = calc(previousTargetHeight));
    return Number(newTargetHeight.slice(0, -2));
}

export const $resetButton: HTMLButtonElement =
    document.querySelector("#reset-button")!;

export function toggleButtonState() {
    $resetButton.disabled = !isTargetExpanded;
}

export const INITIAL_TARGET_HEIGHT = Math.floor(
    $target.getBoundingClientRect().height
);
export const HEIGHT_RATE_TO_CHANGE_STATE = INITIAL_TARGET_HEIGHT * 0.5; // 50%;
export const MAX_TARGET_HEIGHT = 200;

export let isTargetExpanded = false;
export function toggleTargetState() {
    isTargetExpanded = !isTargetExpanded;
}

export let previousPointerYPosition: number | null = null;
/**
 * Update previous pointer position before current movement
 * @param newPositionY @type {number}
 * @returns New pointer position or its reset (undefined)
 */
export function setPreviousPointerYPosition(newPositionY: number | null) {
    return (previousPointerYPosition = newPositionY);
}

/* -**********************************- */
// INIT SWIPING
$target.addEventListener("pointerdown", (event: PointerEvent) => {
    if (isTargetExpanded) return;
    $target.setPointerCapture(event.pointerId);
    $target.addEventListener("pointermove", swipeDown);
    $target.addEventListener("pointerup", unListenSwipingDown, { once: true });
});
