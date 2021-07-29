const requiredReducer = (requiredElements = [], action) => {
  if (action.type === 'addRequiredElement'){
    if(requiredElements.includes(action.payload)) return requiredElements
    return [...requiredElements, action.payload];
  } else {
    return requiredElements;
  }
}

export default requiredReducer