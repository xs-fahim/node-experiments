let item_array = [
    { keyword: "elementor addon", postiion: 2, date: "Jul 02, 2023" },
    { keyword: "elementor", postiion: 3, date: "Jul 02, 2023" },
    { keyword: "elements kit", postiion: 4, date: "Jul 02, 2023" },
    { keyword: "wordpress addon", postiion: 5, date: "Jul 02, 2023" },
    { keyword: "wordpress elementor", postiion: 6, date: "Jul 02, 2023" },
    { keyword: "wpmet", postiion: 7, date: "Jul 02, 2023" }
];

let item_order = ["addon", "elementor addon", "elementor", "elements kit", "wordpress addon"];

item_array.forEach(o => {
    if (!item_order.includes(o.keyword)) item_order.push(o.keyword)
})

item_order.forEach(i => {
    if (!item_array.find(o => o.keyword === i)) item_array.push({ keyword: i, postiion: '-' })
})

let result = item_array.sort((a, b) => {
    return item_order.indexOf(a.keyword) - item_order.indexOf(b.keyword);
});

console.log(result)
