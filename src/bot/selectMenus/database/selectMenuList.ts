interface CompetianoUpdateMemberStatus {
    nome: string
}

const selectMenuList: CompetianoUpdateMemberStatus[] = [];
const currentPage: number[] = [1];
const previousPage: CompetianoUpdateMemberStatus = { nome: "Anterior" };
const nextPage: CompetianoUpdateMemberStatus = { nome: "Próximo" };
const cancelOption: CompetianoUpdateMemberStatus = { nome: "Nenhum" };

function getElementsPerPage(currentPage: number): any[] {
    const itemsPerPage: number = 22;

    if (currentPage == 1) {
        const slicedArray = selectMenuList.slice(0, itemsPerPage - 1);
        return slicedArray;
    }

    const startIndex: number = 24 + ((currentPage - 2) * (itemsPerPage - 1));
    const endIndex = startIndex + itemsPerPage - 1;

    //console.log(currentPage);
    //console.log(startIndex, endIndex);

    const slicedArray = selectMenuList.slice(startIndex, endIndex);
    slicedArray.push(cancelOption);

    return slicedArray;
}

export { cancelOption, selectMenuList, currentPage, previousPage, nextPage, getElementsPerPage };