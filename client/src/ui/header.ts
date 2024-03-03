import SaveManager from "../profile/saveManager";

const title = document.getElementById('title')!;
title.innerText = 'gartbin';

title.addEventListener('mouseover', () => {
    title.innerText = 'new bin?';
})

title.addEventListener('mouseout', () => {
    title.innerText = 'gartbin';
})

title.addEventListener('click', () => {
    SaveManager.new()
})