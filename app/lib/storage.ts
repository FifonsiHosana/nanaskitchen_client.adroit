export const getUserInfo = () => {
  if (typeof window === "undefined") {
    return { name: "Admin", email: "email@gmail.com" }
  }

  const stored = localStorage.getItem("userInfo")
  return stored
    ? JSON.parse(stored)
    : { name: "Admin", email: "email@gmail.com" }
}
// export const getUserInfo = () => {
//   if (typeof window === "undefined") {
//     return { name: "Admin", email: "email@gmail.com" }
//   }

//   const stored = localStorage.getItem("userInfo")
//   const token = localStorage.getItem("userToken")

//   try {
//     if (!stored || stored === "undefined") {
//       return { name: "Admin", email: "email@gmail.com" }
//     }
//     if (stored === "undefined" && token) return JSON.parse(stored)
//   } catch (error) {
//     console.error("Invalid userInfo in localStorage:", stored)

//     localStorage.removeItem("userInfo")

//     return { name: "Admin", email: "email@gmail.com" }
//   }
// }
