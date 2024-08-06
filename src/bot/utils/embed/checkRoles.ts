import { ExtendedInteraction } from "@/bot/typings/Commands";
import { ExtendedModalInteraction } from "@/bot/typings/Modals";
import { editErrorReply } from "../discord/editErrorReply";
import { RoleError } from "@/bot/errors/RoleError";

type CheckIfNotRoleResponse = boolean;

async function checkIfRole(interaction: ExtendedInteraction | ExtendedModalInteraction, roleName: string): Promise<CheckIfNotRoleResponse> {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const role = interaction.guild?.roles.cache.find(r => r.name === roleName);
    const hasRole = member?.roles.cache.has(role?.id ?? "");

    if (!hasRole) {
        await editErrorReply({
            error: new RoleError(roleName),
            interaction,
            title: `Você não possui a função necessária: ${roleName}.`
        });
        return false;
    }

    return true;
}

export async function checkIfNotAdminRole(interaction: ExtendedInteraction | ExtendedModalInteraction): Promise<CheckIfNotRoleResponse> {
    return checkIfRole(interaction, "Administração");
}

export async function checkIfNotDevRole(interaction: ExtendedInteraction | ExtendedModalInteraction): Promise<CheckIfNotRoleResponse> {
    return checkIfRole(interaction, "Desenvolvimento");
}

export async function checkIfNotEventRole(interaction: ExtendedInteraction | ExtendedModalInteraction): Promise<CheckIfNotRoleResponse> {
    return checkIfRole(interaction, "Eventos");
}

export async function checkIfNotMarketingRole(interaction: ExtendedInteraction | ExtendedModalInteraction): Promise<CheckIfNotRoleResponse> {
    return checkIfRole(interaction, "Marketing");
}