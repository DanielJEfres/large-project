
async function pagination(page, limit, Model) {

    let hasPrevPage = true
    let  hasNextPage = true

    const skip = (page - 1) * limit
    const numDocuments = await Model.countDocuments({})
    const numPages = Math.ceil(numDocuments/limit)

    //On first page
    if(page == 1) {

        hasPrevPage = false
        hasNextPage = true
    //On last page
    } else if (page == numPages) {

        hasPrevPage = true
        hasNextPage = false
    }
    
    return {skip:skip, limit:limit, numPages:numPages, hasPrevPage:hasPrevPage, hasNextPage:hasNextPage}
}

export default pagination 
