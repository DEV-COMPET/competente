import { ButtonStyle, ButtonInteraction } from 'discord.js';

export interface ExtendedButton {
  customId: string;
  label: string;
  style: ButtonStyle;
  url?: string;
}

export type ButtonType = {
  run: RunFunction;
} & ExtendedButton;

export interface RunOptions {
  // Defina as propriedades necessárias para as opções de execução
  // Por exemplo:
  interaction: ButtonInteraction;
}

export type RunFunction = (options: RunOptions) => any;
