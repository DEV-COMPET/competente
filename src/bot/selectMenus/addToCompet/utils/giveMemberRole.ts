import { DiscordError } from "@/bot/errors/discordError";
import { Either, left, right } from "@/api/@types/either";
import { InvalidInputsError } from "@/bot/errors/invalidInputsError";
import { ExtendedStringSelectMenuInteraction } from "@/bot/typings/SelectMenu";

interface giveMemberRoleResquest {
    interaction: ExtendedStringSelectMenuInteraction,
    roleName: string,
    competiano: string
}

export const giveMemberRole = async ({ interaction, roleName, competiano }: giveMemberRoleResquest): Promise<giveMemberRoleResponse> => {
    
    const member = interaction.guild?.members.cache.get(competiano);

    if (!member) {
        return left({ error: new InvalidInputsError("Membro não encontrado") });
    }

    const role = interaction.guild?.roles.cache.find(role => role.name === roleName);
    if (!role) {
        return left({ error: new InvalidInputsError("Cargo não encontrado") });
    }

    try {
        await member.roles.add(role);
    
    } catch (error) {
        return left({ error: new DiscordError("Erro ao atribuir cargo") });
    }

    return right({ roleName });
}

type giveMemberRoleResponse = Either<
    { error: InvalidInputsError | DiscordError},
    { roleName: string }
>