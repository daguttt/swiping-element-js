import "./style.css";
import { swipeDown } from "./swipe-down";

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

export const INITIAL_TARGET_HEIGHT = $target.getBoundingClientRect().height;
export const HEIGHT_NEEDED_TO_CHANGE_STATE = INITIAL_TARGET_HEIGHT * 0.5; // 50%;
export const MAX_TARGET_HEIGHT = 200;

export let isTargetExpanded = false;
export function toggleTargetState() {
    isTargetExpanded = !isTargetExpanded;
}

export let previousPointerYPosition: number | undefined;
/**
 * Update previous pointer position before current movement
 * @param newPositionY @type {number}
 * @returns New pointer position or its reset (undefined)
 */
export function setPreviousPointerYPosition(newPositionY: number | undefined) {
    return (previousPointerYPosition = newPositionY);
}

document.addEventListener("DOMContentLoaded", () => {
    $resetButton.disabled = !isTargetExpanded;
});

$resetButton.addEventListener("click", () => {
    if ($resetButton.disabled) return;
    isTargetExpanded = false;
    $resetButton.disabled = !isTargetExpanded;
    $target.style.height = "";
    console.log(`Button ${$resetButton.id} reset`);
});

$target.addEventListener("pointerdown", () => {
    $target.addEventListener("pointermove", swipeDown);
});
