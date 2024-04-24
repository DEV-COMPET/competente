interface CompetianoUpdateMemberStatus {
    nome: string
}

const selectMenuList: CompetianoUpdateMemberStatus[] = [];
const currentPage: number[] = [1];
const previousPage: CompetianoUpdateMemberStatus = { nome: "Anterior" };
const nextPage: CompetianoUpdateMemberStatus = { nome: "Próximo" };

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