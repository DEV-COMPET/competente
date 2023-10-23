import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, ModalComponentData, TextInputBuilder, TextInputComponentData } from "discord.js";

export function makeModal(inputFields: TextInputComponentData[], modalBuilderRequestData: ModalComponentData) {
  const modal = new ModalBuilder(modalBuilderRequestData)

  const inputComponents = inputFields.map((field) => {
    const inputBuilder = new TextInputBuilder(field)

    return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(inputBuilder);
  });

  modal.addComponents(...inputComponents);

  return modal;
}

export interface MakeModal2Request {
  inputFields: TextInputComponentData[],
  modalBuilderRequestData: ModalComponentData
}

export function makeModal2({ inputFields, modalBuilderRequestData }: MakeModal2Request) {
  const modal = new ModalBuilder(modalBuilderRequestData)

  const inputComponents = inputFields.map((field) => {
    const inputBuilder = new TextInputBuilder(field)

    return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(inputBuilder);
  });

  modal.addComponents(...inputComponents);

  return modal;
}
