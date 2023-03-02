import { ButtonType } from "./controllerManager";

export default function hasButton(buttons: ButtonType[], button: ButtonType): boolean {
	return buttons.includes(button);
}
