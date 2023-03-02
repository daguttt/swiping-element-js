import {
    $target,
    INITIAL_TARGET_HEIGHT,
    isTargetExpanded,
    MAX_TARGET_HEIGHT,
    previousPointerYPosition,
    setTargetHeight,
    setPreviousPointerYPosition,
    toggleTargetState,
    HEIGHT_NEEDED_TO_CHANGE_STATE,
    toggleButtonState,
    getTargetHeight,
} from "./main";
import { beforeSwipingUp } from "./swipe-up";

export function swipeDown(event: PointerEvent) {
    // return console.log("Swiping down");
    if (isTargetExpanded) return;
    if (event.buttons === 0) return;
    if (event.pointerId > 1) return;

    const { offsetY: currentPointerYPosition, pointerId } = event;

    // console.log({ currentPointerPosition });

    // At first move
    if (previousPointerYPosition === undefined) {
        $target.setPointerCapture(pointerId);
        setPreviousPointerYPosition(currentPointerYPosition);
        return;
    }

    const moveY = Math.abs(currentPointerYPosition - previousPointerYPosition);

    // console.log({ currentPointerPosition, previousPointerPosition, move });

    setTargetHeight((prev) => `${prev + moveY}px`);
    setPreviousPointerYPosition(currentPointerYPosition);

    $target.addEventListener(
        "pointerup",
        createUnListenSwipingDown(event.pointerId)
    );
}

function createUnListenSwipingDown(pointerId: number) {
    // console.log("Creating pointer up event for swipping down");
    return function onPointerUp() {
        $target.releasePointerCapture(pointerId);
        $target.removeEventListener("pointerup", onPointerUp);
        if (previousPointerYPosition === undefined) return;

        const heightNeedToExpand =
            INITIAL_TARGET_HEIGHT + HEIGHT_NEEDED_TO_CHANGE_STATE;

        // console.log({
        //     fiftyPercentOfInitialHeight: heightNeedToExpand,
        //     targetHeight: currentTargetHeight,
        // });

        setTargetHeight((previousHeight) => {
            return previousHeight < heightNeedToExpand
                ? ""
                : `${MAX_TARGET_HEIGHT}px`;
        });
        setPreviousPointerYPosition(undefined);

        const newHeight = getTargetHeight();

        if (newHeight === INITIAL_TARGET_HEIGHT) return;

        // Enable swiping up functionality
        $target.addEventListener("pointerdown", beforeSwipingUp);
        toggleTargetState();
        toggleButtonState();
    };
}
