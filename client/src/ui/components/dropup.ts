const dropups = document.querySelectorAll('#dropup') as NodeListOf<HTMLDivElement>;

dropups.forEach((dropup) => {
    const content = dropup.querySelector('.dropup-content')! as HTMLDivElement;

    let hovered = false;

    dropup.addEventListener('mouseenter', () => {
       content.style.transform = 'translateY(0)';
         hovered = true;
    })

    dropup.addEventListener('mouseleave', () => {
        hovered = false;
        setTimeout(() => {
            if (!hovered) {
                content.style.transform = 'translateY(300%)';
            }
        }, 100)
    })

})
