interface CompetianoDiscord {
    id: string;
    username: string,
    globalName: string;
}

const selectMenuList: CompetianoDiscord[] = [];
const currentPage: number[] = [1];
const previousPage: CompetianoDiscord = { globalName: 'Anterior', id: "0", username: "Anterior" };
const nextPage: CompetianoDiscord = { globalName: 'Próximo', id: "1", username: "Próximo" };
const cancelOption: CompetianoDiscord = { globalName: 'Nenhum', id: "-1", username: "Nenhum" };

function getElementsPerPage(currentPage: number): any[] {
    const itemsPerPage: number = 23;

    if(currentPage == 1) {
        return selectMenuList.slice(0, itemsPerPage);
    }

    const startIndex: number = itemsPerPage + ((currentPage - 2) * (itemsPerPage - 1));
    const endIndex = startIndex + itemsPerPage - 1;

    return selectMenuList.slice(startIndex, endIndex);
}

export { cancelOption, selectMenuList, currentPage, previousPage, nextPage, getElementsPerPage, CompetianoDiscord };