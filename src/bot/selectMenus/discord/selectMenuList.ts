interface CompetianoDiscord {
    id: string;
    username: string,
    globalName: string;
}

const selectMenuList: CompetianoDiscord[] = [];
const currentPage: number[] = [1];
const previousPage: CompetianoDiscord = { globalName: 'Anterior', id: "0", username: "Anterior" };
const nextPage: CompetianoDiscord = { globalName: 'Próximo', id: "1", username: "Próximo" };

function getElementsPerPage(currentPage: number): any[] {
    const itemsPerPage: number = 23;

    if(currentPage == 1) {
        console.log(currentPage);
        console.log(0, 24);
        return selectMenuList.slice(0, 24);
    }

    const startIndex: number = 24 + ((currentPage - 2) * (itemsPerPage - 1));
    const endIndex = startIndex + itemsPerPage - 1;

    console.log(currentPage);
    console.log(startIndex, endIndex);

    return selectMenuList.slice(startIndex, endIndex);
}

export { selectMenuList, currentPage, previousPage, nextPage, getElementsPerPage };