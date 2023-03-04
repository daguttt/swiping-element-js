import {
    $target,
    INITIAL_TARGET_HEIGHT,
    isTargetExpanded,
    previousPointerYPosition,
    setTargetHeight,
    setPreviousPointerYPosition,
    toggleButtonState,
    toggleTargetState,
    HEIGHT_RATE_TO_CHANGE_STATE,
    MAX_TARGET_HEIGHT,
    getTargetHeight,
} from "./main";

export function initSwipingUp(event: PointerEvent) {
    if (!isTargetExpanded) return;
    $target.setPointerCapture(event.pointerId);
    $target.addEventListener("pointermove", swipeUp);
    $target.addEventListener("pointerup", unListenSwippingUp);
}

function swipeUp(event: PointerEvent) {
    const { offsetY: currentPointerYPosition } = event;

    // At first move
    if (previousPointerYPosition === null) {
        setPreviousPointerYPosition(currentPointerYPosition);
        return;
    }
    let moveY = currentPointerYPosition - previousPointerYPosition;

    if (moveY < 0.5 && moveY > -0.5) return;
    setTargetHeight((previousHeight) => {
        moveY = moveY < 0 ? Math.abs(moveY) : -moveY;

        let newHeight = previousHeight - moveY;
        if (newHeight < INITIAL_TARGET_HEIGHT)
            newHeight = INITIAL_TARGET_HEIGHT;

        return `${newHeight}px`;
    });
    setPreviousPointerYPosition(currentPointerYPosition);
}

function unListenSwippingUp(event: PointerEvent) {
    $target.removeEventListener("pointermove", swipeUp);
    $target.removeEventListener("pointerup", unListenSwippingUp);
    $target.releasePointerCapture(event.pointerId);

    const heightNeedToFold = MAX_TARGET_HEIGHT - HEIGHT_RATE_TO_CHANGE_STATE;

    const currentTargetHeight = getTargetHeight();
    if (currentTargetHeight === INITIAL_TARGET_HEIGHT) return;

    const newHeight = setTargetHeight((previousHeight) => {
        return previousHeight > heightNeedToFold
            ? `${MAX_TARGET_HEIGHT}px`
            : `${INITIAL_TARGET_HEIGHT}px`;
    });
    setPreviousPointerYPosition(null);

    if (newHeight === MAX_TARGET_HEIGHT) return;

    $target.removeEventListener("pointerdown", initSwipingUp);
    toggleTargetState();
    toggleButtonState();
}
