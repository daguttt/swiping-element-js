import {
    $target,
    INITIAL_TARGET_HEIGHT,
    isTargetExpanded,
    MAX_TARGET_HEIGHT,
    previousPointerYPosition,
    setTargetHeight,
    setPreviousPointerYPosition,
    toggleTargetState,
    HEIGHT_RATE_TO_CHANGE_STATE,
    getTargetHeight,
} from "./main";
import { initSwipingUp } from "./swipe-up";

export function swipeDown(event: PointerEvent) {
    if (isTargetExpanded) return;
    const { offsetY: currentPointerYPosition } = event;

    // At first move
    if (previousPointerYPosition === null) {
        setPreviousPointerYPosition(currentPointerYPosition);
        return;
    }

    let moveY = currentPointerYPosition - previousPointerYPosition;

    if (moveY < 0.5 && moveY > -0.5) return;
    setTargetHeight((previousHeight) => {
        let newHeight = previousHeight + moveY;
        if (newHeight < INITIAL_TARGET_HEIGHT)
            newHeight = INITIAL_TARGET_HEIGHT;

        return `${newHeight}px`;
    });
    setPreviousPointerYPosition(currentPointerYPosition);
}

export function unListenSwipingDown(event: PointerEvent) {
    $target.removeEventListener("pointermove", swipeDown);
    $target.releasePointerCapture(event.pointerId);

    const heightNeedToExpand =
        INITIAL_TARGET_HEIGHT + HEIGHT_RATE_TO_CHANGE_STATE;

    const newHeight = setTargetHeight((previousHeight) => {
        return previousHeight < heightNeedToExpand
            ? `${INITIAL_TARGET_HEIGHT}px`
            : `${MAX_TARGET_HEIGHT}px`;
    });
    setPreviousPointerYPosition(null);

    if (newHeight === INITIAL_TARGET_HEIGHT) return;

    // Enable swiping up functionality
    $target.addEventListener("pointerdown", initSwipingUp);
    toggleTargetState();
    $target.textContent = "Swipe me up";
}
