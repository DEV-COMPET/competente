import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { ButtonType, RunFunction } from './../typings/Button';

export class Button {
  customId: string = '';
  label: string = '';
  style: ButtonStyle = ButtonStyle.Primary;
  url?: string;
  run?: RunFunction;

  constructor(buttonOptions: ButtonType) {
    Object.assign(this, buttonOptions);
    console.log("Button created, customId is", this.customId);
  }

  toButtonBuilder(): ButtonBuilder {
    const buttonBuilder = new ButtonBuilder()
      .setCustomId(this.customId)
      .setLabel(this.label)
      .setStyle(this.style);

    if (this.url && this.style === ButtonStyle.Link) {
      buttonBuilder.setURL(this.url);
    }

    return buttonBuilder;
  }
}
