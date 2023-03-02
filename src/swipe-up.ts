import {
    $target,
    INITIAL_TARGET_HEIGHT,
    isTargetExpanded,
    previousPointerYPosition,
    setTargetHeight,
    setPreviousPointerYPosition,
    toggleButtonState,
    toggleTargetState,
    HEIGHT_NEEDED_TO_CHANGE_STATE,
    MAX_TARGET_HEIGHT,
    getTargetHeight,
} from "./main";

export function beforeSwipingUp() {
    $target.addEventListener("pointermove", swipeUp);
}

function swipeUp(event: PointerEvent) {
    console.log({ buttons: event.buttons });

    if (!isTargetExpanded) return;
    if (event.buttons === 0) return;
    if (event.pointerId > 1) return;

    const { offsetY: currentPointerYPosition, pointerId } = event;

    if (previousPointerYPosition === undefined) {
        $target.setPointerCapture(pointerId);
        setPreviousPointerYPosition(currentPointerYPosition);
        return;
    }

    let moveY = Math.abs(currentPointerYPosition - previousPointerYPosition);

    setTargetHeight((previousHeight) => {
        let newHeight = previousHeight - moveY;
        if (newHeight < INITIAL_TARGET_HEIGHT)
            newHeight = INITIAL_TARGET_HEIGHT;
        return `${newHeight}px`;
    });
    setPreviousPointerYPosition(currentPointerYPosition);

    $target.addEventListener("pointerup", unListenSwippingUp);
}

function unListenSwippingUp() {
    console.log({
        msg: `init ${unListenSwippingUp.name}`,
        targetHeight: getTargetHeight(),
    });

    if (previousPointerYPosition === undefined) return;

    const heightNeedToFold = MAX_TARGET_HEIGHT - HEIGHT_NEEDED_TO_CHANGE_STATE;

    const newHeight = setTargetHeight((previousHeight) => {
        if (previousHeight === INITIAL_TARGET_HEIGHT) return "";
        return previousHeight > heightNeedToFold
            ? `${MAX_TARGET_HEIGHT}px`
            : "";
    });
    setPreviousPointerYPosition(undefined);
    $target.removeEventListener("pointermove", swipeUp);
    $target.removeEventListener("pointerup", unListenSwippingUp);

    if (newHeight === MAX_TARGET_HEIGHT) return;

    $target.removeEventListener("pointerdown", beforeSwipingUp);
    toggleTargetState();
    toggleButtonState();
}
