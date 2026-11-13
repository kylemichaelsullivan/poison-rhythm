/** True when the event target is a text field or contenteditable. */
export function isTextInputTarget(target: EventTarget | null) {
	return (
		target instanceof HTMLElement &&
		(target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.tagName === 'SELECT' ||
			target.isContentEditable)
	);
}

/** True while a portaled `.Modal` overlay is mounted (focus may sit on `body`). */
export function isAppModalOpen() {
	return document.querySelector('.Modal') !== null;
}

/** Space/Enter/arrows should not fire while focus is on controls or dialogs. */
export function isEditableTarget(target: EventTarget | null) {
	return (
		isTextInputTarget(target) ||
		isAppModalOpen() ||
		(target instanceof HTMLElement &&
			target.closest('button, a[href], [role="button"], [role="dialog"]') !==
				null)
	);
}

/** Escape still stops playback when a control is focused; leave inputs/dialogs alone. */
export function shouldIgnoreEscapeStop(target: EventTarget | null) {
	return (
		isTextInputTarget(target) ||
		(target instanceof Element && target.closest('[role="dialog"]') !== null)
	);
}

/**
 * Outside-dismiss Escape: ignore text fields, dialogs and any mounted app Modal
 * (focus may sit on `body` while `.Modal` is open).
 */
export function shouldIgnoreOutsideEscape(target: EventTarget | null) {
	return shouldIgnoreEscapeStop(target) || isAppModalOpen();
}
