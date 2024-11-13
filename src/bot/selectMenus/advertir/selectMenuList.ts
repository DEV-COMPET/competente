interface Competiano {
    email: string;
    nome: string;
}

const selectMenuList: Competiano[] = [];
const currentPage: number[] = [1];
const previousPage: Competiano = { nome: 'Anterior', email: "0" };
const nextPage: Competiano = { nome: 'Próximo', email: "1" };
const cancelOption: Competiano = { nome: "Nenhum", email: "-1" };

function getElementsPerPage(currentPage: number): any[] {
    const itemsPerPage: number = 23;

    if(currentPage == 1) {
        return selectMenuList.slice(0, itemsPerPage); // 23 elementos + opção "nenhum" + opção "próximo"
    }

    const startIndex: number = itemsPerPage + ((currentPage - 2) * (itemsPerPage - 1));
    const endIndex = startIndex + itemsPerPage - 1;

    return selectMenuList.slice(startIndex, endIndex);
}

export { selectMenuList, cancelOption, currentPage, previousPage, nextPage, getElementsPerPage };