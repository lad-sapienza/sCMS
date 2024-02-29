import "bootstrap/dist/js/bootstrap.min.js"

export const onInitialClientRender = () => {
  // Redirect logic
  const currentPath = window.location.pathname

  // Replace "/path" with the actual path you want to redirect from
  if (currentPath === "/sCMS/") {
    // Replace "/home" with the actual path you want to redirect to
    window.location.replace("/sCMS/home")
  }
}
