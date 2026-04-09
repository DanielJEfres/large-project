
async function pagination(page, limit, filter = {}, Model) {

    if( !page ) return 

    let hasPrevPage = true
    let  hasNextPage = true

    const skip = (page - 1) * limit //calculate how many docs to skip over
    const numDocuments = await Model.countDocuments(filter)
    const numPages = Math.ceil(numDocuments/limit)

    //On first page
    if(page == 1) {

        hasPrevPage = false
        hasNextPage = true

    //On last page
    } else if (page == numPages) {

        hasPrevPage = true
        hasNextPage = false
    //Only one page
    } 
    
    //One page
    if(page == 1 && numPages == 1){
        hasPrevPage = false
        hasNextPage = false
    }
    
    return {skip:skip, limit:limit, numPages:numPages, hasPrevPage:hasPrevPage, hasNextPage:hasNextPage}
}

export default pagination 
