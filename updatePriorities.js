export async function updatePriorities(categoriesIds) {
    let priority = 1;

    
    const reversedCategoriesIds = categoriesIds.slice().reverse();
    for (const id of reversedCategoriesIds) {
        console.log(`The id ${id} has priority ${priority}`);
        // update the priority of the category
        //await updateCategoryPriority(id, priority);
        priority++;
    }
    return true;
}