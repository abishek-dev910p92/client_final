  let lastScrollTop = 0;
  const footer = document.querySelector(".footer-container");
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // Scrolling down
      footer.classList.add("hide-footer");
    } else {
      // Scrolling up 
      footer.classList.remove("hide-footer");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    
  });

