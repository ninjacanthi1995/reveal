const requiredReducer = (requiredElements = [], action) => {
  if (action.type === 'addRequiredElement'){
    return [...requiredElements, action.payload];
  } else if (action.type === 'deleteRequiredElement'){
    return requiredElements.filter(e => !action.value.includes(e.title));
  } else if (action.type === 'clearRequiredElements'){
    return []
  } else if (action.type === 'loadRequiredElements'){
    const requireds = []
    const adaptElement = (element, value, title) => {
      if(element) {
        requireds.push({value, title})
      }
    }
    adaptElement(action.payload.birth_date_field, "birth_date", "Date de naissance")
    adaptElement(action.payload.curriculum_field, "curriculum", "Cursus")
    adaptElement(action.payload.firstname_field, "firstname", "Prénom")
    adaptElement(action.payload.lastname_field, "lastname", "Nom")
    adaptElement(action.payload.mention_field, "mention", "Mention")
    adaptElement(action.payload.promo_field, "promo", "Promo")
    adaptElement(action.payload.year_field, "year", "Année")
    return requireds
  } else {
    return requiredElements;
  }
}

export default requiredReducer