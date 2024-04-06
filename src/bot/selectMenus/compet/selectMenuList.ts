interface Competiano {
    email: string;
    nome: string;
}

const selectMenuList: Competiano[] = [];
const currentPage: number[] = [1];
const previousPage: Competiano = { nome: 'Anterior', email: "0" };
const nextPage: Competiano = { nome: 'Próximo', email: "1" };

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