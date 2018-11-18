export function updateObjectInArray(array, data) {
  return array.map((item, index) => {
    if (index !== data.index) {
      // This isn't the item we care about - keep it as-is
      return item
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...data.item
    }
  })
}


export function removeItem(array,data){
  return array.filter((item, index) => index !== data.index);
}

export function insertItem(array, action) {
  let newArray = array.slice();
  newArray.splice(action.index, 0, action.item);
  return newArray
}