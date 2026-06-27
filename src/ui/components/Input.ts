export interface InputOptions {
  readonly label: string;
  readonly type: "text" | "email" | "password";
  readonly placeholder?: string;
}

export class Input {
  private readonly wrapper: HTMLDivElement;
  private readonly inputElement: HTMLInputElement;

  public constructor(options: InputOptions) {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "input-group";

    const labelElement = document.createElement("label");
    labelElement.textContent = options.label;
    labelElement.className = "input-group__label";

    this.inputElement = document.createElement("input");
    this.inputElement.type = options.type;
    this.inputElement.placeholder = options.placeholder ?? "";
    this.inputElement.className = "input-group__field";

    this.wrapper.appendChild(labelElement);
    this.wrapper.appendChild(this.inputElement);
  }

  public render(): HTMLDivElement {
    return this.wrapper;
  }

  public getValue(): string {
    return this.inputElement.value;
  }

  public setValue(value: string): void {
    this.inputElement.value = value;
  }

  public setDisabled(disabled: boolean): void {
    this.inputElement.disabled = disabled;
  }
}