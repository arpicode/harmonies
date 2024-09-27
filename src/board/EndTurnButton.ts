export default class EndTurnButton {
  public text: string
  public disabled: boolean

  constructor(text: string, disabled = false) {
    this.text = text
    this.disabled = disabled
  }
}
