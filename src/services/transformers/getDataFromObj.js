const getDataFromObj = (obj, search) => {
  let output
  search.forEach((searchEl, index) => {
    console.log(index)
    if (obj[searchEl] !== "undefined") {
      if (typeof obj[searchEl] === "string") {
        output = obj[searchEl]
        return
      } else {
        search.shift()
        if (search.length === 0) {
          output = JSON.stringify(obj[searchEl], null, 2)
          return
        }
        output = getDataFromObj(obj[searchEl], search)
      }
    }
  })
  return output
}

export default getDataFromObj
